# Nginx SSL Setup Guide for Alibi Production Server

Complete step-by-step guide to set up Nginx with HTTP first, then add SSL.

## Step 1: Setup HTTP Configuration (No SSL)

### 1.1 Copy HTTP config to server

From your **local machine**:

```bash
scp -P 2219 scripts/nginx-alibi-http.conf deployer@46.62.255.49:/tmp/alibi-nginx.conf
```

If port 2219 doesn't work, use port 22:
```bash
scp scripts/nginx-alibi-http.conf deployer@46.62.255.49:/tmp/alibi-nginx.conf
```

### 1.2 Configure Nginx on server

SSH to server as deployer:

```bash
ssh -p 2219 deployer@46.62.255.49
```

Then run:

```bash
# Copy config to nginx directory
sudo cp /tmp/alibi-nginx.conf /etc/nginx/sites-available/alibi

# Verify domain is correct (should be alibistudios.co)
sudo grep "server_name" /etc/nginx/sites-available/alibi

# Enable the site
sudo ln -s /etc/nginx/sites-available/alibi /etc/nginx/sites-enabled/

# Remove default site (if exists)
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### 1.3 Verify HTTP is working

```bash
# Test from server
curl http://localhost

# Or test from your browser
# http://alibistudios.co
# http://46.62.255.49
```

**✅ Step 1 Complete**: Your site should now be accessible via HTTP.

---

## Step 2: Install Certbot and Get SSL Certificate

### 2.1 Install Certbot

On the server (as deployer):

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2.2 Get SSL Certificate

**Important**: Make sure your domain `alibistudios.co` is pointing to `46.62.255.49` before running this!

```bash
# Get SSL certificate (Certbot will automatically configure nginx)
sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co

# Follow the prompts:
# - Enter your email address
# - Agree to terms (A)
# - Choose whether to share email (your choice)
# - Certbot will automatically update nginx config
```

### 2.3 Verify SSL Certificate

```bash
# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

**✅ Step 2 Complete**: SSL certificates are installed and nginx is configured for HTTPS.

---

## Step 3: Verify HTTPS Configuration

### 3.1 Check Nginx Config

Certbot should have automatically updated your nginx config. Check it:

```bash
sudo nginx -t
sudo cat /etc/nginx/sites-available/alibi
```

You should see SSL configuration with certificate paths.

### 3.2 Test HTTPS

```bash
# Test from server
curl https://localhost -k

# Or test from your browser
# https://alibistudios.co
# https://www.alibistudios.co
```

### 3.3 Verify HTTP Redirects to HTTPS

Visit `http://alibistudios.co` - it should automatically redirect to `https://alibistudios.co`

**✅ Step 3 Complete**: HTTPS is working and HTTP redirects to HTTPS.

---

## Step 4: (Optional) Manual SSL Config Update

If you prefer to use the pre-configured HTTPS config file instead of Certbot's auto-config:

### 4.1 Copy HTTPS config

From your **local machine**:

```bash
scp -P 2219 scripts/nginx-alibi-https.conf deployer@46.62.255.49:/tmp/alibi-nginx-https.conf
```

### 4.2 Replace config on server

On the server:

```bash
# Backup current config (created by certbot)
sudo cp /etc/nginx/sites-available/alibi /etc/nginx/sites-available/alibi.certbot-backup

# Copy new config
sudo cp /tmp/alibi-nginx-https.conf /etc/nginx/sites-available/alibi

# Verify certificate paths are correct
sudo grep "ssl_certificate" /etc/nginx/sites-available/alibi

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## Troubleshooting

### Nginx test fails

```bash
# Check for syntax errors
sudo nginx -t

# Check nginx error log
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate not found

```bash
# Check if certificates exist
sudo ls -la /etc/letsencrypt/live/alibistudios.co/

# If missing, re-run certbot
sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co
```

### Domain not pointing to server

```bash
# Check DNS
dig alibistudios.co
nslookup alibistudios.co

# Should return: 46.62.255.49
```

### Can't access site

```bash
# Check if nginx is running
sudo systemctl status nginx

# Check if Docker container is running
docker ps
cd /opt/alibi
docker-compose ps

# Check firewall
sudo ufw status
```

---

## SSL Certificate Auto-Renewal

Certbot sets up auto-renewal automatically. Verify it:

```bash
# Check renewal timer
sudo systemctl status certbot.timer

# Test renewal (dry run)
sudo certbot renew --dry-run
```

Certificates will auto-renew before expiration (every 90 days).

---

## Summary

1. ✅ **HTTP Setup**: Use `nginx-alibi-http.conf` → Test HTTP works
2. ✅ **Install Certbot**: `sudo apt-get install -y certbot python3-certbot-nginx`
3. ✅ **Get SSL**: `sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co`
4. ✅ **Verify HTTPS**: Test https://alibistudios.co

Your site is now fully configured with SSL! 🔒

