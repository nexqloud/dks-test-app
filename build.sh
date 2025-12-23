#!/bin/bash

# Build script for x86 (linux/amd64) architecture
# This script builds Docker images for all services and pushes to registry

set -e

# Configuration
REGISTRY="dcp.registry.nexqloud.net/library"
IMAGE_PREFIX="test-app"
TAG="${TAG:-latest}"
PLATFORM="linux/amd64"

# Service directories
SERVICES=("api-gateway" "data-service")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Building Docker images for x86 (amd64)${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Function to build and push a service
build_and_push_service() {
    local service=$1
    local image_name="${REGISTRY}/${IMAGE_PREFIX}-${service}"
    
    echo -e "${YELLOW}Building ${service}...${NC}"
    
    if [ -d "$service" ]; then
        docker buildx build \
            --platform "${PLATFORM}" \
            -t "${image_name}:${TAG}" \
            -f "${service}/Dockerfile" \
            "${service}" \
            --load
        
        echo -e "${GREEN}✓ Successfully built ${image_name}:${TAG}${NC}"
        
        echo -e "${YELLOW}Pushing ${image_name}:${TAG}...${NC}"
        docker push "${image_name}:${TAG}"
        echo -e "${GREEN}✓ Successfully pushed ${image_name}:${TAG}${NC}"
    else
        echo -e "${RED}✗ Directory ${service} not found${NC}"
        exit 1
    fi
}

# Check if docker buildx is available
if ! docker buildx version &> /dev/null; then
    echo -e "${RED}Error: docker buildx is not available${NC}"
    echo "Please install Docker Buildx to build multi-platform images"
    exit 1
fi

# Create builder instance if it doesn't exist
if ! docker buildx inspect multiarch-builder &> /dev/null; then
    echo -e "${YELLOW}Creating buildx builder instance...${NC}"
    docker buildx create --name multiarch-builder --use
fi

# Use the builder
docker buildx use multiarch-builder

# Build and push all services
for service in "${SERVICES[@]}"; do
    build_and_push_service "$service"
    echo ""
done

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All images built and pushed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Pushed images:"
for service in "${SERVICES[@]}"; do
    echo "  - ${REGISTRY}/${IMAGE_PREFIX}-${service}:${TAG}"
done
echo ""
echo "To use a different tag:"
echo "  TAG=v1.0.0 ./build.sh"
