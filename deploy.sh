#!/usr/bin/env bash
set -e

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="/var/www/yogasetyawan.my.id"

echo "Deploying from $SOURCE_DIR to $TARGET_DIR..."
mkdir -p "$TARGET_DIR"
rsync -av --delete \
  --exclude='.git' \
  --exclude='.gitignore' \
  --exclude='deploy.sh' \
  --exclude='server' \
  "$SOURCE_DIR/" "$TARGET_DIR/"

chown -R www-data:www-data "$TARGET_DIR"
chmod -R 755 "$TARGET_DIR"

echo "Deployment completed successfully!"
