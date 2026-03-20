#!/bin/bash

# ============================================
# Viblog Docker Quick Start Script
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Viblog Docker Setup ===${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check .env file
if [ ! -f ../.env ]; then
    echo -e "${YELLOW}No .env file found, creating from example...${NC}"
    cp ../.env.docker.example ../.env
    echo -e "${GREEN}Created .env file. Please edit it with your API keys.${NC}"
    echo -e "${YELLOW}Required: At least one LLM API key (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.)${NC}"
    exit 0
fi

# Create data directories
echo -e "${GREEN}Creating data directories...${NC}"
mkdir -p ../data/postgres ../data/uploads ../data/exports

# Start services
echo -e "${GREEN}Starting Viblog services...${NC}"
docker-compose up -d

# Wait for database
echo -e "${GREEN}Waiting for database to be ready...${NC}"
sleep 5

# Check health
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo -e "${GREEN}=== Viblog is running! ===${NC}"
    echo ""
    echo "Open your browser: http://localhost:3000"
    echo ""
    echo "Useful commands:"
    echo "  docker-compose logs -f app    # View app logs"
    echo "  docker-compose down           # Stop services"
    echo "  docker-compose exec db psql   # Access database"
else
    echo -e "${YELLOW}Services started. Waiting for app to be ready...${NC}"
    echo "Check logs: docker-compose logs -f app"
fi