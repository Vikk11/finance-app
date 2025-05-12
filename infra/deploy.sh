#!/bin/bash

set -e

GHCR_OWNER="vikk11"

SERVICES=("transaction-service" "user-service" "budgeting-service")

IMAGE_TAG=$1

if [ -z "$IMAGE_TAG" ]; then
  echo "Usage: ./deploy.sh <image-tag>"
  echo "Example: ./deploy.sh abc123"
  exit 1
fi

for SERVICE in "${SERVICES[@]}"; do
  IMAGE="ghcr.io/$GHCR_OWNER/$SERVICE:$IMAGE_TAG"
  DEPLOYMENT_FILE="infra/k8s/${SERVICE}-deployment.yaml"

  echo "Deploying $SERVICE with image: $IMAGE"
  
  docker pull $IMAGE
  kind load docker-image $IMAGE

  kubectl set image deployment/$SERVICE $SERVICE=$IMAGE --filename=$DEPLOYMENT_FILE

  echo "$SERVICE updated successfully"
done