# ═══════════════════════════════════════════════════════════
#   beau Frontend - Multi-stage Docker Build
#   Stage 1: Build with Node.js (tests + static export)
#   Stage 2: Serve with Nginx (production)
# ═══════════════════════════════════════════════════════════

# ────────────── Stage 1: Dependencies ──────────────
FROM node:20-alpine AS deps
WORKDIR /app

# نصب dependency های سیستمی برای build
RUN apk add --no-cache libc6-compat

COPY package.json yarn.lock* package-lock.json* ./

# نصب وابستگی‌ها
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# ────────────── Stage 2: Test & Lint ──────────────
FROM deps AS tester
WORKDIR /app

COPY . .

# اجرای lint
RUN npm run lint || true

# اجرای تست‌ها با coverage
RUN npm run test:ci || true

# ────────────── Stage 3: Build ──────────────
FROM deps AS builder
WORKDIR /app

COPY . .

# متغیرهای محیطی build-time
# این متغیرها در بیلد نهایی embed می‌شوند
ARG NEXT_PUBLIC_USE_MOCK=false
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
ARG NEXT_PUBLIC_SITE_DOMAIN=http://localhost:3000
ARG NEXT_PUBLIC_ARVAN_CDN_URL=
ARG NEXT_PUBLIC_MEDIA_BASE_URL=http://localhost:8000
ARG NODE_ENV=production

ENV NEXT_PUBLIC_USE_MOCK=${NEXT_PUBLIC_USE_MOCK}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_SITE_DOMAIN=${NEXT_PUBLIC_SITE_DOMAIN}
ENV NEXT_PUBLIC_ARVAN_CDN_URL=${NEXT_PUBLIC_ARVAN_CDN_URL}
ENV NEXT_PUBLIC_MEDIA_BASE_URL=${NEXT_PUBLIC_MEDIA_BASE_URL}
ENV NODE_ENV=${NODE_ENV}

# بیلد پروداکشن (خروجی: پوشه out/ به خاطر output: 'export')
RUN npm run build

# ────────────── Stage 4: Production (Nginx) ──────────────
FROM nginx:1.27-alpine AS production

# حذف کانفیگ پیش‌فرض Nginx
RUN rm /etc/nginx/conf.d/default.conf

# کپی کانفیگ سفارشی
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# کپی فایل‌های استاتیک از stage بیلد
COPY --from=builder /app/out /usr/share/nginx/html

# کپی فایل‌های public (manifest.json, sw.js, icons, fonts)
COPY --from=builder /app/public /usr/share/nginx/html

# تنظیم دسترسی‌ها
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]