#!/bin/bash

# Production Server Setup Script for Alibi Project
# Server IP: 46.62.255.49
# Run this script as root initially, then it switches to deployer user

set -e

echo "=========================================="
echo "Alibi Production Server Setup"
echo "Server IP: 46.62.255.49"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Update system
echo -e "${GREEN}[1/12] Updating system packages...${NC}"
# Remove problematic Webmin repository if it exists (will re-add later if needed)
if [ -f /etc/apt/sources.list.d/webmin.list ]; then
    echo -e "${YELLOW}Removing problematic Webmin repository temporarily...${NC}"
    rm -f /etc/apt/sources.list.d/webmin.list
fi
# Update packages (ignore Webmin repo errors if any remain)
apt-get update || apt-get update -o Acquire::Check-Valid-Until=false 2>/dev/null || true
apt-get upgrade -y

# Install basic utilities
echo -e "${GREEN}[2/12] Installing basic utilities...${NC}"
apt-get install -y curl wget git ufw software-properties-common apt-transport-https ca-certificates gnupg lsb-release sudo

# Create deployer user FIRST
echo -e "${GREEN}[3/12] Creating deployer user...${NC}"
if id "deployer" &>/dev/null; then
    echo -e "${YELLOW}User 'deployer' already exists${NC}"
else
    useradd -m -s /bin/bash deployer
    usermod -aG sudo deployer
    # Configure sudoers to allow passwordless sudo for deployer
    echo "deployer ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/deployer
    chmod 0440 /etc/sudoers.d/deployer
    echo -e "${GREEN}User 'deployer' created with sudo privileges${NC}"
    echo -e "${YELLOW}Please set password for deployer user:${NC}"
    passwd deployer
fi

# Setup SSH for deployer user
echo -e "${GREEN}[4/12] Setting up SSH for deployer...${NC}"
mkdir -p /home/deployer/.ssh
chmod 700 /home/deployer/.ssh
chown deployer:deployer /home/deployer/.ssh

# Configure SSH (use custom port 2219)
echo -e "${GREEN}[5/12] Configuring SSH on port 2219...${NC}"
if ! grep -q "Port 2219" /etc/ssh/sshd_config; then
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    echo "" >> /etc/ssh/sshd_config
    echo "# Custom SSH port for Alibi deployment" >> /etc/ssh/sshd_config
    echo "Port 2219" >> /etc/ssh/sshd_config
    echo "PermitRootLogin no" >> /etc/ssh/sshd_config
    echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config
    echo "PubkeyAuthentication yes" >> /etc/ssh/sshd_config
    
    # Restart SSH service (Ubuntu uses 'ssh', some systems use 'sshd')
    if systemctl is-active --quiet ssh 2>/dev/null; then
        systemctl restart ssh
    elif systemctl is-active --quiet sshd 2>/dev/null; then
        systemctl restart sshd
    else
        # Try both and ignore errors
        systemctl restart ssh 2>/dev/null || systemctl restart sshd 2>/dev/null || true
    fi
    
    echo -e "${GREEN}SSH configured on port 2219${NC}"
    echo -e "${YELLOW}IMPORTANT: You may need to reconnect using port 2219${NC}"
else
    echo -e "${YELLOW}SSH port already configured${NC}"
fi

# Install Docker (as root, but add deployer to docker group)
echo -e "${GREEN}[6/12] Installing Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker already installed${NC}"
else
    apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    # Set up repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start Docker
    systemctl start docker
    systemctl enable docker
    
    # Add deployer to docker group
    usermod -aG docker deployer
    
    echo -e "${GREEN}Docker installed successfully${NC}"
fi

# Install Docker Compose (standalone if not included)
if ! command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}Installing Docker Compose standalone...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Configure UFW Firewall
echo -e "${GREEN}[7/12] Configuring UFW firewall...${NC}"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Allow SSH on custom port
ufw allow 2219/tcp comment 'SSH for deployment'

# Allow HTTP and HTTPS
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Allow Webmin (if installed)
ufw allow 10000/tcp comment 'Webmin'

# Enable UFW
ufw --force enable
echo -e "${GREEN}UFW firewall configured${NC}"

# Install Nginx
echo -e "${GREEN}[8/12] Installing Nginx...${NC}"
if command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Nginx already installed${NC}"
else
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
    echo -e "${GREEN}Nginx installed${NC}"
fi

# Create deployment directory (owned by deployer)
echo -e "${GREEN}[9/12] Creating deployment directory...${NC}"
mkdir -p /opt/alibi
chown deployer:deployer /opt/alibi
chmod 755 /opt/alibi
echo -e "${GREEN}Deployment directory created at /opt/alibi (owned by deployer)${NC}"

# Install Webmin (optional - can skip if GPG issues occur)
echo -e "${GREEN}[10/12] Installing Webmin (optional)...${NC}"
if command -v webmin &> /dev/null; then
    echo -e "${YELLOW}Webmin already installed${NC}"
else
    # Try to install Webmin, but don't fail if it doesn't work
    if wget -qO /tmp/webmin-setup.sh https://raw.githubusercontent.com/webmin/webmin/master/setup-repos.sh 2>/dev/null; then
        chmod +x /tmp/webmin-setup.sh
        if /tmp/webmin-setup.sh 2>/dev/null; then
            apt-get update
            if apt-get install -y webmin 2>/dev/null; then
                # Configure Webmin
                sed -i 's/allow=.*/allow=*/' /etc/webmin/miniserv.conf 2>/dev/null || true
                systemctl restart webmin 2>/dev/null || true
                echo -e "${GREEN}Webmin installed successfully${NC}"
                echo -e "${YELLOW}Webmin login: root / your-root-password${NC}"
            else
                echo -e "${YELLOW}Webmin installation skipped (GPG key issues). Install manually if needed.${NC}"
                echo -e "${YELLOW}Run: scripts/install-webmin-manual.sh${NC}"
            fi
        else
            echo -e "${YELLOW}Webmin installation skipped. Install manually if needed.${NC}"
        fi
        rm -f /tmp/webmin-setup.sh
    else
        echo -e "${YELLOW}Webmin installation skipped (network issue). Install manually if needed.${NC}"
        echo -e "${YELLOW}Visit: https://www.webmin.com/deb.html for manual installation${NC}"
    fi
fi

# Setup deployer user environment and aliases
echo -e "${GREEN}[11/12] Setting up deployer user environment...${NC}"
if [ -f /home/deployer/.bashrc ]; then
    if ! grep -q "# Alibi deployment" /home/deployer/.bashrc; then
        cat >> /home/deployer/.bashrc << 'EOF'

# Alibi deployment aliases
alias alibi-cd='cd /opt/alibi'
alias alibi-logs='cd /opt/alibi && docker-compose logs -f'
alias alibi-status='cd /opt/alibi && docker-compose ps'
alias alibi-restart='cd /opt/alibi && docker-compose restart'
alias alibi-stop='cd /opt/alibi && docker-compose down'
alias alibi-start='cd /opt/alibi && docker-compose up -d'
EOF
        chown deployer:deployer /home/deployer/.bashrc
    fi
fi

# Create helper script for deployer to manage nginx
echo -e "${GREEN}[12/12] Creating helper scripts for deployer...${NC}"
cat > /usr/local/bin/alibi-nginx << 'EOF'
#!/bin/bash
# Helper script for deployer to manage nginx
sudo nginx "$@"
EOF
chmod +x /usr/local/bin/alibi-nginx

# Final summary
echo ""
echo -e "${GREEN}=========================================="
echo "Setup Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${GREEN}All configurations completed. Deployer user is ready!${NC}"
echo ""
echo ""
echo "=========================================="
echo "NEXT STEPS"
echo "=========================================="
echo ""
echo "1. Switch to deployer user:"
echo "   su - deployer"
echo ""
echo "2. Add SSH public key (as deployer user):"
echo "   mkdir -p ~/.ssh"
echo "   nano ~/.ssh/authorized_keys"
echo "   # Paste your public key here, then save and exit"
echo "   chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "3. Configure Nginx (as deployer with sudo):"
echo "   First, copy nginx config from your local machine:"
echo "   scp -P 2219 scripts/nginx-production.conf deployer@46.62.255.49:/tmp/alibi-nginx.conf"
echo "   (Or use port 22 if 2219 doesn't work yet)"
echo ""
echo "   Then on the server:"
echo "   sudo cp /tmp/alibi-nginx.conf /etc/nginx/sites-available/alibi"
echo "   sudo nano /etc/nginx/sites-available/alibi"
echo "   # Replace 'yourdomain.com' with your actual domain"
echo "   sudo ln -s /etc/nginx/sites-available/alibi /etc/nginx/sites-enabled/"
echo "   sudo rm /etc/nginx/sites-enabled/default  # Remove default site"
echo "   sudo nginx -t"
echo "   sudo systemctl reload nginx"
echo ""
echo "4. Test Docker (as deployer - should work without sudo):"
echo "   docker ps"
echo "   docker --version"
echo ""
echo "5. Add GitHub Secrets for deployment:"
echo "   Go to: GitHub Repo > Settings > Secrets and variables > Actions"
echo "   Add these secrets:"
echo "   - PRODUCTION_SERVER_SSH_KEY (private SSH key for deployer)"
echo "   - NEXT_PUBLIC_SANITY_PROJECT_ID"
echo "   - NEXT_PUBLIC_SANITY_DATASET = production"
echo "   - SANITY_API_TOKEN"
echo ""
echo "=========================================="
echo "SERVER DETAILS"
echo "=========================================="
echo "  IP Address: 46.62.255.49"
echo "  SSH Port: 2219"
echo "  SSH User: deployer"
echo "  Sudo Access: Passwordless (NOPASSWD)"
echo "  Deployment Directory: /opt/alibi (owned by deployer)"
echo "  Webmin: https://46.62.255.49:10000"
echo ""
echo "=========================================="
echo "USEFUL COMMANDS (as deployer user)"
echo "=========================================="
echo "  alibi-cd      - Navigate to /opt/alibi"
echo "  alibi-logs    - View container logs (follow mode)"
echo "  alibi-status  - Check container status"
echo "  alibi-restart - Restart all containers"
echo "  alibi-stop    - Stop all containers"
echo "  alibi-start   - Start all containers"
echo "  alibi-nginx   - Manage nginx (with sudo)"
echo ""
echo "=========================================="
echo "IMPORTANT REMINDERS"
echo "=========================================="
echo "1. Test SSH connection:"
echo "   ssh -p 2219 deployer@46.62.255.49"
echo ""
echo "2. Set up SSL certificate for your domain:"
echo "   sudo apt-get install -y certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "3. Install Webmin (if not already installed):"
echo "   /root/install-webmin.sh"
echo ""
echo "=========================================="
echo ""
