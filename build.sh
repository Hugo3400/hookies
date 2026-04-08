#!/bin/bash
set -euo pipefail

export NODE_ENV=production
export FORCE_DEV=0

npm run build

# Keep Next build artifacts readable by Passenger after root-run deploys.
APP_OWNER="$(stat -c '%U' .)"
APP_GROUP="$(stat -c '%G' .)"
chown -R "${APP_OWNER}:${APP_GROUP}" .next

touch tmp/restart.txt
