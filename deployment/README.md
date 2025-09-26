# 🚀 OishiMenu Deployment

This folder contains deployment scripts and configuration files for OishiMenu.

## 📁 **Files Overview**

### **Scripts**
- **[deploy.sh](./deploy.sh)** - Automated deployment preparation script

## 🚀 **Quick Deployment**

### **1. Run the Deployment Script**
```bash
./deploy.sh
```

This script will:
- ✅ Check your build
- ✅ Create environment variable template
- ✅ Initialize Git if needed
- ✅ Verify everything is ready

### **2. Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your OishiMenu repository
4. Add environment variables
5. Deploy!

### **3. Configure DNS**
1. Add subdomains in Vercel:
   - `oishimenu.com`
   - `www.oishimenu.com`
   - `admin.oishimenu.com`
   - `merchant.oishimenu.com`

2. Configure DNS in Spaceship:
   - Add CNAME records for subdomains
   - Wait for DNS propagation

## 🔧 **Environment Variables**

### **Required Variables**
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

## 🌐 **DNS Configuration**

### **CNAME Records for Subdomains**
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

### **A Records for Main Domain**
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

## 📊 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Environment variables configured
- [ ] Firebase project settings updated
- [ ] Domain DNS configured
- [ ] All features working locally

### **Post-Deployment**
- [ ] Domain accessible at oishimenu.com
- [ ] Admin panel accessible at admin.oishimenu.com
- [ ] Merchant selection accessible at merchant.oishimenu.com
- [ ] SSL certificate active
- [ ] All features working
- [ ] Performance optimized

## 🎯 **Expected Results**

After successful deployment:
- **Main Site**: https://oishimenu.com
- **Admin Panel**: https://admin.oishimenu.com
- **Merchant Selection**: https://merchant.oishimenu.com
- **Individual Merchant**: https://merchant.oishimenu.com/{merchant-id}/dashboard

## 📞 **Support**

For deployment issues:
1. Check the deployment guides in `/docs/`
2. Review Vercel documentation
3. Check DNS propagation status
4. Verify environment variables

Your OishiMenu application will be live and ready to serve customers worldwide! 🌍
