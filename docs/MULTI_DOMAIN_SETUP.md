# Multi-Domain Setup Guide

This guide explains how to configure the server to serve the same application on multiple domains: `alibistudios.co` and `alibistudios.co.uk`.

## Overview

You have two options for handling SSL certificates:

1. **Single Certificate (Recommended)**: One certificate covering all domains
2. **Separate Certificates**: Individual certificates for each domain

## Prerequisites

- Both domains (`alibistudios.co` and `alibistudios.co.uk`) must point to your server IP (46.62.255.49)
- DNS A records configured for both domains and their www subdomains
- Existing SSL certificate for `alibistudios.co` (if already set up)

## Option 1: Single Certificate (Recommended)

This approach uses one certificate that covers all domains. It's simpler to manage and renew.

### Step 1: Update DNS Records

Ensure both domains point to your server:
- `alibistudios.co` → 46.62.255.49
- `www.alibistudios.co` → 46.62.255.49
- `alibistudios.co.uk` → 46.62.255.49
- `www.alibistudios.co.uk` → 46.62.255.49

### Step 2: Update Nginx Configuration

The nginx configuration has been updated in `scripts/nginx-production.conf` to include both domains.

Copy the updated config to your server:
```bash
scp scripts/nginx-production.conf deployer@46.62.255.49:/tmp/alibi-nginx.conf
```

SSH into the server:
```bash
ssh -p 2219 deployer@46.62.255.49
```

Backup current config:
```bash
sudo cp /etc/nginx/sites-available/alibi /etc/nginx/sites-available/alibi.backup
```

Update the config:
```bash
sudo cp /tmp/alibi-nginx.conf /etc/nginx/sites-available/alibi
sudo nano /etc/nginx/sites-available/alibi  # Verify the domains are correct
```

### Step 3: Get SSL Certificate for All Domains

If you already have a certificate for `alibistudios.co`, you can expand it to include the new domain:

```bash
sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co -d alibistudios.co.uk -d www.alibistudios.co.uk --expand
```

Or if starting fresh:
```bash
sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co -d alibistudios.co.uk -d www.alibistudios.co.uk
```

Certbot will automatically update your nginx configuration with the correct certificate paths.

### Step 4: Test and Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Verify

Test both domains:
- https://alibistudios.co
- https://www.alibistudios.co
- https://alibistudios.co.uk
- https://www.alibistudios.co.uk

All should serve the same application.

## Option 2: Separate Certificates

If you prefer separate certificates for each domain, you'll need to use SNI (Server Name Indication) in nginx.

### Step 1: Get Separate Certificates

```bash
# Certificate for alibistudios.co (if not already exists)
sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co

# Certificate for alibistudios.co.uk
sudo certbot --nginx -d alibistudios.co.uk -d www.alibistudios.co.uk
```

### Step 2: Update Nginx Configuration

Edit `/etc/nginx/sites-available/alibi` and uncomment the Option 2 SSL certificate lines:

```nginx
ssl_certificate /etc/letsencrypt/live/alibistudios.co/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/alibistudios.co/privkey.pem;
ssl_certificate /etc/letsencrypt/live/alibistudios.co.uk/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/alibistudios.co.uk/privkey.pem;
```

Nginx will automatically use the correct certificate based on the domain requested (SNI).

### Step 3: Test and Reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Certificate Renewal

Certbot will automatically renew certificates. To test renewal:

```bash
sudo certbot renew --dry-run
```

If using Option 1 (single certificate), renewal is straightforward. If using Option 2, both certificates will be renewed automatically.

## Troubleshooting

### Certificate Issues

If you get certificate errors:
1. Verify DNS records are correct: `dig alibistudios.co.uk`
2. Ensure ports 80 and 443 are open: `sudo ufw status`
3. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### Domain Not Resolving

If the new domain doesn't resolve:
1. Check DNS propagation: https://dnschecker.org
2. Verify A records are correct
3. Wait for DNS propagation (can take up to 48 hours)

### Nginx Configuration Errors

If nginx fails to start:
```bash
sudo nginx -t  # Check for syntax errors
sudo tail -f /var/log/nginx/error.log  # Check error logs
```

## Notes

- Both domains will serve the exact same application
- The application will receive the domain name in the `Host` header, so it can detect which domain is being used if needed
- SSL certificates are valid for 90 days and auto-renew via certbot
- No changes needed in the application code - nginx handles domain routing
