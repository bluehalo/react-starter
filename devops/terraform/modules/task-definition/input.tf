variable "cpu" {
  type        = number
  default     = 256
  description = "CPU value to give to the docker definition"
}

variable "name" {
  type        = string
  description = "Name to assign to the new task definition"
}

variable "service_name" {
  type        = string
  description = "Name of the service to associate the definition with"
}

variable "memory" {
  type        = number
  default     = 512
  description = "Memory amount in MB to give to the docker definition"
}

variable "log_group" {
  type        = string
  description = "Name of the cloudwatch group to store logs in"
}

variable "port_mappings" {
  type = list(map(number))
  default = [
    {
      containerPort = 443
      hostPort      = 443
    }
  ]
}

variable "permissions" {
  type        = string
  default     = null
  description = "Json encoded string of permissions to attach to the container"
}

variable "env_vars" {
  type        = map(string)
  default     = {}
  description = "Environment variables to pass to the container in {<key> = <value>, <key> = <value>} form"
}

variable "image" {
  type        = string
  description = "Container image to attach to the task defition"
}

variable "tags" {
  type        = map(any)
  description = "Tags to apply to all resources. Ie: environment, cost tracking, etc..."
  default     = {}
}

variable "secrets" {
  type = list(object({
    name      = string
    valueFrom = string
  }))
  default     = []
  description = "Secrets to load into the container's environment"
}

variable secrets_keys {
  type = list(string)
  default = []
  description = "If there are any kms keys used with the secrets, add them here"
}