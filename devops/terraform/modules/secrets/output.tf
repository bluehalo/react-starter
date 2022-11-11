output "env_map" {
  value = [for k, v in var.secrets : { name = v.env_name, arn = aws_secretsmanager_secret.secret[k].arn }]
}

output "fargate_secrets" {
  value = [for k, v in var.secrets : { name = v.env_name, valueFrom = aws_secretsmanager_secret.secret[k].arn }]
}

output "secret_map" {
  value = [for k, v in var.secrets : { name = v.name, arn = aws_secretsmanager_secret.secret[k].arn }]
}