variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "http_listener_arn" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "subnet_ids" {
  type = list
}

variable "db_endpoint" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type = string
}

variable "dsn" {
  type = string
}

variable "go_image" {
  type        = string
  description = "Docker image for the Go application"
}

variable "nginx_image" {
  type        = string
  description = "Docker image for the Nginx-React application"
}

locals {
  name = "${var.name}-nginx"
}

resource "aws_lb_target_group" "this" {
  name = "${local.name}"

  vpc_id = "${var.vpc_id}"

  port        = 80
  target_type = "ip"
  protocol    = "HTTP"

  health_check {
    port = 80
  }
}

# Define the task execution IAM role
resource "aws_iam_role" "ecs-task-execution-roles" {
  name = "ecs-task-execution-roles"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

# Attach an inline policy to the execution role
resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  role       = aws_iam_role.ecs-task-execution-roles.name
}

resource "aws_cloudwatch_log_group" "nginx_logs" {
  name = "/ecs/nginx-logs"
}

resource "aws_cloudwatch_log_group" "backend_logs" {
  name = "/ecs/myapp-backend-logs"
}

data "template_file" "container_definitions" {
  template = "${file("./container_definitions.json")}"

  vars = {
    db_endpoint = var.db_endpoint
    db_username = var.db_username
    db_password = var.db_password
    dsn         = var.dsn
    go_image    = var.go_image
    nginx_image = var.nginx_image
  }
}

resource "aws_ecs_task_definition" "this" {
  family = "${local.name}"

  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  container_definitions = "${data.template_file.container_definitions.rendered}"
  # Assign the execution role ARN to the task definition
  execution_role_arn = aws_iam_role.ecs-task-execution-roles.arn
}

resource "aws_lb_listener_rule" "this" {
  listener_arn = "${var.http_listener_arn}"

  action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.this.id}"
  }

  condition {
    path_pattern {
      values = ["*"]
    }
  }
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

resource "aws_security_group_rule" "this_http" {
  security_group_id = "${aws_security_group.this.id}"

  type = "ingress"

  from_port   = 80
  to_port     = 80
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_ecs_service" "this" {
  depends_on = [aws_lb_listener_rule.this]

  name = "${local.name}-new"

  launch_type = "FARGATE"

  desired_count = 1

  cluster = "${var.cluster_name}"

  task_definition = "${aws_ecs_task_definition.this.arn}"

  network_configuration {
    subnets         = var.subnet_ids
    security_groups = ["${aws_security_group.this.id}"]
  }

  load_balancer {
      target_group_arn = "${aws_lb_target_group.this.arn}"
      container_name   = "myapp-nginx"
      container_port   = "80"
  }

  deployment_controller {
    type = "ECS"
  }
  force_new_deployment = true
}

