resource "aws_acm_certificate" "cname_cert" {
  count = var.acm_arn == null ? 1 : 0
  domain_name = var.cname
  validation_method = "DNS"

  tags = merge(var.tags, {

  })

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket" "host_bucket" {
  count  = var.create_s3_bucket ? 1 : 0
  bucket = var.host_s3_bucket
  # Add specefic S3 policy in the s3-policy.json on the same directory
  #policy = file("s3-policy.json")

  tags = merge(var.tags, {

  })

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "host_bucket_versioning" {
  count  = var.create_s3_bucket ? 1 : 0
  bucket = aws_s3_bucket.host_bucket[0].id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_acl" "example_bucket_acl" {
  count  = var.create_s3_bucket ? 1 : 0
  bucket = aws_s3_bucket.host_bucket[0].id
  acl    = "private"
}

