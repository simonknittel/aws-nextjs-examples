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

    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "3.9.1"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.aws_tags
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
