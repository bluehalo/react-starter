variable "create_s3_bucket" {
  type        = bool
  default     = true
  description = "Create a new bucket for hosting the site on or use an existing one"
}

variable "host_s3_bucket" {
  type        = string
  description = "Name of the bucket to host the site from"
}

variable "s3_prefix" {
  type        = string
  default     = ""
  description = "Prefix to use when storing the site in s3"
  
  validation {
    condition = can(regex("^[^\\/](?:.*[^\\/])?$", var.s3_prefix))
    error_message = "No leading or trailing slashes are allowed."
  }
}

variable "cname" {
  type        = string
  description = "CNAME to use when hosting the site"
}

variable "path_to_app" {
  type        = string
  description = "Absolute path to the files to serve via s3"
}

variable "acm_arn" {
  type        = string
  default = null
  description = "Arn of an existing acm cert if applicable"
}

variable "tags" {
  type        = map(any)
  description = "Tags to apply to all resources. Ie: environment, cost tracking, etc..."
  default     = {}
}