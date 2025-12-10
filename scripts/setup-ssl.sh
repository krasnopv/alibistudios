#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# Run this script after setting up Nginx

set -e

echo "=========================================="
echo "SSL Certificate Setup for Alibi"
echo "=========================================="

# Install Certbot
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Get domain name
read -p "Enter your domain name (e.g., example.com): " DOMAIN

# Obtain certificate
echo "Obtaining SSL certificate for $DOMAIN..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Setup auto-renewal
echo "Setting up auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

echo "SSL certificate installed successfully!"
echo "Certificate will auto-renew before expiration."

