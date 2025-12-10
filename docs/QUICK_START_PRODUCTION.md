# Quick Start: Production Server Setup

## 🚀 Quick Setup (5 minutes)

### 1. Connect to Server as Root
```bash
ssh root@46.62.255.49
```

### 2. Run Setup Script (as root)
```bash
# Copy script from your local machine
scp scripts/setup-production-server.sh root@46.62.255.49:/root/

# On server (as root)
chmod +x /root/setup-production-server.sh
/root/setup-production-server.sh
```

**After script completes, switch to deployer user:**
```bash
su - deployer
```

### 3. Setup SSH Key for GitHub Actions (as deployer)
```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/alibi_production

# Copy public key to server
ssh-copy-id -i ~/.ssh/alibi_production.pub -p 2219 deployer@46.62.255.49

# Add private key to GitHub Secrets
cat ~/.ssh/alibi_production
# Copy output and add as PRODUCTION_SERVER_SSH_KEY secret
```

### 4. Configure Nginx (as deployer with sudo)
```bash
# Copy config
scp scripts/nginx-production.conf deployer@46.62.255.49:/tmp/alibi-nginx.conf

# On server as deployer - edit domain name
ssh -p 2219 deployer@46.62.255.49
sudo cp /tmp/alibi-nginx.conf /etc/nginx/sites-available/alibi
sudo nano /etc/nginx/sites-available/alibi  # Replace 'yourdomain.com'

# Enable site
sudo ln -s /etc/nginx/sites-available/alibi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Setup SSL (if you have domain, as deployer with sudo)
```bash
scp scripts/setup-ssl.sh deployer@46.62.255.49:/tmp/
ssh -p 2219 deployer@46.62.255.49
chmod +x /tmp/setup-ssl.sh
sudo /tmp/setup-ssl.sh
```

### 6. Add GitHub Secrets
Go to: `Settings` → `Secrets and variables` → `Actions`

Add:
- `PRODUCTION_SERVER_SSH_KEY` (private key from step 3)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `SANITY_API_TOKEN`

### 7. Deploy!
Push to `main` branch or trigger workflow manually.

## 📋 Server Details

- **IP**: 46.62.255.49
- **SSH Port**: 2219
- **User**: deployer
- **Deploy Dir**: /opt/alibi
- **App Port**: 3100 (internal)
- **Webmin**: https://46.62.255.49:10000

## 🔐 Default Access

- **SSH**: `ssh -p 2219 deployer@46.62.255.49`
- **Webmin**: `https://46.62.255.49:10000` (root / your-password)

## ✅ Verification

```bash
# Check Docker container (as deployer - no sudo needed)
ssh -p 2219 deployer@46.62.255.49
alibi-status  # or: cd /opt/alibi && docker-compose ps

# Check Nginx
curl http://localhost:3100

# Test Docker access
docker ps  # Should work without sudo
```

## 🆘 Troubleshooting

**Container not starting?**
```bash
cd /opt/alibi
docker-compose logs
```

**Nginx not working?**
```bash
nginx -t
systemctl status nginx
```

**Can't SSH?**
- Check UFW: `ufw status`
- Verify port 2219 is open
- Check SSH service: `systemctl status sshd`

