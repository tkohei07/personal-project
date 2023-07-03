variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list
}

variable "domain_name" {
  type    = string
}

resource "aws_security_group" "this" {
  name        = "${var.name}-alb"
  description = "${var.name} alb"

  vpc_id = "${var.vpc_id}"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name}-alb"
  }
}

resource "aws_security_group_rule" "http" {
  security_group_id = "${aws_security_group.this.id}"

  type = "ingress"

  from_port = 80
  to_port   = 80
  protocol  = "tcp"

  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_lb" "this" {
  load_balancer_type = "application"
  name               = "${var.name}"

  security_groups = ["${aws_security_group.this.id}"]
  subnets         = var.public_subnet_ids
}

resource "aws_lb_listener" "http" {
  port     = "80"
  protocol = "HTTP"

  load_balancer_arn = "${aws_lb.this.arn}"

  # set the fixed response
  default_action {
    type             = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      status_code  = "200"
      message_body = "ok"
    }
  }
}

// add for domain
resource "aws_route53_zone" "this" {
  name = "${var.domain_name}"
}

resource "aws_route53_record" "this" {
  zone_id = aws_route53_zone.this.zone_id
  name    = "${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_lb.this]
}
// add for domain end

output "http_listener_arn" {
  value = "${aws_lb_listener.http.arn}"
}