#!/bin/bash

# Webmin Installation Script
# Run this as root or with sudo

set -e

echo "=========================================="
echo "Installing Webmin"
echo "=========================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Remove any existing problematic Webmin repository
if [ -f /etc/apt/sources.list.d/webmin.list ]; then
    echo "Removing existing Webmin repository..."
    rm -f /etc/apt/sources.list.d/webmin.list
fi

# Method 1: Use official Webmin setup script (recommended)
echo "Downloading Webmin setup script..."
if wget -q https://raw.githubusercontent.com/webmin/webmin/master/setup-repos.sh -O /tmp/webmin-setup.sh; then
    chmod +x /tmp/webmin-setup.sh
    echo "Running Webmin repository setup..."
    /tmp/webmin-setup.sh
    
    # Update package list
    apt-get update
    
    # Install Webmin
    if apt-get install -y webmin; then
        echo "✓ Webmin installed successfully!"
        
        # Configure Webmin
        if [ -f /etc/webmin/miniserv.conf ]; then
            # Allow access from anywhere (you can restrict this later)
            sed -i 's/allow=.*/allow=*/' /etc/webmin/miniserv.conf
            systemctl restart webmin
            echo "✓ Webmin configured and started"
        fi
        
        echo ""
        echo "=========================================="
        echo "Webmin Installation Complete!"
        echo "=========================================="
        echo ""
        echo "Access Webmin at: https://46.62.255.49:10000"
        echo "Login with: root / your-root-password"
        echo ""
        echo "To check status: systemctl status webmin"
        echo ""
        
        rm -f /tmp/webmin-setup.sh
        exit 0
    else
        echo "Installation via repository failed, trying alternative method..."
    fi
else
    echo "Could not download setup script, trying alternative method..."
fi

# Method 2: Direct DEB package installation (fallback)
echo "Trying direct DEB package installation..."
cd /tmp

# Download Webmin DEB package
if wget -q https://download.webmin.com/download/virtualmin/webmin-current-virtualmin.deb -O webmin.deb 2>/dev/null || \
   wget -q https://download.webmin.com/download/webmin-current.deb -O webmin.deb 2>/dev/null; then
    
    # Install dependencies first
    apt-get install -y perl libnet-ssleay-perl openssl libauthen-pam-perl libpam-runtime libio-pty-perl apt-show-versions python3 unzip
    
    # Install Webmin package (may show warnings, but should work)
    dpkg -i webmin.deb || apt-get install -f -y
    
    # Configure Webmin
    if [ -f /etc/webmin/miniserv.conf ]; then
        sed -i 's/allow=.*/allow=*/' /etc/webmin/miniserv.conf
        systemctl restart webmin
    fi
    
    echo "✓ Webmin installed via DEB package!"
    echo "Access at: https://46.62.255.49:10000"
    
    rm -f webmin.deb
    exit 0
else
    echo "✗ Could not download Webmin package"
    echo ""
    echo "Manual installation options:"
    echo "1. Visit: https://www.webmin.com/deb.html"
    echo "2. Download the DEB package manually"
    echo "3. Install with: dpkg -i webmin_*.deb"
    exit 1
fi

