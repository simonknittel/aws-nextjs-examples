# Initial AWS setup

## Prerequisites

1. Install Docker
2. Install AWS CLI: `brew install awscli`
3. Configure AWS CLI: `aws configure`

## Setup

_Note: Must be in eu-west-1 since AWS App Runner only supports pulling images from eu-west-1 at the moment._

1. Make sure STS is enabled for `eu-west-1` (see <https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_enable-regions.html#sts-regions-activate-deactivate>)

2. Create a ECR repository

   ```sh
   aws --region eu-west-1 ecr create-repository --cli-input-json file://aws/create-repository.json
   ```

3. Build and push an initial container image (see [docs/deploy-a-new-image.md](./deploy-a-new-image.md))

4. Create DynamoDB tables

   ```sh
   aws --region eu-west-1 dynamodb create-table --cli-input-json file://aws/create-table-user.json
   aws --region eu-west-1 dynamodb create-table --cli-input-json file://aws/create-table-identity-provider-connection.json
   ```

5. Create IAM policy

   ```sh
   # Make sure to update all ARNs
   aws iam create-policy --policy-name aws-service --policy-document file://aws-service-policy.json --tags Key=project,Value=nextjs-oauth2-proxy-aws-app-runner
   ```

6. Create user, access key and attach permission policy

   ```sh
   aws iam create-user --user-name aws-service --tags Key=project,Value=nextjs-oauth2-proxy-aws-app-runner

   # Note down the AccessKeyId and SecretAccessKey for use in step 7
   aws iam create-access-key --user-name aws-service

   # Make sure to update the ARN
   aws iam attach-user-policy --user-name aws-service --policy-arn arn:aws:iam::xxxxxxxxxxxx:policy/aws-service
   ```

7. Create an AWS App Runner auto scaling configuration and service

   ```sh
   aws --region eu-west-1 apprunner create-auto-scaling-configuration --cli-input-json file://aws/create-auto-scaling-configuration.json
   # arn:aws:apprunner:eu-west-1:533499034851:autoscalingconfiguration/Minimal/1/6d33ef7f43654767b69007b7a7b34326

   # Make sure to update all ARNs, all environment variables and the image identifier
   aws --region eu-west-1 apprunner create-service --cli-input-json file://aws/create-service.json
   ```
