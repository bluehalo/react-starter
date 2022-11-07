resource "aws_vpc" "vpc" {
  cidr_block       = var.cidr
  instance_tenancy = var.instance_tenancy

  tags = {
    Name = var.vpc_name
  }
}

