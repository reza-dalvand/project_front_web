# 🔧 CI/CD Setup Guide

## Secrets مورد نیاز در GitHub

به Settings → Secrets and variables → Actions بروید و این secrets را اضافه کنید:

### Required Secrets

| Secret Name   | Description         | Example                |
| ------------- | ------------------- | ---------------------- |
| `VPS_HOST`    | IP یا hostname سرور | `185.xxx.xxx.xxx`      |
| `VPS_USER`    | یوزر SSH سرور       | `root` یا `deploy`     |
| `VPS_SSH_KEY` | کلید خصوصی SSH      | محتوای `~/.ssh/id_rsa` |

### Optional Secrets

| Secret Name      | Description       | Default                        |
| ---------------- | ----------------- | ------------------------------ |
| `API_BASE_URL`   | آدرس API بک‌اند   | `http://localhost:8000/api/v1` |
| `SITE_DOMAIN`    | دامنه سایت        | `http://localhost:3000`        |
| `ARVAN_CDN_URL`  | آدرس CDN آروان    | خالی                           |
| `MEDIA_BASE_URL` | آدرس media بک‌اند | `http://localhost:8000`        |

## 🚀 راه‌اندازی اولیه روی VPS

### 1. نصب Docker و Docker Compose

```bash
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
