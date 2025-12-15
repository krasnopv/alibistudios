# Nginx Setup Steps for Alibi Production

Simple step-by-step guide to set up Nginx: HTTP first, then add SSL.

## Step 1: Setup HTTP (Works Now, No SSL Needed)

### 1.1 Copy HTTP config to server

**From your local machine:**
```bash
scp -P 2219 scripts/nginx-alibi-http-proxy.conf deployer@46.62.255.49:/tmp/alibi-nginx.conf
```

### 1.2 Configure on server

**SSH to server:**
```bash
ssh -p 2219 deployer@46.62.255.49
```

**Run these commands:**
```bash
# Copy config to nginx
sudo cp /tmp/alibi-nginx.conf /etc/nginx/sites-available/alibi

# Create directory for ACME challenges (for future SSL)
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html

# Enable site
sudo rm -f /etc/nginx/sites-enabled/alibi
sudo ln -s /etc/nginx/sites-available/alibi /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config (should pass - no SSL references)
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### 1.3 Verify it works

```bash
# Test from server
curl http://localhost

# Test from browser
# http://alibistudios.co
# http://www.alibistudios.co
```

**✅ Step 1 Complete**: Your site should be accessible via HTTP and proxying to Docker container!

---

## Step 2: Add SSL Certificate (After HTTP Works)

### 2.1 Install Certbot

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2.2 Get SSL Certificate

**Important**: Make sure Docker container is running and site works on HTTP first!

```bash
# Get SSL certificate (Certbot will automatically update nginx config)
sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co

# Follow prompts:
# - Enter email address
# - Agree to terms (type A and press Enter)
# - Share email (optional, your choice)
# - Certbot will automatically configure HTTPS
```

### 2.3 Verify SSL

```bash
# Check certificate
sudo certbot certificates

# Test HTTPS
curl https://localhost -k

# Or test from browser
# https://alibistudios.co
# https://www.alibistudios.co
```

**✅ Step 2 Complete**: SSL is now active! HTTP will automatically redirect to HTTPS.

---

## What Happens

### Before SSL (Step 1):
- ✅ HTTP works: `http://alibistudios.co` → proxies to Docker container
- ✅ No SSL certificates needed
- ✅ Site is fully functional

### After SSL (Step 2):
- ✅ HTTPS works: `https://alibistudios.co` → proxies to Docker container
- ✅ HTTP redirects to HTTPS automatically
- ✅ SSL certificates installed and auto-renewing

---

## Troubleshooting

### Nginx test fails

```bash
# Check for errors
sudo nginx -t

# Check error log
sudo tail -20 /var/log/nginx/error.log
```

### 503 Service Unavailable

```bash
# Check if Docker container is running
cd /opt/alibi
docker-compose ps

# If not running, start it
docker-compose up -d

# Check container logs
docker-compose logs
```

### Certbot fails

```bash
# Check nginx error log
sudo tail -30 /var/log/nginx/error.log

# Make sure site works on HTTP first
curl http://alibistudios.co

# Check DNS
dig alibistudios.co
# Should return: 46.62.255.49
```

---

## Summary

1. **Use HTTP config first**: `nginx-alibi-http-proxy.conf` → Works immediately
2. **Test HTTP works**: Visit `http://alibistudios.co`
3. **Get SSL**: Run `certbot --nginx` → Automatically adds HTTPS
4. **Done!**: Site now has SSL and HTTP redirects to HTTPS

That's it! Simple and straightforward. 🚀







