resource "aws_ecr_repository" "primary" {
  name = "${var.name_prefx}-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  # Pull and push some dummy image to the repository so that the App Runner
  # service can get successfully created

  provisioner "local-exec" {
    command = "docker build -t ${self.repository_url}:latest ./initial_image"
  }

  provisioner "local-exec" {
    command = "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${self.registry_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
  }

  provisioner "local-exec" {
    command = "docker push ${self.repository_url}:latest"
  }
}

resource "aws_dynamodb_table" "user" {
  name = "${var.name_prefx}-User"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "Id"
    type = "S"
  }

  hash_key = "Id"
}

resource "aws_dynamodb_table" "identity_provider_connection" {
  name = "${var.name_prefx}-IdentityProviderConnection"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "Provider"
    type = "S"
  }

  attribute {
    name = "ProviderId"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  hash_key = "Provider"
  range_key = "ProviderId"

  global_secondary_index {
    name = "UserIdIndex"
    hash_key = "UserId"
    projection_type = "ALL"
  }
}

resource "aws_iam_policy" "primary" {
  name = "${var.name_prefx}-policy"

  policy = jsonencode({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "VisualEditor0",
        Effect: "Allow",
        Action: [
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ],
        Resource: [
          aws_dynamodb_table.user.arn,
          aws_dynamodb_table.identity_provider_connection.arn
        ]
      }
    ]
  })
}

resource "aws_iam_user" "primary" {
  name = "${var.name_prefx}-user"
}

resource "aws_iam_access_key" "primary" {
  user = aws_iam_user.primary.name
}

resource "aws_iam_user_policy_attachment" "primary" {
  user = aws_iam_user.primary.name
  policy_arn = aws_iam_policy.primary.arn
}

resource "aws_apprunner_auto_scaling_configuration_version" "primary" {
  auto_scaling_configuration_name = "${var.name_prefx}-asc"
  max_concurrency = 100
  max_size = 1
  min_size = 1
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["build.apprunner.amazonaws.com"]
    }
  }
}

data "aws_iam_policy" "ecr_access" {
  name = "AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role" "access_role" {
  name = "${var.name_prefx}-access-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
  managed_policy_arns = [ data.aws_iam_policy.ecr_access.arn ]
}

# There is some weird issue in which AWS reports that the access role has been
# successfully created but using it right away results in an error saying that
# this access role can't be assumed.
# https://github.com/pulumi/pulumi-aws/issues/1697
resource "time_sleep" "access_role" {
  depends_on = [ aws_iam_role.access_role ]
  create_duration = "10s"
}

resource "aws_apprunner_service" "primary" {
  depends_on = [ time_sleep.access_role ]

  service_name = "${var.name_prefx}-service"

  source_configuration {
    image_repository {
      image_repository_type = "ECR"
      image_identifier = "${aws_ecr_repository.primary.repository_url}:latest"
      image_configuration {
        runtime_environment_variables = merge({
          AWS_ACCESS_KEY_ID = aws_iam_access_key.primary.id,
          AWS_SECRET_ACCESS_KEY = aws_iam_access_key.primary.secret,
          DYNAMODB_REGION = var.aws_region
          DYNAMODB_USER_TABLE = aws_dynamodb_table.user.name
          DYNAMODB_IDENTITYPROVIDERCONNECTION_TABLE = aws_dynamodb_table.identity_provider_connection.name
        }, var.aws_image_environment_variables)
        port = 8080
      }
    }

    authentication_configuration {
      access_role_arn = aws_iam_role.access_role.arn
    }
  }

  instance_configuration {
    cpu = "1 vCPU"
    memory = "2 GB"
  }

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.primary.arn

  health_check_configuration {
    path = "/ping"
    protocol = "HTTP"
  }
}
