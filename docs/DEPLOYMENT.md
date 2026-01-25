# Deployment Guide

This guide covers deployment procedures for the Relogate platform, including both frontend and backend services.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Management](#database-management)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Rollback Procedures](#rollback-procedures)

---

## Overview

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   Supabase      │
│   (Next.js)     │     │   (Express)     │     │  (PostgreSQL)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
   Vercel/Netlify        Railway/Render         Supabase Cloud
   or Self-hosted        or Self-hosted
```

### Deployment Checklist

Before deploying:
- [ ] All tests pass
- [ ] Build completes successfully
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Feature flags set appropriately

---

## Prerequisites

### Development Tools
- Node.js 22+ (LTS)
- npm 10+
- Git

### Accounts/Services
- Supabase account (database & auth)
- Stripe account (payments)
- Hosting provider account

### Domain & SSL
- Domain name configured
- SSL certificates ready
- DNS properly configured

---

## Environment Configuration

### Frontend Environment Variables

Create `.env.local` for local development:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

For production, configure in your hosting provider:

```bash
# Production API URL
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1

# Stripe Production Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### Backend Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# CORS
CORS_ORIGIN=https://your-domain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Environment Security

- Never commit `.env` files to version control
- Use secrets management in your hosting provider
- Rotate credentials periodically
- Use different credentials for staging/production

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required variables

3. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Setup Domain**
   - Add custom domain in Vercel
   - Configure DNS records
   - SSL is automatic

### Option 2: Netlify

1. **Connect Repository**
   - Link GitHub repository
   - Configure build settings

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Add in Site Settings → Environment

### Option 3: Self-Hosted (Docker)

Create `Dockerfile`:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t relogate-frontend .
docker run -p 3000:3000 --env-file .env.production relogate-frontend
```

### Option 4: Static Export (Limited)

For static hosting without server-side features:

```bash
# Add to next.config.js: output: 'export'
npm run build
# Deploy the 'out' directory
```

**Note**: This disables API routes and server-side rendering.

---

## Backend Deployment

### Option 1: Railway

1. **Connect Repository**
   - Create new project in Railway
   - Connect GitHub repository

2. **Configure Environment**
   - Add all environment variables
   - Configure PORT variable

3. **Deploy**
   - Railway auto-deploys on push
   - Monitor logs for issues

### Option 2: Render

1. **Create Web Service**
   - Connect repository
   - Set build command: `npm run build`
   - Set start command: `npm start`

2. **Environment Variables**
   - Add in Environment tab

3. **Health Check**
   - Set path: `/health`

### Option 3: Self-Hosted (Docker)

Create `Dockerfile`:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3001
CMD ["node", "dist/server.js"]
```

Build and run:
```bash
docker build -t relogate-backend .
docker run -p 3001:3001 --env-file .env.production relogate-backend
```

### Option 4: PM2 (Direct Server)

```bash
# Install PM2
npm install -g pm2

# Build
npm run build

# Start with PM2
pm2 start dist/server.js --name relogate-backend

# Save process list
pm2 save

# Auto-start on reboot
pm2 startup
```

---

## Database Management

### Supabase Setup

1. **Create Project**
   - Go to Supabase Dashboard
   - Create new project
   - Note the connection strings

2. **Configure Auth**
   - Enable email/password auth
   - Configure email templates
   - Set password requirements

### Database Migrations

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Direct push (development only)
npm run db:push
```

### Migration Best Practices

1. **Test migrations locally first**
   ```bash
   # Create backup
   pg_dump $DATABASE_URL > backup.sql

   # Run migration
   npm run db:migrate

   # Verify
   npm run db:studio
   ```

2. **Production migrations**
   - Run during low-traffic periods
   - Have rollback plan ready
   - Monitor for errors

### Backup Strategy

```bash
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

Supabase also provides automatic backups in the dashboard.

---

## Post-Deployment Checklist

### Immediate Verification

- [ ] **Health Check**: Verify `/health` endpoint responds
- [ ] **Home Page**: Load main page successfully
- [ ] **Authentication**: Test login/register flow
- [ ] **API Connectivity**: Verify frontend-backend communication
- [ ] **Database**: Confirm database queries work
- [ ] **Payments**: Test Stripe checkout (use test mode first)

### Smoke Tests

```bash
# Check frontend
curl -I https://your-domain.com

# Check backend health
curl https://api.your-domain.com/health

# Check API response
curl https://api.your-domain.com/api/v1/countries
```

### Monitoring Setup

1. **Error Tracking**
   - Configure error logging
   - Set up alerts for errors

2. **Performance Monitoring**
   - Monitor response times
   - Track server resources

3. **Uptime Monitoring**
   - Set up ping checks
   - Configure downtime alerts

---

## Rollback Procedures

### Frontend Rollback

#### Vercel
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel rollback [deployment-url]
```

#### Docker
```bash
# Stop current container
docker stop relogate-frontend

# Run previous version
docker run -d --name relogate-frontend relogate-frontend:previous-tag
```

### Backend Rollback

```bash
# Git revert
git revert HEAD
git push origin main

# Or checkout previous version
git checkout <previous-commit-hash>
npm run build
npm run start
```

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql

# Or use Supabase point-in-time recovery
# (Available in Supabase Dashboard)
```

---

## CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment-Specific Deployments

```yaml
# Staging deployment
- name: Deploy Staging
  if: github.ref == 'refs/heads/dev'
  run: vercel --env staging

# Production deployment
- name: Deploy Production
  if: github.ref == 'refs/heads/main'
  run: vercel --prod
```

---

## Stripe Webhook Configuration

### Development

```bash
# Install Stripe CLI
stripe login

# Forward webhooks locally
stripe listen --forward-to localhost:3001/api/v1/payments/webhook
```

### Production

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://api.your-domain.com/api/v1/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy signing secret to environment variables

---

## Security Considerations

### HTTPS
- Always use HTTPS in production
- Configure proper SSL certificates
- Redirect HTTP to HTTPS

### CORS
- Configure `CORS_ORIGIN` to only allow your frontend domain
- Don't use wildcard (`*`) in production

### Rate Limiting
- Consider adding rate limiting middleware
- Protect against brute force attacks

### Secrets
- Use environment variables, never hardcode
- Rotate secrets periodically
- Use different secrets per environment

---

## Troubleshooting Deployment

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run build` locally first |
| 500 errors | Check server logs, verify env vars |
| CORS errors | Verify `CORS_ORIGIN` configuration |
| Auth fails | Check Supabase credentials |
| Payments fail | Verify Stripe keys and webhook secret |
| DB connection fails | Check `DATABASE_URL` and network access |

### Checking Logs

```bash
# Vercel
vercel logs

# Railway
railway logs

# Docker
docker logs relogate-backend

# PM2
pm2 logs relogate-backend
```
