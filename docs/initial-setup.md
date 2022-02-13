# Initial setup

## Prerequisites

1. Install Docker
2. Install AWS CLI: `brew install awscli`
3. Configure AWS CLI: `aws configure`
4. Install Terraform: `brew tab hashicorp/tap && brew install hashicorp/tap/terraform`

## Steps

_Note: Must be in eu-west-1 since AWS App Runner only supports pulling images from eu-west-1 at the moment._

1. Create a S3 bucket as Terraform Backend

   ´´´sh
   aws --region eu-west-1 s3api create-bucket --bucket example-terraform-backend --create-bucket-configuration LocationConstraint=eu-west-1 --object-ownership BucketOwnerEnforced
   ´´´

2. Use `example.hcl` and `example.tfvars` to configure your infrastructure

3. Initialize Terraform

   ´´´sh
   terraform init -backend-config=example.hcl
   ´´´

4. Initialize all resources

   ´´´sh
   terraform apply -var-file=example.tfvars
   ´´´
