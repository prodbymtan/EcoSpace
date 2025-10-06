# Deployment Guide

## Overview

This guide covers various deployment options for the EcoSpace application, from local development to production environments.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- NASA API key (optional for demo)
- Git repository access

## Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-username/ecospace-air-tracker.git
cd ecospace-air-tracker

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your NASA API key

# Start development server
npm run dev
```

### Development Server Features
- Hot reloading
- TypeScript compilation
- Tailwind CSS processing
- API route development
- Error overlay

## Production Build

### Build Process
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

### Build Optimization
- Code splitting
- Image optimization
- CSS minification
- JavaScript minification
- Tree shaking
- Bundle analysis

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides seamless deployment for Next.js applications.

#### Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NASA_API_KEY
```

#### Configuration
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NASA_API_KEY": "@nasa_api_key"
  }
}
```

#### Features
- Automatic deployments from Git
- Preview deployments for PRs
- Edge functions
- Global CDN
- Analytics

### 2. Netlify

#### Setup
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

#### Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS Amplify

#### Setup
1. Connect your Git repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

### 4. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
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

#### Docker Compose
```yaml
version: '3.8'
services:
  ecospace:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NASA_API_KEY=${NASA_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

### 5. Traditional VPS/Server

#### Setup
```bash
# On your server
git clone https://github.com/your-username/ecospace-air-tracker.git
cd ecospace-air-tracker

# Install dependencies
npm install

# Build the application
npm run build

# Install PM2 for process management
npm install -g pm2

# Start the application
pm2 start npm --name "ecospace" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Required Variables
```env
# NASA API Configuration
NASA_API_KEY=your_nasa_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_NAME=EcoSpace
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Optional Variables
```env
# Map Configuration
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=2
NEXT_PUBLIC_MAP_DEFAULT_LAT=20
NEXT_PUBLIC_MAP_DEFAULT_LNG=0

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api

# Feature Flags
NEXT_PUBLIC_ENABLE_COMMUNITY_FEATURES=true
NEXT_PUBLIC_ENABLE_AI_FORECASTING=true
NEXT_PUBLIC_ENABLE_REAL_TIME_DATA=true

# Database (if using)
DATABASE_URL=your_database_url

# Redis (if using)
REDIS_URL=your_redis_url

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Performance Optimization

### Build Optimization
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['api.nasa.gov', 'earthdata.nasa.gov'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
```

### Caching Strategy
```javascript
// pages/api/air-quality.js
export async function GET(request) {
  const response = NextResponse.json(data)
  
  // Cache for 15 minutes
  response.headers.set('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  
  return response
}
```

## Monitoring and Analytics

### Application Monitoring
```javascript
// lib/monitoring.js
import { Analytics } from '@vercel/analytics/react'

export function AnalyticsProvider({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}
```

### Error Tracking
```javascript
// lib/error-tracking.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### Performance Monitoring
```javascript
// lib/performance.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

## Security Considerations

### Environment Variables
- Never commit API keys to version control
- Use different keys for different environments
- Rotate keys regularly
- Use secret management services

### API Security
```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}
```

### Rate Limiting
```javascript
// lib/rate-limit.js
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

export async function rateLimit(request) {
  const ip = request.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
}
```

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          NASA_API_KEY: ${{ secrets.NASA_API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### API Key Issues
```bash
# Verify environment variables
echo $NASA_API_KEY
```

#### Map Loading Issues
```javascript
// Ensure Leaflet CSS is imported
import 'leaflet/dist/leaflet.css'
```

### Performance Issues
- Enable compression
- Optimize images
- Use CDN for static assets
- Implement caching
- Monitor bundle size

### Debugging
```javascript
// Enable debug mode
const debug = process.env.NODE_ENV === 'development'

if (debug) {
  console.log('Debug information:', data)
}
```

## Backup and Recovery

### Database Backup
```bash
# If using a database
pg_dump $DATABASE_URL > backup.sql
```

### File Backup
```bash
# Backup important files
tar -czf backup.tar.gz .env.local public/ uploads/
```

### Recovery Process
```bash
# Restore from backup
tar -xzf backup.tar.gz
psql $DATABASE_URL < backup.sql
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Implement session storage
- Use CDN for static assets
- Database connection pooling

### Vertical Scaling
- Increase server resources
- Optimize application code
- Use caching layers
- Implement database indexing

## Maintenance

### Regular Tasks
- Update dependencies
- Monitor performance
- Check error logs
- Backup data
- Security updates

### Monitoring Checklist
- [ ] Application uptime
- [ ] API response times
- [ ] Error rates
- [ ] Resource usage
- [ ] Security alerts

## Support

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [NASA API Documentation](https://api.nasa.gov/)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [NASA Space Apps Community](https://www.spaceappschallenge.org/)
- [GitHub Issues](https://github.com/your-username/ecospace-air-tracker/issues)
