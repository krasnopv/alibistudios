# Production Server Setup Guide

This guide will help you set up the new production server at **46.62.255.49** for the Alibi project.

## Prerequisites

- Fresh Ubuntu server (22.04 LTS or later recommended)
- Root access via SSH
- Domain name pointing to 46.62.255.49 (optional but recommended)

## Step-by-Step Setup

### 1. Initial Server Access

Connect to your server as root:
```bash
ssh root@46.62.255.49
```

### 2. Run Setup Script

Copy the setup script to your server and run it as root:

```bash
# On your local machine, copy the script
scp scripts/setup-production-server.sh root@46.62.255.49:/root/

# On the server, make it executable and run
ssh root@46.62.255.49
chmod +x /root/setup-production-server.sh
/root/setup-production-server.sh
```

The script will:
- ✅ Update system packages
- ✅ Create `deployer` user with passwordless sudo
- ✅ Configure SSH on port 2219
- ✅ Install Docker and Docker Compose (deployer added to docker group)
- ✅ Configure UFW firewall
- ✅ Install Nginx
- ✅ Create deployment directory `/opt/alibi` (owned by deployer)
- ✅ Install Webmin
- ✅ Setup deployer user aliases and environment

**Important**: After the script completes, switch to deployer user for all further operations:
```bash
su - deployer
```

### 3. Switch to Deployer User

After the setup script completes, switch to deployer user:
```bash
su - deployer
```

All further operations should be done as deployer user (with sudo when needed).

### 4. Setup SSH Key for Deployer User

On your local machine, generate SSH key if you don't have one:
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/alibi_production
```

Copy the public key to the server (as deployer user):
```bash
ssh-copy-id -i ~/.ssh/alibi_production.pub -p 2219 deployer@46.62.255.49
```

Or manually:
```bash
cat ~/.ssh/alibi_production.pub | ssh -p 2219 deployer@46.62.255.49 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

**Note**: Deployer user has passwordless sudo, so you can manage all system configurations.

### 5. Configure Nginx (as deployer user)

Copy the Nginx configuration:
```bash
scp scripts/nginx-production.conf deployer@46.62.255.49:/tmp/alibi-nginx.conf
```

SSH into the server as deployer and configure:
```bash
ssh -p 2219 deployer@46.62.255.49
sudo cp /tmp/alibi-nginx.conf /etc/nginx/sites-available/alibi
sudo nano /etc/nginx/sites-available/alibi
```

Replace `yourdomain.com` with your actual domain name.

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/alibi /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site if exists
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

**Note**: You can also use the helper alias: `alibi-nginx -t`

### 6. Setup SSL Certificate (Optional but Recommended)

If you have a domain name, set up SSL:

```bash
# Copy SSL setup script
scp scripts/setup-ssl.sh root@46.62.255.49:/root/
ssh root@46.62.255.49
chmod +x /root/setup-ssl.sh
/root/setup-ssl.sh
```

Or manually:
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to: `Settings` → `Secrets and variables` → `Actions`
2. Add these secrets:

   - **PRODUCTION_SERVER_SSH_KEY**: The private SSH key (`~/.ssh/alibi_production`)
   - **NEXT_PUBLIC_SANITY_PROJECT_ID**: Your Sanity project ID
   - **NEXT_PUBLIC_SANITY_DATASET**: `production`
   - **SANITY_API_TOKEN**: Your Sanity API token

To get the private key content:
```bash
cat ~/.ssh/alibi_production
```

### 8. Test Deployment

The deployment will trigger automatically when you push to the `main` branch, or you can trigger it manually:

1. Go to GitHub Actions
2. Select "Deploy to Production Server"
3. Click "Run workflow"

### 9. Access Webmin

Webmin is accessible at:
- URL: `https://46.62.255.49:10000`
- Login: `root` / your root password

**Important**: Change the default password and restrict access in Webmin settings.

## Firewall Rules Summary

UFW is configured with:
- ✅ Port 2219 (SSH)
- ✅ Port 80 (HTTP)
- ✅ Port 443 (HTTPS)
- ✅ Port 10000 (Webmin)

## Deployment Directory Structure

```
/opt/alibi/
├── docker-compose.yml
├── alibi-app.tar.gz (temporary, removed after deployment)
└── .env (if needed for local overrides)
```

**Note**: All files in `/opt/alibi` are owned by `deployer` user, so you can manage them without sudo.

## Docker Container

The application runs in a Docker container:
- **Container Port**: 3000
- **Host Port**: 3100
- **Access**: `http://localhost:3100` (internal) or via Nginx proxy

## Monitoring

Check container status (as deployer user):
```bash
# Using aliases
alibi-status
alibi-logs

# Or manually
cd /opt/alibi
docker-compose ps
docker-compose logs -f
```

**Note**: Deployer user can run Docker commands without sudo (added to docker group).

## Troubleshooting

### Container won't start
```bash
cd /opt/alibi
docker-compose logs
docker-compose down
docker-compose up -d
```

### Nginx issues
```bash
nginx -t  # Test configuration
systemctl status nginx
journalctl -u nginx -f  # View logs
```

### Permission issues
```bash
# Should not be needed as deployer owns /opt/alibi
# But if needed:
sudo chown -R deployer:deployer /opt/alibi
```

### Port conflicts
```bash
netstat -tulpn | grep :3100
# Kill process if needed
```

## Security Checklist

- [ ] SSH key authentication set up
- [ ] Root login disabled (via SSH config)
- [ ] UFW firewall enabled
- [ ] SSL certificate installed
- [ ] Webmin access restricted (if possible)
- [ ] Regular system updates scheduled
- [ ] Docker security best practices followed
- [ ] Environment variables secured

## Maintenance

### Update the application
Push to `main` branch - deployment is automatic.

### Manual deployment
```bash
ssh -p 2219 deployer@46.62.255.49
cd /opt/alibi
docker-compose pull  # If using registry
docker-compose up -d
```

### System updates
```bash
apt-get update && apt-get upgrade -y
```

### Docker cleanup
```bash
docker system prune -a  # Remove unused images/containers
```

## Support

For issues or questions:
1. Check GitHub Actions logs
2. Check Docker logs: `docker-compose logs`
3. Check Nginx logs: `/var/log/nginx/alibi-error.log`

