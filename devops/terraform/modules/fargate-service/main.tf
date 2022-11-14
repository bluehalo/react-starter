module "secrets" {
  source = "../secrets"

  secrets         = var.secrets
  region          = var.region
  # @TODO: Fix the permissions when using a customer managed key
  create_new_key  = false
  recovery_window = 0
}

resource "aws_ecs_cluster" "cluster" {
  count = var.create_new_cluster ? 1 : 0
  name  = var.cluster_name

  # @TODO: Add support for logging
}

data "aws_ecs_cluster" "cluster" {
  cluster_name = var.cluster_name

  depends_on = [
    aws_ecs_cluster.cluster
  ]
}

resource "aws_ecr_repository" "service_repo" {
  count = var.create_ecr_repo ? 1 : 0
  name                 = var.service_name
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }
}

resource "aws_cloudwatch_log_group" "logs" {
  name = var.service_name

  retention_in_days = var.log_retention
}

module "image" {
  source = "../task-definition"

  name         = var.service_name
  service_name = var.service_name
  image        = var.image_tag == null ? "${var.service_name}:latest" : var.image_tag
  log_group    = aws_cloudwatch_log_group.logs.name
  env_vars     = var.env_vars
  secrets      = module.secrets.fargate_secrets
  port_mappings = [
    {
      containerPort = var.container_port
      hostPort      = var.container_port
    }
  ]

  depends_on = [
    module.secrets
  ]
}

resource "aws_security_group" "service" {
  name   = "${var.service_name}-fargate"
  vpc_id = var.vpc_id

  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
    # cidr_blocks = ["0.0.0.0/0"]
  }

  // Required in order to pull down the image
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "app" {
  name            = var.service_name
  cluster         = data.aws_ecs_cluster.cluster.arn
  task_definition = module.image.task_definition_arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets = var.service_subnets
    security_groups = [
      aws_security_group.service.id
    ]
    // Required if deploying to a public subnet
    assign_public_ip = true
  }


  #   ordered_placement_strategy {
  #     type  = "binpack"
  #     field = "cpu"
  #   }

  load_balancer {
    target_group_arn = aws_lb_target_group.forwarder.arn
    container_name   = var.service_name
    container_port   = var.container_port
  }

  #   placement_constraints {
  #     type       = "memberOf"
  #     expression = "attribute:ecs.availability-zone in [us-west-2a, us-west-2b]"
  #   }

  # We don't want to mess with the autoscaling
  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }

  depends_on = [
    module.image,
    aws_lb_target_group.forwarder
  ]
}