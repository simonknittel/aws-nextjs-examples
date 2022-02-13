# Deploying a new image

_Note: Make sure to have completed [docs/initial-setup.md](./initial-setup.md) first._

1. Build and tag the container image

   ```sh
   docker build -t xxxxxxxxxxxx.dkr.ecr.eu-west-1.amazonaws.com/example-repo:latest --build-arg AWS_ACCESS_KEY_ID= --build-arg AWS_SECRET_ACCESS_KEY= ./app
   ```

2. Authenticate your Docker installation with ECR and push the image

   ```sh
   aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin xxxxxxxxxxxx.dkr.ecr.eu-west-1.amazonaws.com
   docker push xxxxxxxxxxxx.dkr.ecr.eu-west-1.amazonaws.com/example-repo:latest
   ```
