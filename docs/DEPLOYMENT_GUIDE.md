# 🚀 OishiMenu Deployment Guide - Complete Setup

## 🎯 **Deployment Overview**

This guide will help you deploy your OishiMenu application to oishimenu.com using Vercel (recommended for Next.js) and connect your custom domain purchased from Spaceship.

## 📋 **Prerequisites**

- ✅ Domain purchased on Spaceship (oishimenu.com)
- ✅ Next.js application ready
- ✅ Firebase project configured
- ✅ Git repository (GitHub recommended)

## 🚀 **Step 1: Prepare Your Application**

### **1.1 Update Package.json**
Make sure your `package.json` has the correct name and build scripts:

```json
{
  "name": "oishimenu",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### **1.2 Environment Variables**
Create a `.env.local` file with your production environment variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration
ADMIN_EMAIL=admin@oishimenu.com
ADMIN_PASSWORD=your_secure_password
```

## 🌐 **Step 2: Deploy to Vercel**

### **2.1 Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### **2.2 Deploy Your Application**
1. **Import Project**: Click "New Project" in Vercel dashboard
2. **Select Repository**: Choose your OishiMenu repository
3. **Configure Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (if your app is in root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)

### **2.3 Environment Variables in Vercel**
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add all your environment variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ADMIN_EMAIL=admin@oishimenu.com
   ADMIN_PASSWORD=your_secure_password
   ```

## 🔗 **Step 3: Connect Custom Domain**

### **3.1 Add Domain in Vercel**
1. Go to your project in Vercel dashboard
2. Click on "Domains" tab
3. Add `oishimenu.com` and `www.oishimenu.com`
4. Add `admin.oishimenu.com`
5. Add `merchant.oishimenu.com`
4. Vercel will provide DNS records to configure

### **3.2 Configure DNS in Spaceship**
1. Log into your Spaceship account
2. Go to your domain management
3. Navigate to DNS settings for oishimenu.com
4. Add the following DNS records:

#### **A Records**
```
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600

Type: A
Name: www
Value: 76.76.19.61
TTL: 3600
```

#### **CNAME Records for Subdomains**
```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: 3600

Type: CNAME
Name: merchant
Value: cname.vercel-dns.com
TTL: 3600
```

#### **CNAME Records**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### **3.3 Alternative: Use Vercel's Nameservers**
If you prefer, you can use Vercel's nameservers:
1. In Vercel, go to your domain settings
2. Copy the nameservers provided
3. In Spaceship, update your domain's nameservers to:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

## 🔧 **Step 4: Firebase Configuration**

### **4.1 Update Firebase Hosting (Optional)**
If you want to use Firebase Hosting instead of Vercel:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Build your app
npm run build

# Deploy to Firebase
firebase deploy
```

### **4.2 Configure Firebase for Production**
1. Go to Firebase Console
2. Navigate to Authentication > Settings
3. Add your production domain to authorized domains:
   - `oishimenu.com`
   - `www.oishimenu.com`
   - `your-vercel-app.vercel.app`

## 🛠️ **Step 5: Production Optimizations**

### **5.1 Next.js Configuration**
Update your `next.config.ts` for production:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['your-domain.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

### **5.2 Performance Optimizations**
1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Automatic with Next.js
3. **Caching**: Configure in Vercel dashboard
4. **CDN**: Automatic with Vercel

## 🔒 **Step 6: Security Configuration**

### **6.1 SSL Certificate**
- Vercel automatically provides SSL certificates
- Your site will be accessible via HTTPS

### **6.2 Security Headers**
Add security headers in `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## 📊 **Step 7: Monitoring and Analytics**

### **7.1 Vercel Analytics**
1. Enable Vercel Analytics in your project
2. Monitor performance and user behavior
3. Track Core Web Vitals

### **7.2 Firebase Analytics**
1. Enable Firebase Analytics
2. Track user engagement
3. Monitor app performance

## 🧪 **Step 8: Testing Your Deployment**

### **8.1 Pre-deployment Checklist**
- [ ] Environment variables configured
- [ ] Firebase project settings updated
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] All features working locally

### **8.2 Post-deployment Testing**
1. **Domain Access**: Test oishimenu.com and www.oishimenu.com
2. **HTTPS**: Verify SSL certificate is working
3. **Firebase**: Test authentication and database
4. **Admin Panel**: Test admin functionality
5. **Mobile**: Test responsive design
6. **Performance**: Check loading speeds

## 🚨 **Troubleshooting**

### **Common Issues**

#### **DNS Not Propagating**
- Wait 24-48 hours for DNS propagation
- Use DNS checker tools to verify
- Clear browser cache

#### **SSL Certificate Issues**
- Vercel handles SSL automatically
- Check domain configuration
- Verify DNS records

#### **Firebase Authentication Issues**
- Check authorized domains
- Verify environment variables
- Test in incognito mode

#### **Build Errors**
- Check environment variables
- Verify all dependencies
- Review build logs in Vercel

## 📈 **Step 9: Post-Deployment**

### **9.1 Monitor Performance**
- Use Vercel Analytics
- Monitor Firebase usage
- Check error logs

### **9.2 Regular Updates**
- Set up automatic deployments
- Monitor for security updates
- Keep dependencies updated

### **9.3 Backup Strategy**
- Regular database backups
- Code repository backups
- Environment variable backups

## 🎉 **Success Checklist**

- [ ] Domain purchased on Spaceship
- [ ] Application deployed to Vercel
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] Firebase configured for production
- [ ] Environment variables set
- [ ] DNS records configured
- [ ] Site accessible at oishimenu.com
- [ ] All features working
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Analytics enabled
- [ ] Monitoring set up

## 📞 **Support Resources**

### **Vercel Support**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### **Spaceship Support**
- [Spaceship Help Center](https://spaceship.com/help)
- [DNS Configuration Guide](https://spaceship.com/help/dns)

### **Firebase Support**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)

Your OishiMenu application will be live at oishimenu.com once you complete these steps!
