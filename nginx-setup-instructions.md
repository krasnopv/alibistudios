# Nginx Setup Instructions for alibi.krasnopv.com

## 📋 Manual Setup Steps

### 1. Add Rate Limiting (if not already present)
Add to your main `/etc/nginx/nginx.conf` in the `http` block:
```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
```

### 2. Add Alibi Configuration
Choose one of these methods:

#### Option A: Sites-available (Recommended)
```bash
# Copy the config
sudo cp nginx-alibi.conf /etc/nginx/sites-available/alibi.krasnopv.com

# Enable the site
sudo ln -s /etc/nginx/sites-available/alibi.krasnopv.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

#### Option B: Include in main config
Add to your main nginx config:
```nginx
# Include alibi configuration
include /path/to/nginx-alibi.conf;
```

### 3. DNS Configuration
Add A record in your DNS:
```
Type: A
Name: alibi
Value: 159.69.81.179
```

### 4. Test Configuration
```bash
# Test nginx config
sudo nginx -t

# Check if site is enabled
nginx -T | grep alibi

# Test DNS resolution
nslookup alibi.krasnopv.com
```

## 🚀 Deployment Flow

1. **Manual setup** (one-time): Add nginx config as above
2. **Automatic deployment**: Push to `main` branch
3. **GitHub Actions** deploys Docker containers
4. **Your nginx** forwards `alibi.krasnopv.com` → `localhost:8080`
5. **Docker nginx** forwards to app on `localhost:3100`

## 🔧 Troubleshooting

### Check if containers are running:
```bash
docker ps
```

### Check nginx logs:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Test the connection:
```bash
curl -H "Host: alibi.krasnopv.com" http://localhost:8080/health
```

## 📁 File Structure After Setup

```
/etc/nginx/
├── nginx.conf (main config)
├── sites-available/
│   └── alibi.krasnopv.com (your new config)
└── sites-enabled/
    └── alibi.krasnopv.com -> ../sites-available/alibi.krasnopv.com

/opt/alibi/
├── docker-compose.yml (deployed by GitHub Actions)
├── nginx.conf (Docker nginx config)
└── (Docker containers running)
```
