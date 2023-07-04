variable "db_username" {
  type        = string
}

variable "db_password" {
  type        = string
}

variable "db_name" {
  type        = string
}

variable "domain_name" {
  type    = string
  default = "tkohei-project.com"
}

variable "dsn" {
  type        = string
}

variable "aws_arn" {
  type        = string
}

variable "task_arn" {
  type        = string
}

variable "service_arn" {
  type        = string
}

variable "rds_arn" {
  type        = string
}

variable "googlemaps_api_key" {
  type        = string
}