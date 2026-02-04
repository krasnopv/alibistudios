# Staging deployment (staging.alibistudios.co)

Staging runs on the **same server** as production, in `/opt/staging-alibi`, using Docker port **3300** and Sanity dataset **staging**.

## One-time server setup

### 0. Create staging directory (required before first deploy)

On the server (as root or with sudo), create the directory and give it to the deployer user. Without this, the workflow will fail with `drone-scp error: Process exited with status 1` when copying files.

```bash
sudo mkdir -p /opt/staging-alibi && sudo chown deployer:deployer /opt/staging-alibi
```

### 1. DNS

Add an A record:

- **staging.alibistudios.co** → `46.62.255.49`

### 2. SSL (HTTPS)

On the server, expand the existing certificate to include the staging host:

```bash
sudo certbot --nginx -d alibistudios.co -d www.alibistudios.co -d staging.alibistudios.co --expand
```

Or get a separate cert for staging:

```bash
sudo certbot --nginx -d staging.alibistudios.co
```

(If using a separate cert, point nginx to `/etc/letsencrypt/live/staging.alibistudios.co/` in the HTTPS server block.)

### 3. Nginx

Copy the staging config and enable it:

```bash
sudo cp /path/to/repo/scripts/nginx-staging.conf /etc/nginx/sites-available/staging-alibi
sudo ln -s /etc/nginx/sites-available/staging-alibi /etc/nginx/sites-enabled/
```

Uncomment the HTTPS server block in `/etc/nginx/sites-available/staging-alibi` (and optionally the HTTP→HTTPS redirect), then:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Deploying staging

- **GitHub:** Actions → **Deploy to Staging (staging.alibistudios.co)** → Run workflow, type `deploy` when prompted.
- **GitLab:** Add a similar workflow that builds with `NEXT_PUBLIC_SANITY_DATASET=staging`, deploys to `/opt/staging-alibi`, and uses `docker-compose.staging.yml` (port 3300).

Same secrets as production: `PRODUCTION_SERVER_SSH_KEY`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_TOKEN`. The staging app uses dataset **staging**; project ID and token stay the same.

## Summary

|        | Production              | Staging                    |
|--------|-------------------------|----------------------------|
| URL    | https://alibistudios.co | https://staging.alibistudios.co |
| Dir    | /opt/alibi              | /opt/staging-alibi         |
| Port   | 3100                    | 3300                       |
| Dataset| production              | staging                    |
