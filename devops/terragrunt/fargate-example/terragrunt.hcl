terraform {
  source = "${get_terragrunt_dir()}/../..//terraform/modules/fargate-service"
}

locals {
    region = "us-east-1"
    environment = "dev"
}

# Indicate the input values to use for the variables of the module.
inputs = {
  vpc_id = "vpc-ID"
  cluster_name = local.environment
  service_name = "react-test"
  create_ecr_repo = true
  image_tag = "example"
  container_port = 80
  service_protocol = "HTTP"
  service_subnets = [
    # us-east-1a
    "subnet-1",
    # us-east-1b
    "subnet-2"
  ]
  loadbalancer_subnets = [
    # us-east-1a
    "subnet-1",
    # us-east-1b
    "subnet-2"
  ]
  lb_protocol = "HTTP"
  lb_port = 80
  desired_count = 1
  # certificate_arn = "cert_arn"
  env_vars = {
    ENVIRONMENT = "test"
    LOG_LEVEL = "debug"
    DB_USER = "foo"
    DB_PASS = "bar"
    DB_HOST = "mongo"
    USE_REDIS = false
    REDIS_HOST = "redis"
    ENABLE_SSL = false
    SSL_KEY_PASSWORD = "DO_NOT_USE_THIS"
    PORT = 80
  }
}

# If you desire to use a remote state for multiple devs or branches
#   remote_state {
#     backend = "s3"
#     config = {
#       bucket = "mybucket"
#       key    = "path/to/my/key"
#       region = "us-east-1"
#     }
#   }

# Indicate what region to deploy the resources into
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents = <<EOF
provider "aws" {
  region              = "${local.region}"
  default_tags {
    tags = {
      Environment = "${local.environment}"
    }
  }
}
EOF
}