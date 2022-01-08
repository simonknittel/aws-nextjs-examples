# aws-service

Minimal containerized web application with database and authentication hosted on AWS.

## Services and tools used

- [Next.js](https://nextjs.org/)
  - Application
- [AWS App Runner](https://aws.amazon.com/de/apprunner/)
  - Application host
- [Amazon DynamoDB](https://aws.amazon.com/de/dynamodb/)
  - Database
- [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/)
  - Authentication

## Prerequisites

1. Install Docker
2. Install AWS CLI: `brew install awscli`
3. Configure AWS CLI: `aws configure`

## Initial AWS setup

1. Make sure STS is enabled for `eu-west-1` (see <https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_enable-regions.html#sts-regions-activate-deactivate>)

2. Create a ECR repository

   ```sh
   aws --region eu-west-1 ecr create-repository --repository-name simonknittel/aws-service --image-scanning-configuration scanOnPush=true --region eu-west-1
   ```

   _Note: Must be in eu-west-1 since AWS App Runner only supports eu-west-1 at the moment._

3. Build and push an initial container image

4. Create DynamoDB tables

   ```sh
   aws --region eu-west-1 dynamodb create-table --table-name User --billing-mode PAY_PER_REQUEST --attribute-definitions AttributeName=Id,AttributeType=S --key-schema AttributeName=Id,KeyType=HASH

   aws --region eu-west-1 dynamodb create-table \
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

5. Create IAM policy called `aws-service`

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

6. Create user and attach permission policy

   ```txt
   User name: aws-service
   AWS credential type: Access key - Programmatic access
   Policies: aws-service
   ```

7. Create an AWS App Runner auto scaling configuration and service

   ```sh
   aws --region eu-west-1 apprunner create-auto-scaling-configuration --cli-input-json file://aws/create-auto-scaling-configuration.json
   aws --region eu-west-1 apprunner create-service --cli-input-json file://aws/create-service.json
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

## Running the application locally for development

1. Make sure to have [mkcert](https://github.com/FiloSottile/mkcert) installed

   ```sh
   # macOS
   brew install mkcert
   mkcert -install
   ```

   ```powershell
   # Windows (WSL2)
   # 1. Download `.exe` from https://github.com/FiloSottile/mkcert/releases
   .\mkcert-v1.X.X-windows-amd64.exe -install
   ```

2. Create certificates

   ```sh
   # macOS
   mkdir ./https_proxy/certs && mkcert -cert-file ./https_proxy/certs/localhost.crt -key-file ./https_proxy/certs/localhost.key localhost
   ```

   ```powershell
   # Windows (WSL2)
   .\mkcert-v1.X.X-windows-amd64.exe -cert-file localhost.crt -key-file localhost.key localhost
   # 2. Create `certs` directory in `https_proxy`
   # 3. Copy `localhost.crt` and `localhost.key` to `certs` directory
   ```

3. (Windows only) Implement port forwarding

   The `host.docker.internal` in `nginx.local.conf` leads to the Windows host instead of WSL2. Therefore we'll have to add a port forwarding rule to forward port 3000 from the Windows host to WSL2. See <https://github.com/microsoft/WSL/issues/4150> for more information. Caveat: The IP address of the WSL2 may changes and you need to run the following commands again.

   ```powershell
   netsh interface portproxy delete v4tov4 listenport="3000" # Delete any existing port 3000 forwarding
   $wslIp=(wsl -d Ubuntu -e sh -c "ip addr show eth0 | grep 'inet\b' | awk '{print `$2}' | cut -d/ -f1") # Get the private IP of the WSL2 instance
   netsh interface portproxy add v4tov4 listenport="3000" listenaddress="127.0.0.1" connectaddress="$wslIp" connectport="3000" # Create new port forwarding rule
   ```

4. Start the Next.js application

   ```sh
   npm run dev
   ```

5. Start the https reverse proxy (nginx)

   ```sh
   docker compose up
   ```

6. Now access your local application via <https://localhost:8443>

## Other links

- DynamoDB
  - <https://eu-central-1.console.aws.amazon.com/dynamodbv2/home?region=eu-central-1#tables>
  - <https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html>
  - <https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations_Amazon_DynamoDB.html>
  - <https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Types_Amazon_DynamoDB.html>
- MUI
  - <https://mui.com/getting-started/usage/>
  - <https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript>
  - <https://bareynol.github.io/mui-theme-creator/>
