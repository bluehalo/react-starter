resource "aws_s3_bucket_website_configuration" "s3_site" {
  bucket = var.host_s3_bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
  
#   routing_rule {
    
#   }

  depends_on = [
    aws_s3_bucket.host_bucket
  ]
}

#Upload files of your static website
resource "aws_s3_object" "html" {
  for_each = fileset(var.path_to_app, "/**/*.html")

  bucket       = var.host_s3_bucket
  key          = "${var.s3_prefix}/${each.value}"
  source       = "${var.path_to_app}${each.value}"
  etag         = filemd5("${var.path_to_app}${each.value}")
  content_type = "text/html"

  depends_on = [
    aws_s3_bucket_website_configuration.s3_site
  ]
}

resource "aws_s3_bucket_object" "css" {
  for_each = fileset(var.path_to_app, "/**/*.css")

  bucket       = var.host_s3_bucket
  key          = "${var.s3_prefix}/${each.value}"
  source       = "${var.path_to_app}${each.value}"
  etag         = filemd5("${var.path_to_app}${each.value}")
  content_type = "text/css"

  depends_on = [
    aws_s3_bucket_website_configuration.s3_site
  ]
}

resource "aws_s3_bucket_object" "js" {
  for_each = fileset(var.path_to_app, "/**/*.js")

  bucket       = var.host_s3_bucket
  key          = "${var.s3_prefix}/${each.value}"
  source       = "${var.path_to_app}${each.value}"
  etag         = filemd5("${var.path_to_app}${each.value}")
  content_type = "application/javascript"

  depends_on = [
    aws_s3_bucket_website_configuration.s3_site
  ]
}

# Add more aws_s3_bucket_object for the type of files you want to upload
# The reason for having multiple aws_s3_bucket_object with file type is to make sure
# we add the correct content_type for the file in S3. Otherwise website load may have issues

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = var.cname
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    # We generate the name to keep the bucket requirement optional
    domain_name = "${var.host_s3_bucket}.s3.amazonaws.com"
    origin_path = "/${var.s3_prefix}"
    origin_id   = var.cname

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  # Configure logging here if required 	
  #logging_config {
  #  include_cookies = false
  #  bucket          = "mylogs.s3.amazonaws.com"
  #  prefix          = "myprefix"
  #}

  # If you have domain configured use it here 
  aliases = [var.cname]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.cname

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern = "*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = var.cname

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = merge(var.tags, {

  })

  viewer_certificate {
    acm_certificate_arn = var.acm_arn == null ? aws_acm_certificate.cname_cert[0].arn : var.acm_arn
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  depends_on = [
    aws_acm_certificate.cname_cert
  ]
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = [
      "arn:aws:s3:::${var.host_s3_bucket}/${var.s3_prefix}/*"
      ]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "host_bucket" {
  bucket = aws_s3_bucket_website_configuration.s3_site.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_s3_bucket_public_access_block" "host_bucket" {
  bucket = aws_s3_bucket_website_configuration.s3_site.id

  block_public_acls       = true
  block_public_policy     = true
  //ignore_public_acls      = true
  //restrict_public_buckets = true
}