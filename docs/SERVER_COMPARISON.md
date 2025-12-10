# Server Comparison

## Current Setup

### Old Server (159.69.81.179)
- **Workflow**: `.github/workflows/deploy-server.yml`
- **SSH Port**: 2219
- **User**: deployer
- **Deploy Dir**: /opt/alibi
- **Status**: Active production

### New Production Server (46.62.255.49)
- **Workflow**: `.github/workflows/deploy-production.yml`
- **SSH Port**: 2219
- **User**: deployer
- **Deploy Dir**: /opt/alibi
- **Status**: New setup

## Deployment Workflows

Both servers use the same deployment process:
1. Build Docker image
2. Save as tar.gz
3. Transfer to server
4. Load and start container

## Differences

| Feature | Old Server | New Production Server |
|---------|-----------|----------------------|
| IP | 159.69.81.179 | 46.62.255.49 |
| GitHub Secret | `SERVER_SSH_KEY` | `PRODUCTION_SERVER_SSH_KEY` |
| Workflow File | `deploy-server.yml` | `deploy-production.yml` |
| Setup Script | N/A | `setup-production-server.sh` |

## Deployment Triggers

Both workflows trigger on:
- Push to `main` branch
- Manual workflow dispatch

## Switching Between Servers

To deploy to a specific server:
1. Use the appropriate workflow
2. Ensure correct SSH key is in GitHub Secrets
3. Push to main or trigger manually

