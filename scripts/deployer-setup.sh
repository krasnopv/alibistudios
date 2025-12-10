#!/bin/bash

# Additional setup script to run as deployer user
# Run this after the main setup script: su - deployer, then run this script

set -e

echo "=========================================="
echo "Deployer User Additional Setup"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as deployer
if [ "$USER" != "deployer" ]; then
    echo -e "${YELLOW}This script should be run as deployer user${NC}"
    echo "Switch to deployer: su - deployer"
    exit 1
fi

# Verify Docker access
echo -e "${GREEN}[1/4] Verifying Docker access...${NC}"
if docker ps &>/dev/null; then
    echo -e "${GREEN}✓ Docker accessible without sudo${NC}"
else
    echo -e "${YELLOW}Docker requires sudo or user needs to logout/login${NC}"
    echo "Run: newgrp docker"
fi

# Setup deployment directory
echo -e "${GREEN}[2/4] Setting up deployment directory...${NC}"
cd /opt/alibi
if [ ! -f docker-compose.yml ]; then
    echo "Waiting for docker-compose.yml to be deployed..."
else
    echo -e "${GREEN}✓ Deployment directory ready${NC}"
fi

# Test nginx access
echo -e "${GREEN}[3/4] Testing nginx configuration access...${NC}"
if sudo nginx -t &>/dev/null; then
    echo -e "${GREEN}✓ Nginx configuration accessible${NC}"
else
    echo -e "${YELLOW}Nginx configuration test failed${NC}"
fi

# Create .env template if needed
echo -e "${GREEN}[4/4] Creating environment template...${NC}"
if [ ! -f /opt/alibi/.env.example ]; then
    cat > /opt/alibi/.env.example << 'EOF'
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Application
NODE_ENV=production
PORT=3000
EOF
    echo -e "${GREEN}✓ Created .env.example${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "Deployer Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "You can now:"
echo "  - Manage Docker containers: docker ps, docker-compose up -d"
echo "  - Configure Nginx: sudo nano /etc/nginx/sites-available/alibi"
echo "  - Deploy applications to /opt/alibi"
echo ""
echo "Use aliases:"
echo "  alibi-cd, alibi-logs, alibi-status, alibi-restart"
echo ""

