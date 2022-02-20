#!/bin/bash

aws_profile="${1:-default}"

cd terraform/
ecr=`terraform output ecr | cut -d '"' -f 2`
ecr_id=`echo $ecr | cut -d '.' -f 1`
access_key=`terraform output access_key | cut -d '"' -f 2`
secret_key=`terraform output secret_key | cut -d '"' -f 2`

cd ../
docker build -t $ecr:latest --build-arg AWS_ACCESS_KEY_ID=$access_key --build-arg AWS_SECRET_ACCESS_KEY=$secret_key ./app
aws --profile $aws_profile ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin $ecr_id.dkr.ecr.eu-west-1.amazonaws.com
docker push $ecr:latest
