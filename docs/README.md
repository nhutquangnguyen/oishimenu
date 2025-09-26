# 📚 OishiMenu Documentation

This folder contains all documentation for the OishiMenu project.

## 📋 **Documentation Overview**

### **🚀 Deployment & Setup**
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide for oishimenu.com
- **[QUICK_DEPLOYMENT_STEPS.md](./QUICK_DEPLOYMENT_STEPS.md)** - Fast track deployment steps
- **[MULTI_TENANT_ARCHITECTURE.md](./MULTI_TENANT_ARCHITECTURE.md)** - Multi-tenant subdomain architecture
- **[SUBDOMAIN_IMPLEMENTATION_SUMMARY.md](./SUBDOMAIN_IMPLEMENTATION_SUMMARY.md)** - Implementation summary

### **🔧 Technical Documentation**
- **[COMPREHENSIVE_USEAUTH_FIX.md](./COMPREHENSIVE_USEAUTH_FIX.md)** - Authentication system fixes
- **[admin-test-info.md](./admin-test-info.md)** - Admin testing information
- **[DELETE_USER_INSTRUCTIONS.md](./DELETE_USER_INSTRUCTIONS.md)** - User deletion instructions

### **📁 Organized Documentation Structure**
- **[technical/](./technical/)** - Technical implementation guides
- **[features/](./features/)** - Feature implementation documentation
- **[fixes/](./fixes/)** - Bug fixes and troubleshooting guides

## 🎯 **Quick Start**

### **For Deployment**
1. Read [QUICK_DEPLOYMENT_STEPS.md](./QUICK_DEPLOYMENT_STEPS.md) for fast deployment
2. Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed setup
3. Configure subdomains using [MULTI_TENANT_ARCHITECTURE.md](./MULTI_TENANT_ARCHITECTURE.md)

### **For Development**
1. Check [COMPREHENSIVE_USEAUTH_FIX.md](./COMPREHENSIVE_USEAUTH_FIX.md) for authentication issues
2. Use [admin-test-info.md](./admin-test-info.md) for admin testing
3. Follow [DELETE_USER_INSTRUCTIONS.md](./DELETE_USER_INSTRUCTIONS.md) for user management

## 🏗️ **Project Structure**

```
OishiMenu/
├── docs/                           # 📚 Documentation
│   ├── README.md                   # This file
│   ├── DEPLOYMENT_GUIDE.md         # Complete deployment guide
│   ├── QUICK_DEPLOYMENT_STEPS.md   # Fast track deployment
│   ├── MULTI_TENANT_ARCHITECTURE.md # Subdomain architecture
│   ├── SUBDOMAIN_IMPLEMENTATION_SUMMARY.md # Implementation summary
│   ├── COMPREHENSIVE_USEAUTH_FIX.md # Authentication fixes
│   ├── admin-test-info.md          # Admin testing info
│   └── DELETE_USER_INSTRUCTIONS.md # User deletion guide
├── deployment/                     # 🚀 Deployment scripts
│   └── deploy.sh                   # Deployment script
├── src/                           # 💻 Source code
│   ├── app/                        # Next.js app directory
│   ├── components/                 # React components
│   ├── contexts/                   # React contexts
│   ├── hooks/                      # Custom hooks
│   ├── lib/                        # Utility libraries
│   └── types/                      # TypeScript types
└── ...                            # Other project files
```

## 🌐 **Subdomain Structure**

### **Main Domains**
- **`oishimenu.com`** - Marketing landing page
- **`www.oishimenu.com`** - WWW redirect

### **Admin Panel**
- **`admin.oishimenu.com`** - Central admin dashboard

### **Merchant Subdomains**
- **`merchant.oishimenu.com`** - Merchant selection page
- **`merchant.oishimenu.com/{id}/dashboard`** - Merchant dashboard
- **`merchant.oishimenu.com/{id}/menu`** - Menu management
- **`merchant.oishimenu.com/{id}/menu/public`** - Public customer menu

## 🔧 **Technical Stack**

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom gradients
- **Authentication**: Firebase Auth + Custom Admin Auth
- **Database**: Firestore
- **Hosting**: Vercel
- **Domain**: Spaceship

## 📞 **Support**

For technical support or questions:
- Check the relevant documentation above
- Review the deployment guides
- Follow the troubleshooting steps

## 🎉 **Success Metrics**

After successful deployment, you should have:
- ✅ Main site at `oishimenu.com`
- ✅ Admin panel at `admin.oishimenu.com`
- ✅ Merchant selection at `merchant.oishimenu.com`
- ✅ Individual merchant dashboards
- ✅ Public customer menus
- ✅ SSL certificates active
- ✅ All features working

Your OishiMenu application will be live and ready to serve customers worldwide! 🌍
