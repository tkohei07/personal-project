# variable "aws_arn" {
#   type = string
# }

# variable "task_arn" {
#   type = string
# }

# variable "service_arn" {
#   type = string
# }

# variable "rds_arn" {
#   type = string
# }

resource "aws_iam_role" "github_actions_role" {
  name = "my-github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["sts:AssumeRole", "sts:TagSession"]
        Effect = "Allow"
        Principal = {
          AWS = var.aws_arn
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_actions_ecr_full_access" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess"
  role       = aws_iam_role.github_actions_role.name
}

resource "aws_iam_role_policy_attachment" "github_actions_ecs_full_access" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonECS_FullAccess"
  role       = aws_iam_role.github_actions_role.name
}

resource "aws_iam_role_policy_attachment" "github_actions_rds_full_access" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonRDSFullAccess"
  role       = aws_iam_role.github_actions_role.name
}

resource "aws_iam_policy" "assume_roles_policy" {
  name        = "AssumeRolesPolicy"
  description = "Allows the 'terraform' user to assume ECS service, ECS task, and RDS roles"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Resource = [
            var.task_arn,
            var.service_arn,
            var.rds_arn
        ]
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "terraform_user" {
  policy_arn = aws_iam_policy.assume_roles_policy.arn
  user       = "terraform"
}
