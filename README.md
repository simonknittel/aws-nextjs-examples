# AWS + Next.js examples

- [AWS App Runner + oauth2-proxy + Next.js + Amazon DynamoDB](./app-runner-oauth2-proxy-dynamodb/)

  This directory contains an [Next.js](https://nextjs.org/) application hosted on [AWS App Runner](https://aws.amazon.com/apprunner/). The container has [oauth2-proxy](https://github.com/oauth2-proxy/oauth2-proxy) as authentication layer in front of the Next.js application. This repo also contains [Terraform](https://www.terraform.io/) config to deploy everything. For demonstration purposes the Next.js application takes the authenticated user's details and stores it in [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) tables.
