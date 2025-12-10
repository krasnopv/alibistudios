# Certbot Troubleshooting - 503 Error

## Problem
Certbot is getting 503 errors when trying to verify the domain. This means nginx is running but can't reach the backend (Docker container).

## Quick Fix Steps

### 1. Check if Docker container is running

```bash
# As deployer user
cd /opt/alibi
docker-compose ps

# Should show container running
# If not running, start it:
docker-compose up -d
```

### 2. Test if container responds

```bash
# Test if container is accessible
curl http://localhost:3100

# Should return HTML or some response
# If it fails, container isn't running or not on port 3100
```

### 3. Check nginx can reach container

```bash
# Test nginx proxy
curl http://localhost

# Should return same as above
# If 503, nginx can't reach container
```

### 4. Check nginx error logs

```bash
# Check nginx errors
sudo tail -f /var/log/nginx/error.log

# Look for connection refused or similar errors
```

## Solution: Start Docker Container First

The most common cause is the Docker container isn't running:

```bash
# Navigate to deployment directory
cd /opt/alibi

# Check if docker-compose.yml exists
ls -la docker-compose.yml

# If it exists but container isn't running, start it
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs
```

## Alternative: Temporary Nginx Config for Certbot

If container isn't ready yet, create a temporary nginx config just for SSL verification:

```bash
# Create minimal config for certbot
sudo nano /etc/nginx/sites-available/alibi-temp
```

Add this content:
```nginx
server {
    listen 80;
    server_name alibistudios.co www.alibistudios.co;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/alibi-temp /etc/nginx/sites-enabled/alibi-temp
sudo rm /etc/nginx/sites-enabled/alibi
sudo nginx -t
sudo systemctl reload nginx
```

Get certificate:
```bash
sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co
```

Then switch back to your main config.

