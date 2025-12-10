# Setup Nginx and SSL Before Deployment

Complete guide to set up Nginx and SSL certificates before deploying your application.

## Step 1: Setup Basic Nginx Config (No Backend Required)

### 1.1 Copy the Certbot-ready config

From your **local machine**:

```bash
scp -P 2219 scripts/nginx-certbot-only.conf deployer@46.62.255.49:/tmp/alibi-nginx.conf
```

### 1.2 Configure Nginx on server

SSH to server as deployer:

```bash
ssh -p 2219 deployer@46.62.255.49
```

Then:

```bash
# Copy config to nginx directory
sudo cp /tmp/alibi-nginx.conf /etc/nginx/sites-available/alibi

# Create web root directory for ACME challenges
sudo mkdir -p /var/www/html
sudo chown -R www-data:www-data /var/www/html

# Create a simple index page (optional)
echo "Alibi Studios - Site is being configured" | sudo tee /var/www/html/index.html

# Enable the site
sudo rm -f /etc/nginx/sites-enabled/alibi  # Remove if exists
sudo ln -s /etc/nginx/sites-available/alibi /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### 1.3 Verify it's working

```bash
# Test from server
curl http://localhost

# Should return: "Alibi Studios - Site is being configured"

# Test from your browser
# http://alibistudios.co
# http://www.alibistudios.co
```

**✅ Step 1 Complete**: Nginx is serving basic content and ready for Certbot.

---

## Step 2: Install Certbot and Get SSL Certificate

### 2.1 Install Certbot

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2.2 Get SSL Certificate

**Important**: Make sure DNS is pointing to 46.62.255.49!

```bash
# Get SSL certificate
sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co

# Follow prompts:
# - Enter email
# - Agree to terms (A)
# - Share email (optional)
# - Certbot will automatically configure nginx for HTTPS
```

### 2.3 Verify SSL

```bash
# Check certificate
sudo certbot certificates

# Test from browser
# https://alibistudios.co
# https://www.alibistudios.co
```

**✅ Step 2 Complete**: SSL certificates are installed!

---

## Step 3: Update Nginx Config After Deployment

After you deploy your application, update nginx to proxy to Docker:

### 3.1 Copy the production config

From your **local machine** (after deployment):

```bash
scp -P 2219 scripts/nginx-alibi-https.conf deployer@46.62.255.49:/tmp/alibi-nginx-prod.conf
```

### 3.2 Update nginx config on server

On the server:

```bash
# Backup current config (created by certbot)
sudo cp /etc/nginx/sites-available/alibi /etc/nginx/sites-available/alibi.certbot-backup

# Copy new production config
sudo cp /tmp/alibi-nginx-prod.conf /etc/nginx/sites-available/alibi

# Edit to ensure SSL paths are correct (should already be set by certbot)
sudo nano /etc/nginx/sites-available/alibi

# Make sure these lines match your certbot paths:
# ssl_certificate /etc/letsencrypt/live/alibistudios.co/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/alibistudios.co/privkey.pem;

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 3.3 Verify everything works

```bash
# Test HTTPS
curl https://localhost -k

# Check Docker container is running
cd /opt/alibi
docker-compose ps

# Test full stack
curl https://alibistudios.co
```

---

## Summary

1. ✅ **Setup Basic Nginx**: Use `nginx-certbot-only.conf` → Works without backend
2. ✅ **Get SSL**: Run `certbot --nginx` → Certificates installed
3. ✅ **Deploy Application**: Via GitHub Actions or manually
4. ✅ **Update Nginx**: Switch to production config with proxy_pass

You can now set up SSL before deployment! 🎉

