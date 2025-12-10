#!/bin/bash

# Manual Webmin Installation Script
# Run this if the main setup script fails to install Webmin

set -e

echo "Installing Webmin manually..."

# Method 1: Use the official Webmin installation script
wget https://raw.githubusercontent.com/webmin/webmin/master/setup-repos.sh
chmod +x setup-repos.sh
sudo ./setup-repos.sh

# Install Webmin
sudo apt-get update
sudo apt-get install -y webmin

# Configure Webmin
sudo sed -i 's/allow=.*/allow=*/' /etc/webmin/miniserv.conf
sudo systemctl restart webmin

echo "Webmin installed successfully!"
echo "Access at: https://46.62.255.49:10000"

