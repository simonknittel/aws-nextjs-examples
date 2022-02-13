terraform {
  required_version = "1.1.5"

  backend "s3" {}

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "4.0.0"
    }

    time = {
      source = "hashicorp/time"
      version = "0.7.2"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.aws_tags
  }
}
