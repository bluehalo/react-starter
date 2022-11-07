output "vpc_cidr" {
  value = var.cidr
}

output "vpc_id" {
  value = aws_vpc.vpc.id
}