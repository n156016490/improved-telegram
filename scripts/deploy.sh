#!/usr/bin/env bash
set -euo pipefail

# Simple deploy script for Next.js + Express + PM2
# Usage: ./scripts/deploy.sh <branch>
# Example: ./scripts/deploy.sh main

BRANCH=${1:-main}
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Deploying branch: $BRANCH"
echo "Root: $ROOT_DIR"

cd "$ROOT_DIR"

if [ -n "${GIT_DIR:-}" ]; then
  echo "Running inside git dir"
fi

echo "Fetching latest from origin/$BRANCH..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "Installing dependencies..."
npm ci --production=false

echo "Building Next.js..."
npm run build:next

echo "Installing production dependencies only..."
npm prune --production

echo "Reloading PM2..."
# If ecosystem file exists use it, otherwise reload by process name or id
if [ -f ecosystem.config.js ]; then
  pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
else
  pm2 restart server || pm2 start server.js --name server --env production
fi

echo "Saving PM2 process list and startup..."
pm2 save

echo "Deploy complete."
