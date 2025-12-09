# Gandi Hosting Deployment Guide

## Problem
The app fails to deploy because `next` command is not found. This happens because:
1. Dependencies aren't installed on the server
2. The app hasn't been built before starting

## Solution

### Option 1: Using Git Hooks (Recommended)

A `.gandi-hooks/post-receive` hook has been created that will automatically:
1. Install dependencies (`npm ci`)
2. Build the application (`npm run build`)
3. The start script will then work correctly

**To deploy:**
```bash
# Push to staging repository
git push staging main:master

# Deploy using Gandi's deploy command
ssh 8497acce-b651-11f0-b3d0-00163e94b645@git.sd3.gpaas.net deploy default.git
```

### Option 2: Manual Deployment (If hooks don't work)

If the git hook doesn't work, you can manually SSH into the server and run:

```bash
# SSH into Gandi server
ssh 8497acce-b651-11f0-b3d0-00163e94b645@git.sd3.gpaas.net

# Navigate to the app directory
cd /srv/data/web/vhosts/default

# Install dependencies
npm ci

# Build the application
npm run build

# The app should now start automatically
```

### Option 3: Update package.json scripts

If Gandi's bootstrap script runs `npm install` automatically, you can add a postinstall script:

```json
"scripts": {
  "postinstall": "npm run build"
}
```

**Note:** This might cause issues if you don't want to build on every install, so use with caution.

## Important Notes

1. **Build Script**: The build script has been updated to use standard Next.js build (without `--turbopack`) for production deployments. Turbopack is only used for development.

2. **Standalone Output**: The Next.js config uses `output: 'standalone'` which is optimal for server deployments.

3. **Environment Variables**: Make sure all required environment variables are set on Gandi's hosting panel:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN` (if needed)
   - `NODE_ENV=production`

4. **Dual Git Repositories**: 
   - `origin`: Your main development repository
   - `staging`: Gandi's staging repository
   
   To push to both:
   ```bash
   git push origin main
   git push staging main:master
   ```

## Troubleshooting

If deployment still fails:

1. **Check logs**: SSH into the server and check `/srv/data/web/vhosts/default/nodejs.log`

2. **Verify Node.js version**: Gandi should have Node.js 20+ installed

3. **Check disk space**: Ensure there's enough space for `node_modules` and `.next` build

4. **Verify permissions**: The deployment user should have write permissions in the app directory

5. **Test locally**: Run `npm ci && npm run build && npm start` locally to ensure everything works

