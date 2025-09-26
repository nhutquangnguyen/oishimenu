# 🚀 Quick Deployment Steps for oishimenu.com

## ⚡ **Fast Track Deployment**

Follow these steps to get your OishiMenu application live on oishimenu.com in under 30 minutes!

## 📋 **Step 1: Prepare Your Code (5 minutes)**

### **1.1 Run the Deployment Script**
```bash
./deploy.sh
```

### **1.2 Update Environment Variables**
Edit `.env.local` with your actual Firebase credentials:
```bash
# Get these from Firebase Console > Project Settings > General
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin credentials
ADMIN_EMAIL=admin@oishimenu.com
ADMIN_PASSWORD=your_secure_password
```

## 🌐 **Step 2: Deploy to Vercel (10 minutes)**

### **2.1 Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up" and connect with GitHub
3. Import your OishiMenu repository

### **2.2 Configure Deployment**
1. **Framework**: Next.js (auto-detected)
2. **Root Directory**: `./`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`

### **2.3 Add Environment Variables**
In Vercel dashboard > Project Settings > Environment Variables:
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

## 🔗 **Step 3: Connect oishimenu.com (10 minutes)**

### **3.1 Add Domain in Vercel**
1. Go to your project in Vercel
2. Click "Domains" tab
3. Add `oishimenu.com`
4. Add `www.oishimenu.com`

### **3.2 Configure DNS in Spaceship**
1. Log into [Spaceship](https://spaceship.com)
2. Go to your domain management
3. Navigate to DNS settings for oishimenu.com
4. Add these DNS records:

#### **Option A: A Records (Recommended)**
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

#### **Option B: CNAME Records**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

## 🔥 **Step 4: Configure Firebase (5 minutes)**

### **4.1 Update Authorized Domains**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Authentication > Settings
4. Add authorized domains:
   - `oishimenu.com`
   - `www.oishimenu.com`
   - `your-app-name.vercel.app`

### **4.2 Update Firestore Rules**
Make sure your `firestore.rules` are production-ready:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Your production rules here
    match /{document=**} {
      allow read, write: if true; // Temporary for testing
    }
  }
}
```

## ✅ **Step 5: Test Your Deployment**

### **5.1 Test Checklist**
- [ ] Visit `oishimenu.com` - should load your app
- [ ] Visit `www.oishimenu.com` - should redirect to main domain
- [ ] Check HTTPS is working (green lock icon)
- [ ] Test user registration/login
- [ ] Test admin panel access
- [ ] Test mobile responsiveness

### **5.2 Common Issues & Solutions**

#### **Domain Not Loading**
- Wait 5-10 minutes for DNS propagation
- Check DNS records in Spaceship
- Verify domain is added in Vercel

#### **Firebase Authentication Errors**
- Check authorized domains in Firebase Console
- Verify environment variables in Vercel
- Test in incognito mode

#### **Build Errors**
- Check all environment variables are set
- Verify Firebase configuration
- Check build logs in Vercel dashboard

## 🎉 **Success!**

Once all steps are complete, your OishiMenu application will be live at:
- **Main Domain**: https://oishimenu.com
- **WWW Domain**: https://www.oishimenu.com
- **Vercel URL**: https://your-app-name.vercel.app

## 📞 **Need Help?**

### **Vercel Support**
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### **Spaceship Support**
- [Spaceship Help](https://spaceship.com/help)
- [DNS Configuration](https://spaceship.com/help/dns)

### **Firebase Support**
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)

## 🚀 **Next Steps After Deployment**

1. **Set up monitoring**: Enable Vercel Analytics
2. **Configure backups**: Set up database backups
3. **Security review**: Review and update security settings
4. **Performance optimization**: Monitor and optimize performance
5. **SEO setup**: Configure meta tags and sitemap

Your OishiMenu application is now ready to serve customers worldwide! 🌍
