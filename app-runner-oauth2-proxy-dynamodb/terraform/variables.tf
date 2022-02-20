variable "name_prefx" { type = string }

variable "aws_profile" {
  type = string
  default = "default"
}
variable "aws_region" { type = string }
variable "aws_tags" { type = map }
variable "aws_image_environment_variables" { type = map }

variable "cloudflare_api_token" { type = string }
variable "cloudflare_zone_name" { type = string }
variable "cloudflare_cname" { type = string }
