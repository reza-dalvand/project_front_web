#!/bin/bash
# ═══════════════════════════════════════════════════════════
#   Zibano Frontend - Manual Deployment Script
#   استفاده روی VPS: bash scripts/deploy.sh [tag]
# ═══════════════════════════════════════════════════════════

set -e

# ─── Configuration ───
REGISTRY="ghcr.io"
IMAGE_NAME="YOUR_GITHUB_USERNAME/zibano-frontend"
TAG="${1:-latest}"
DEPLOY_DIR="/opt/zibano/frontend"

echo "🚀 Deploying Zibano Frontend"
echo "   Image: ${REGISTRY}/${IMAGE_NAME}:${TAG}"
echo "   Dir:   ${DEPLOY_DIR}"
echo ""

# ─── Create deploy directory ───
mkdir -p ${DEPLOY_DIR}
cd ${DEPLOY_DIR}

# ─── Login to GHCR ───
echo "🔐 Logging in to GHCR..."
echo "${GITHUB_TOKEN}" | docker login ${REGISTRY} -u "${GITHUB_USER}" --password-stdin

# ─── Pull latest image ───
echo "📥 Pulling image..."
docker pull ${REGISTRY}/${IMAGE_NAME}:${TAG}

# ─── Stop old container ───
echo "⏹️  Stopping old container..."
docker stop zibano-frontend 2>/dev/null || true
docker rm zibano-frontend 2>/dev/null || true

# ─── Start new container ───
echo "▶️  Starting new container..."
docker run -d \
  --name zibano-frontend \
  --restart always \
  -p 80:80 \
  -p 443:443 \
  -v ${DEPLOY_DIR}/nginx/certbot/conf:/etc/letsencrypt \
  -v ${DEPLOY_DIR}/nginx/certbot/www:/var/www/certbot \
  ${REGISTRY}/${IMAGE_NAME}:${TAG}

# ─── Health check ───
echo "⏳ Waiting for container to start..."
sleep 5

if docker ps | grep -q zibano-frontend; then
  echo "✅ Container is running!"
  docker ps | grep zibano-frontend
else
  echo "❌ Container failed to start"
  docker logs zibano-frontend
  exit 1
fi

# ─── Cleanup ───
echo "🧹 Cleaning up old images..."
docker image prune -f

echo ""
echo "🎉 Deployment complete!"
echo "   URL: http://$(hostname -I | awk '{print $1}')"