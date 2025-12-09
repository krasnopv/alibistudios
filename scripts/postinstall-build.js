#!/usr/bin/env node

// Post-install script to build the app automatically
// This runs automatically after npm install during deployment

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if we should build
// Build if:
// 1. NODE_ENV is production
// 2. SERVER_DEPLOY is set
// 3. We're on Gandi server (check for Gandi-specific paths)
// 4. .next directory doesn't exist (needs initial build)
const isProduction = process.env.NODE_ENV === 'production';
const isServerDeploy = process.env.SERVER_DEPLOY === 'true';
const currentDir = process.cwd();
const isGandiServer = currentDir.includes('/srv/data/web/vhosts') || 
                      currentDir.includes('/srv/data/web') ||
                      fs.existsSync('/srv/data/web/vhosts');
const nextDirExists = fs.existsSync(path.join(currentDir, '.next'));

// Build if we're on a server, in production, or if .next doesn't exist
const shouldBuild = isProduction || isServerDeploy || isGandiServer || !nextDirExists;

if (shouldBuild) {
  console.log('Detected deployment environment, building application...');
  if (isGandiServer) {
    console.log('Gandi server detected via path check');
  }
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✓ Build completed successfully!');
  } catch (error) {
    console.error('✗ Build failed:', error.message);
    // Don't fail the install - let deployment continue
    // The start script will show the actual error if build is missing
    process.exit(0);
  }
} else {
  console.log('Development environment detected, skipping automatic build.');
  console.log('Run "npm run build" manually when needed.');
}

