output "service_url" {
  value = aws_apprunner_service.primary.service_url
}

output "access_key" {
  value = aws_iam_access_key.primary.id
}

output "secret_key" {
  value = aws_iam_access_key.primary.secret
  sensitive = true
}

output "ecr" {
  value = aws_ecr_repository.primary.repository_url
}
