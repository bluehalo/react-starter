resource "aws_security_group" "lb" {
  name   = "${var.service_name}-lb"
  vpc_id = var.vpc_id

  ingress {
    from_port   = var.lb_port
    to_port     = var.lb_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # In a perfect world this would only allow communication either to the target SG or current VPC
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "ingress" {
  name                       = var.service_name
  internal                   = false
  load_balancer_type         = "application"
  enable_deletion_protection = false
  subnets                    = var.loadbalancer_subnets
  security_groups            = [aws_security_group.lb.id]

  tags = merge(var.tags, {})

  # access_logs {
  #   bucket = "somewhere_over_the_rainbow"
  # }
}

resource "aws_lb_target_group" "forwarder" {
  name        = "${var.service_name}-tg"
  port        = var.container_port
  protocol    = var.service_protocol
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    matcher             = "200-399"
    interval            = var.health_check_interval
    healthy_threshold   = var.lb_healthy_threshold
    unhealthy_threshold = var.lb_unhealthy_threshold
    protocol            = var.service_protocol
    path                = var.health_check_path
  }
}

resource "aws_lb_listener" "public_endpoint" {
  load_balancer_arn = aws_lb.ingress.arn
  port              = var.lb_port
  protocol          = var.lb_protocol
  ssl_policy        = var.lb_protocol == "HTTPS" ? "ELBSecurityPolicy-2016-08" : null
  certificate_arn   = var.lb_protocol == "HTTPS" ? var.certificate_arn : null

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.forwarder.arn
  }
}