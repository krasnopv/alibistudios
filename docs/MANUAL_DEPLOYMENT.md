# Manual Production Deployment Guide

## Overview

Production deployment is **manual-only** and can only be triggered from the `main` branch. This ensures you have full control over when code is deployed to production.

## How to Deploy to Production

### Step 1: Ensure you're on main branch

```bash
# Check current branch
git branch

# If not on main, switch to it
git checkout main

# Pull latest changes
git pull origin main
```

### Step 2: Push your changes to main

```bash
# Commit and push your changes
git add .
git commit -m "Your commit message"
git push origin main
```

### Step 3: Trigger Manual Deployment

1. Go to your GitHub repository
2. Click on **"Actions"** tab
3. Select **"Deploy to Production Server"** workflow from the left sidebar
4. Click **"Run workflow"** button (top right)
5. In the dropdown:
   - **Branch**: Select `main` (should be default)
   - **Confirm**: Type `deploy` (exactly as shown)
6. Click **"Run workflow"** green button

### Step 4: Monitor Deployment

- Watch the workflow run in real-time
- Check each step for success/failure
- Deployment typically takes 3-5 minutes

## Workflow Details

### What the workflow does:

1. ✅ Checks out code from `main` branch
2. ✅ Installs dependencies
3. ✅ Builds the application
4. ✅ Creates Docker image
5. ✅ Stops existing containers on production server
6. ✅ Copies new Docker image to server
7. ✅ Starts new containers
8. ✅ Runs health check

### Safety Features:

- ✅ **Manual trigger only** - No automatic deployments
- ✅ **Main branch only** - Can't deploy from other branches
- ✅ **Confirmation required** - Must type "deploy" to confirm
- ✅ **Health check** - Verifies deployment succeeded

## Troubleshooting

### Workflow won't run

**Issue**: Workflow doesn't appear in Actions
- **Solution**: Make sure you're on the `main` branch

**Issue**: "Workflow run skipped" or "Condition not met"
- **Solution**: 
  - Make sure you typed `deploy` exactly (lowercase)
  - Make sure you're running from `main` branch

### Deployment fails

**Check logs**:
1. Go to Actions → Deploy to Production Server
2. Click on the failed run
3. Expand the failed step to see error details

**Common issues**:
- SSH connection failed → Check `PRODUCTION_SERVER_SSH_KEY` secret
- Docker build failed → Check build logs
- Container won't start → Check server logs: `cd /opt/alibi && docker-compose logs`

### Verify deployment

After successful deployment:

```bash
# SSH to server
ssh -p 2219 deployer@46.62.255.49

# Check container status
cd /opt/alibi
docker-compose ps

# Check logs
docker-compose logs -f

# Test application
curl http://localhost:3100
```

## Comparison: Old vs New Server

| Feature | Old Server (159.69.81.179) | Production Server (46.62.255.49) |
|---------|---------------------------|----------------------------------|
| Workflow | `deploy-server.yml` | `deploy-production.yml` |
| Trigger | Auto on push to main | **Manual only** |
| Branch | main | main (required) |
| SSH Key Secret | `SERVER_SSH_KEY` | `PRODUCTION_SERVER_SSH_KEY` |

## Best Practices

1. **Test before deploying**: Make sure code works in development
2. **Review changes**: Check what's being deployed
3. **Deploy during low traffic**: If possible, deploy during off-peak hours
4. **Monitor after deployment**: Check application is working correctly
5. **Keep main branch stable**: Only merge tested code to main

## Quick Reference

```bash
# Deploy to production:
1. Push to main branch
2. GitHub → Actions → Deploy to Production Server
3. Run workflow → Type "deploy" → Run
4. Monitor deployment
5. Verify at https://alibistudios.co
```

