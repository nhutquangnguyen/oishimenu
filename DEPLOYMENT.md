# 🚀 OishiMenu Deployment Guide

Complete deployment guide for the OishiMenu digital menu platform.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Deployment Options](#deployment-options)
- [Environment Setup](#environment-setup)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Manual Server Deployment](#manual-server-deployment)
- [Domain Configuration](#domain-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

The fastest way to deploy OishiMenu:

```bash
# Clone and setup
git clone <your-repo-url>
cd oishi-menu

# Run deployment script
npm run deploy
# or
./deploy.sh
```

Choose option 1 for Vercel deployment or option 2 for production build.

## 🎯 Deployment Options

### 1. **Vercel (Recommended)**
- ✅ Zero-config deployment
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Serverless functions
- ✅ Built-in analytics

### 2. **Docker Container**
- ✅ Full control
- ✅ Scalable
- ✅ Isolated environment
- ✅ Works on any cloud

### 3. **Manual Server**
- ✅ Complete customization
- ✅ Cost-effective
- ✅ On-premise option

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.production` file with:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Production URL
NEXT_PUBLIC_APP_URL=https://oishimenu.com

# Admin Configuration
ADMIN_EMAIL=admin@oishimenu.com
ADMIN_PASSWORD=your_secure_password

# Environment
NODE_ENV=production
```

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Email/Password and Google
3. Create a Firestore database
4. Copy your config values to environment variables

## 🌐 Vercel Deployment

### Automatic Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git remote add origin https://github.com/yourusername/oishimenu.git
   git push -u origin main
   ```

2. **Deploy with Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.production`
   - Deploy!

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... repeat for all variables
```

### Custom Domain

1. Go to Project Settings → Domains
2. Add `oishimenu.com`
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.19.61
   ```

## 🐳 Docker Deployment

### Quick Start

```bash
# Build and run
docker-compose up -d

# Or build manually
docker build -t oishimenu .
docker run -p 3000:3000 --env-file .env.production oishimenu
```

### Production Docker Setup

1. **Prepare Environment**
   ```bash
   cp .env.production .env
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Configure SSL** (if using nginx)
   - Place SSL certificates in `./ssl/`
   - Update domain in `nginx.conf`

### Cloud Deployment

#### AWS ECS
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag oishimenu:latest <account>.dkr.ecr.us-east-1.amazonaws.com/oishimenu:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/oishimenu:latest
```

#### Google Cloud Run
```bash
# Deploy to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT-ID/oishimenu
gcloud run deploy --image gcr.io/PROJECT-ID/oishimenu --platform managed
```

## 🖥️ Manual Server Deployment

### Requirements
- Node.js 18+
- npm or yarn
- PM2 (for process management)
- Nginx (reverse proxy)

### Step-by-Step

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo> /var/www/oishimenu
   cd /var/www/oishimenu

   # Install dependencies
   npm ci --production

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "oishimenu" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name oishimenu.com www.oishimenu.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d oishimenu.com -d www.oishimenu.com
   ```

## 🌍 Domain Configuration

### DNS Records

Configure these records with your domain provider:

```
Type: A     Name: @     Value: <your-server-ip>
Type: CNAME Name: www   Value: oishimenu.com
Type: MX    Name: @     Value: 10 mx.zoho.com
```

### Domain Verification

1. **Verify DNS propagation**
   ```bash
   dig oishimenu.com
   nslookup oishimenu.com
   ```

2. **Test SSL**
   ```bash
   curl -I https://oishimenu.com
   ```

## 📊 Monitoring & Maintenance

### Health Checks

Add a health check endpoint:

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

### Monitoring Setup

1. **Uptime Monitoring**
   - Use services like UptimeRobot, Pingdom, or StatusCake
   - Monitor main endpoints: `/`, `/api/health`, `/auth/signin`

2. **Performance Monitoring**
   ```bash
   # Install Lighthouse CI
   npm install -g @lhci/cli

   # Run performance tests
   lhci autorun
   ```

3. **Error Tracking**
   - Consider Sentry, LogRocket, or Vercel Analytics
   - Set up alerts for critical errors

### Backup Strategy

1. **Firebase Backup**
   ```bash
   # Export Firestore data
   gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d)
   ```

2. **Code Backup**
   - Keep Git repository updated
   - Tag releases: `git tag v1.0.0`

### Updates & Maintenance

```bash
# Update dependencies
npm update

# Security audit
npm audit

# Update deployment
git pull origin main
npm run build
pm2 restart oishimenu
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next

   # Clear node modules
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment Variable Issues**
   ```bash
   # Verify environment variables
   env | grep NEXT_PUBLIC

   # Check if variables are loaded
   console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
   ```

3. **Firebase Connection Issues**
   - Verify Firebase config
   - Check Firebase security rules
   - Ensure domain is authorized

4. **SSL/HTTPS Issues**
   ```bash
   # Check certificate
   openssl s_client -connect oishimenu.com:443

   # Renew Let's Encrypt
   sudo certbot renew
   ```

### Performance Optimization

1. **Enable compression**
   - Gzip/Brotli in nginx/Vercel
   - Image optimization with Next.js

2. **Caching strategy**
   - Static assets: 1 year
   - API responses: appropriate TTL
   - CDN configuration

3. **Database optimization**
   - Firebase indexes
   - Query optimization
   - Data structure review

### Support

- 📖 Documentation: https://docs.oishimenu.com
- 🐛 Issues: GitHub Issues
- 💬 Community: Discord/Slack
- 📧 Support: support@oishimenu.com

---

## 🎉 Congratulations!

Your OishiMenu application is now deployed and ready to serve digital menus to restaurants worldwide! 🍜

Remember to:
- ✅ Monitor application health
- ✅ Keep dependencies updated
- ✅ Regular backups
- ✅ Security audits
- ✅ Performance monitoring

Happy serving! 🚀