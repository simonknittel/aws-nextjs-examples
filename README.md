# aws-service

Minimal containerized web application with database and authentication hosted on AWS.

## Services and tools used

* [Next.js](https://nextjs.org/)
  * Application
* [AWS App Runner](https://aws.amazon.com/de/apprunner/)
  * Application host
* [Amazon DynamoDB](https://aws.amazon.com/de/dynamodb/)
  * Database
* [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/)
  * Authentication

## Prerequisites

1. Install Docker
2. Install AWS CLI: `brew install awscli`
3. Configure AWS CLI: `aws configure`

## Initial AWS setup

1. Create a ECR repository

    ```sh
    aws ecr create-repository --repository-name simonknittel/aws-service --image-scanning-configuration scanOnPush=true --region eu-west-1
    ```

    _Note: Must be in eu-west-1 since AWS App Runner only supports eu-west-1 at the moment._

2. Create DynamoDB tables

    ```sh
    aws dynamodb create-table --table-name User --billing-mode PAY_PER_REQUEST --attribute-definitions AttributeName=Id,AttributeType=S --key-schema AttributeName=Id,KeyType=HASH

    aws dynamodb create-table \
        --table-name IdentityProviderConnection \
        --billing-mode PAY_PER_REQUEST \
        --attribute-definitions AttributeName=Provider,AttributeType=S \
                                AttributeName=ProviderId,AttributeType=S \
                                AttributeName=UserId,AttributeType=S \
        --key-schema AttributeName=Provider,KeyType=HASH \
                     AttributeName=ProviderId,KeyType=RANGE \
        --global-secondary-indexes \
            "[{
                \"IndexName\": \"UserIdIndex\",
                \"KeySchema\": [{
                    \"AttributeName\": \"UserId\",
                    \"KeyType\": \"HASH\"
                }],
                \"Projection\": {
                    \"ProjectionType\": \"ALL\"
                }
            }]"
    ```

3. Create IAM policy called `aws-service`

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": [
                    "dynamodb:BatchGetItem",
                    "dynamodb:BatchWriteItem",
                    "dynamodb:PutItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:GetItem",
                    "dynamodb:Scan",
                    "dynamodb:UpdateItem"
                ],
                "Resource": [
                    "arn:aws:dynamodb:eu-central-1:533499034851:table/User",
                    "arn:aws:dynamodb:eu-central-1:533499034851:table/IdentityProviderConnection"
                ]
            }
        ]
    }
    ```

4. Create user and attach permission policy

    ```txt
    User name: aws-service
    AWS credential type: Access key - Programmatic access
    Policies: aws-service
    ```

5. Build and push an initial container image

6. Create an AWS App Runner service via the AWS Management Console

    ```txt
    Repository type: Container registry
    Provider: Amazon ECR
    Container image URI: ...
    Deployment trigger: Automatic
    ECR access role: Create a new service role

    Service name: aws-service
    Virtual CPU & memory: 1 vCPU & 2 GB
    Environmental variables: See .env
    Port: 8080

    Auto scaling configuration: Custom configuration
    Concurrency: 100
    Minimum size: 1 instance(s)
    Maximum size: 1 instance(s)
    ```

    _Note: Must be in eu-west-1 since AWS App Runner only supports eu-west-1 at the moment._

## Build and push a container image / deploy a new image

1. Authenticate your Docker installation with ECR

    ```sh
    aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 533499034851.dkr.ecr.eu-west-1.amazonaws.com
    ```

2. Build and tag the container image

    ```sh
    docker build -t simonknittel/aws-service --build-arg AWS_ACCESS_KEY_ID= --build-arg AWS_SECRET_ACCESS_KEY= ./app
    docker tag simonknittel/aws-service:latest 533499034851.dkr.ecr.eu-west-1.amazonaws.com/simonknittel/aws-service:latest
    ```

3. Push the container image

    ```sh
    docker push 533499034851.dkr.ecr.eu-west-1.amazonaws.com/simonknittel/aws-service:latest
    ```

## https proxy for local development

1. Make sure to have [mkcert](https://github.com/FiloSottile/mkcert) installed

    ```sh
    # macOS
    brew install mkcert
    mkcert -install
    ```

2. Create certificates

    ```sh
    mkdir ./https_proxy/certs && mkcert -cert-file ./https_proxy/certs/localhost.crt -key-file ./https_proxy/certs/localhost.key localhost
    ```

3. Start the application and the proxy

    ```sh
    docker compose up --build
    ```

4. Now access your local application via <https://localhost:8443>

## Other links

* DynamoDB
  * <https://eu-central-1.console.aws.amazon.com/dynamodbv2/home?region=eu-central-1#tables>
  * <https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html>
  * <https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations_Amazon_DynamoDB.html>
  * <https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Types_Amazon_DynamoDB.html>
* MUI
  * <https://mui.com/getting-started/usage/>
  * <https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript>
  * <https://bareynol.github.io/mui-theme-creator/>
