# aws-service

Minimal containerized web application with database and authentication hosted on AWS.

## Services and tools used

* [Next.js](https://nextjs.org/)
  * Application
* [AWS App Runner](https://aws.amazon.com/de/apprunner/)
  * Application host
* [Amazon DynamoDB](https://aws.amazon.com/de/dynamodb/)
  * Database
* [oauth-proxy](https://oauth2-proxy.github.io/oauth2-proxy/)
  * Authentication
* [AWS Copilot CLI](https://aws.github.io/copilot-cli/)

## Getting started

1. Install Docker
2. Install AWS Copilot CLI and AWS CLI: `brew install aws/tap/copilot-cli awscli`
3. Configure AWS CLI: `aws configure`

##

```sh
copilot init
docker build . -t simonknittel/aws-service:latest
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
    docker compose -f docker-compose.yml up --build
    ```

4. Now access your local application via <https://localhost:8443>
