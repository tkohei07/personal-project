variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list
}

variable "database_name" {
  type = string
}

variable "master_username" {
  type = string
}

variable "master_password" {
  type = string
}

locals {
  name = "${var.name}-postgres"
}

resource "aws_security_group" "this" {
  name        = "${local.name}"
  description = "${local.name}"

  vpc_id = "${var.vpc_id}"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name}"
  }
}

resource "aws_security_group_rule" "postgres" {
  security_group_id = "${aws_security_group.this.id}"

  type = "ingress"

  from_port   = 5432
  to_port     = 5432
  protocol    = "tcp"
  cidr_blocks = ["10.0.0.0/16"]
}

resource "aws_db_subnet_group" "this" {
  name        = "${local.name}"
  description = "${local.name}"
  subnet_ids    = var.subnet_ids
}

resource "aws_db_instance" "this" {
  identifier = local.name

  engine            = "postgres"
  engine_version    = "13.13"
  instance_class    = "db.t3.small"
  allocated_storage = 20

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.this.id]

  db_name  = var.database_name
  username = var.master_username
  password = var.master_password

  backup_retention_period = 7
  skip_final_snapshot     = true
  publicly_accessible     = false
}

output "endpoint" {
  value = aws_db_instance.this.endpoint
}
