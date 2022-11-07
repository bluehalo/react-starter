variable "cidr" {
  type        = string
  default     = "172.31.0.0/16"
  description = "Cidr for the VPC"
}

variable "vpc_name" {
  type        = string
  description = "Name to apply to the VPC for reference"
}