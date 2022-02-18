# AWS App Runner + oauth2-proxy + Next.js + Amazon DynamoDB

This directory contains an [Next.js](https://nextjs.org/) application hosted on [AWS App Runner](https://aws.amazon.com/apprunner/). The container has [oauth2-proxy](https://github.com/oauth2-proxy/oauth2-proxy) as authentication layer in front of the Next.js application. This repo also contains [Terraform](https://www.terraform.io/) config to deploy everything. For demonstration purposes the Next.js application takes the authenticated user's details and stores it in [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) tables.

_Disclaimer: This code currently can't be used as is. Each individual part (Next.js application, Terraform config, etc.) isn't exactly anything finished or useful. It's mostly just a demonstration about how these things can be coupled and deployed._

## Initial setup

See [docs/initial-setup.md](./docs/initial-setup.md)

## Deploying a new image

See [docs/deploying-a-new-image.md](./docs/deploying-a-new-image.md)

## Running the application locally for development

See [docs/running-locally.md](./docs/running-locally.md)
