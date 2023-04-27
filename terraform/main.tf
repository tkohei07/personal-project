terraform {
  // Set up Terraform Cloud for saving terraform.tfstate
  cloud {
    organization = "personal-project-go-react"
    workspaces {
      name = "personal-project-with-aws"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-west-2"
}

variable "name" {
  type    = string
  default = "myapp"
}

variable "azs" {
  default = ["us-west-2a", "us-west-2c", "us-west-2d"]
}

variable "go_image" {
  type        = string
  description = "Docker image for the Go application"
}

variable "nginx_image" {
  type        = string
  description = "Docker image for the Nginx-React application"
}

module "network" {
  source = "./network"

  name = "${var.name}"

  azs = "${var.azs}"
}

module "elb" {
  source = "./elb"

  name = "${var.name}"

  vpc_id            = "${module.network.vpc_id}"
  public_subnet_ids = "${flatten(module.network.public_subnet_ids)}"
}

module "ecs_cluster" {
  source = "./ecs_cluster"

  name = "${var.name}"
}

module "nginx" {
  source = "./nginx"

  name = "${var.name}"

  cluster_name      = "${module.ecs_cluster.cluster_name}"
  vpc_id            = "${module.network.vpc_id}"
  subnet_ids        = "${flatten(module.network.private_subnet_ids)}"
  http_listener_arn = "${module.elb.http_listener_arn}"
  db_username = var.db_username
  db_password = var.db_password
  db_endpoint = "${module.rds.endpoint}"
  dsn = var.dsn
  go_image = var.go_image
  nginx_image = var.nginx_image
}

module "rds" {
  source = "./rds"

  name = "${var.name}"

  vpc_id     = "${module.network.vpc_id}"
  subnet_ids        = "${flatten(module.network.private_subnet_ids)}"

  database_name   = var.db_name
  master_username = var.db_username
  master_password = var.db_password
}

module "github_actions" {
  source  = "./github_actions"
  aws_arn = var.aws_arn
  task_arn = var.task_arn
  service_arn = var.service_arn
  rds_arn = var.rds_arn
}