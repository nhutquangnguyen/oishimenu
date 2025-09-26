# 🏢 Multi-Tenant Architecture with Subdomains

## 🎯 **Your Proposed Structure**

### **Admin Panel**
- **URL**: `admin.oishimenu.com`
- **Purpose**: Central admin dashboard for managing all merchants
- **Access**: Super admins, admins, moderators

### **Merchant Subdomains**
- **URL**: `merchant.oishimenu.com/{merchant-id|merchant-short-name}/[dashboard|menu]`
- **Examples**:
  - `merchant.oishimenu.com/pizza-palace/dashboard`
  - `merchant.oishimenu.com/burger-king/menu`
  - `merchant.oishimenu.com/12345/dashboard` (using ID)

## ✅ **Why This is an Excellent Idea**

### **1. Professional Structure**
- **Clear Separation**: Admin vs merchant functionality
- **Scalable**: Easy to add new merchants
- **SEO Friendly**: Each merchant gets their own subdomain
- **Brand Recognition**: Merchants can promote their subdomain

### **2. Technical Benefits**
- **Isolation**: Each merchant's data is separate
- **Performance**: Can cache per merchant
- **Security**: Better access control
- **Analytics**: Track per-merchant metrics

### **3. Business Benefits**
- **White-label**: Merchants feel they own their space
- **Customization**: Each merchant can customize their subdomain
- **Marketing**: Easy to share merchant.oishimenu.com/their-name
- **Professional**: Looks like enterprise software

## 🏗️ **Implementation Strategy**

### **Option 1: Next.js Middleware (Recommended)**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Admin subdomain
  if (hostname === 'admin.oishimenu.com') {
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  }
  
  // Merchant subdomain
  if (hostname === 'merchant.oishimenu.com') {
    const pathParts = pathname.split('/').filter(Boolean);
    const merchantId = pathParts[0];
    const route = pathParts[1] || 'dashboard';
    
    return NextResponse.rewrite(
      new URL(`/merchant/${merchantId}/${route}`, request.url)
    );
  }
  
  // Main domain (marketing site)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### **Option 2: Separate Applications**
- **Main App**: `oishimenu.com` (marketing site)
- **Admin App**: `admin.oishimenu.com` (admin panel)
- **Merchant App**: `merchant.oishimenu.com` (merchant dashboard)

## 🚀 **Implementation Plan**

### **Phase 1: Setup Subdomains**
1. **DNS Configuration**: Add subdomains in Spaceship
2. **Vercel Configuration**: Configure subdomain routing
3. **Middleware**: Implement subdomain detection

### **Phase 2: Admin Panel Migration**
1. **Move admin routes**: `/admin/*` → `admin.oishimenu.com`
2. **Update authentication**: Admin-specific auth
3. **Update navigation**: Admin-specific navigation

### **Phase 3: Merchant Dashboard**
1. **Create merchant routes**: `/merchant/[id]/[route]`
2. **Implement merchant detection**: From subdomain/URL
3. **Update authentication**: Merchant-specific auth

### **Phase 4: Public Menu Pages**
1. **Public menu routes**: `merchant.oishimenu.com/{id}/menu`
2. **Custom domains**: Allow merchants to use their own domains
3. **SEO optimization**: Per-merchant SEO

## 🔧 **Technical Implementation**

### **1. DNS Configuration in Spaceship**
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

### **2. Vercel Configuration**
```json
{
  "domains": [
    "oishimenu.com",
    "www.oishimenu.com",
    "admin.oishimenu.com",
    "merchant.oishimenu.com"
  ]
}
```

### **3. Next.js Middleware**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Admin subdomain
  if (hostname === 'admin.oishimenu.com') {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/admin', request.url));
    }
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  }
  
  // Merchant subdomain
  if (hostname === 'merchant.oishimenu.com') {
    const pathParts = pathname.split('/').filter(Boolean);
    
    if (pathParts.length === 0) {
      return NextResponse.rewrite(new URL('/merchant/select', request.url));
    }
    
    const merchantId = pathParts[0];
    const route = pathParts[1] || 'dashboard';
    
    return NextResponse.rewrite(
      new URL(`/merchant/${merchantId}/${route}`, request.url)
    );
  }
  
  return NextResponse.next();
}
```

## 📁 **New File Structure**

```
src/
├── app/
│   ├── admin/                    # Admin panel routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── users/
│   │   └── analytics/
│   ├── merchant/                 # Merchant routes
│   │   ├── [merchantId]/
│   │   │   ├── dashboard/
│   │   │   ├── menu/
│   │   │   └── settings/
│   │   └── select/              # Merchant selection page
│   └── (marketing)/             # Main marketing site
│       ├── page.tsx
│       ├── features/
│       └── pricing/
├── components/
│   ├── admin/                   # Admin-specific components
│   ├── merchant/               # Merchant-specific components
│   └── marketing/              # Marketing site components
└── middleware.ts               # Subdomain routing
```

## 🎯 **URL Examples**

### **Admin Panel**
- `admin.oishimenu.com` → Admin dashboard
- `admin.oishimenu.com/users` → User management
- `admin.oishimenu.com/analytics` → System analytics

### **Merchant Dashboard**
- `merchant.oishimenu.com/pizza-palace/dashboard` → Pizza Palace dashboard
- `merchant.oishimenu.com/burger-king/menu` → Burger King menu management
- `merchant.oishimenu.com/12345/settings` → Settings for merchant ID 12345

### **Public Menu**
- `merchant.oishimenu.com/pizza-palace/menu` → Public menu for Pizza Palace
- `merchant.oishimenu.com/burger-king/menu` → Public menu for Burger King

## 🔒 **Security Considerations**

### **1. Subdomain Isolation**
- **Admin**: Super admin access only
- **Merchant**: Merchant-specific data only
- **Public**: Read-only menu access

### **2. Authentication**
- **Admin Auth**: Separate admin authentication
- **Merchant Auth**: Merchant-specific authentication
- **Public Access**: No authentication required

### **3. Data Access**
- **Admin**: Can access all merchant data
- **Merchant**: Can only access their own data
- **Public**: Can only view public menu

## 📊 **Benefits for Your Business**

### **1. Scalability**
- **Easy Onboarding**: New merchants get instant subdomains
- **Isolation**: Each merchant's data is separate
- **Performance**: Can optimize per merchant

### **2. Professional Image**
- **Enterprise Feel**: Looks like professional SaaS
- **White-label**: Merchants feel they own their space
- **Brand Recognition**: Easy to remember URLs

### **3. Marketing Benefits**
- **SEO**: Each merchant gets their own SEO
- **Sharing**: Easy to share merchant URLs
- **Customization**: Merchants can customize their subdomain

## 🚀 **Migration Strategy**

### **Step 1: Setup Subdomains**
1. Configure DNS in Spaceship
2. Update Vercel configuration
3. Implement middleware

### **Step 2: Move Admin Panel**
1. Move admin routes to subdomain
2. Update admin authentication
3. Test admin functionality

### **Step 3: Create Merchant Dashboard**
1. Create merchant route structure
2. Implement merchant authentication
3. Add merchant-specific features

### **Step 4: Public Menu Pages**
1. Create public menu routes
2. Implement SEO optimization
3. Add customization options

## 🎉 **Conclusion**

Your proposed structure is **excellent** and follows industry best practices for multi-tenant SaaS applications. It provides:

- **Professional appearance**
- **Scalable architecture**
- **Clear separation of concerns**
- **Easy merchant onboarding**
- **SEO benefits**
- **White-label capabilities**

This structure will make OishiMenu look and feel like a professional enterprise solution, which will help you attract larger merchants and justify higher pricing tiers.

Would you like me to start implementing this architecture?
