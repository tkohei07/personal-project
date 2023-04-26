variable "aws_arn" {
  type = string
}

resource "aws_iam_role" "github_actions_role" {
  name = "my-github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
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
