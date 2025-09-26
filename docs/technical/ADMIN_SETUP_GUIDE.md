# Admin Account Setup Guide

This guide helps you create example admin accounts for testing your admin system.

## 🚀 Quick Setup

### Step 1: Add Example Admin Accounts

Update your `src/lib/adminManagement.ts` file to include example admins:

```typescript
// Default admin accounts (hardcoded for initial setup)
const DEFAULT_ADMINS = [
  {
    email: 'nguyenquang.btr@gmail.com',
    name: 'Nguyen Quang',
    role: 'super_admin' as const,
    permissions: [
      { resource: '*', actions: ['*'] } // Super admin has all permissions
    ]
  },
  {
    email: 'dinhbarista.com',
    name: 'Dinh Barista',
    role: 'super_admin' as const,
    permissions: [
      { resource: '*', actions: ['*'] } // Super admin has all permissions
    ]
  },
  // Add these example accounts:
  {
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'super_admin' as const,
    permissions: [
      { resource: '*', actions: ['*'] }
    ]
  },
  {
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'admin' as const,
    permissions: [
      { resource: 'users', actions: ['read', 'write'] },
      { resource: 'restaurants', actions: ['read'] },
      { resource: 'orders', actions: ['read'] }
    ]
  },
  {
    email: 'moderator@example.com',
    name: 'Moderator User',
    role: 'moderator' as const,
    permissions: [
      { resource: 'users', actions: ['read'] },
      { resource: 'restaurants', actions: ['read'] }
    ]
  }
];
```

### Step 2: Add Admin Passwords

Update your `src/lib/adminAuth.ts` file to include passwords for the new accounts:

```typescript
// Simple password verification (in production, use proper hashing)
const ADMIN_PASSWORDS: Record<string, string> = {
  'nguyenquang.btr@gmail.com': 'admin123',
  'dinhbarista.com': 'admin123',
  // Add these example passwords:
  'admin@example.com': 'admin123',
  'manager@example.com': 'manager123',
  'moderator@example.com': 'moderator123'
};
```

### Step 3: Initialize Admin System

The admin system will automatically create these accounts when you first access the admin panel.

## 🔐 Test Admin Accounts

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| `admin@example.com` | `admin123` | Super Admin | All permissions |
| `manager@example.com` | `manager123` | Admin | User management, read restaurants/orders |
| `moderator@example.com` | `moderator123` | Moderator | Read users and restaurants |

## 🧪 Testing Admin Login

1. Go to `/admin/login`
2. Use any of the test accounts above
3. You should be redirected to the admin dashboard
4. Test different permission levels with different accounts

## 🔧 Admin Roles Explained

### Super Admin
- Full system access
- Can manage all users, restaurants, orders
- Can create/delete other admins
- Access to all analytics

### Admin  
- Can manage users (disable/enable)
- Can view restaurants and orders
- Cannot create other admins
- Limited analytics access

### Moderator
- Read-only access to users and restaurants
- Cannot modify data
- Basic monitoring capabilities

## 🚨 Security Notes

- These are example accounts for development/testing
- Change passwords in production
- Use proper password hashing in production
- Consider implementing proper admin invitation system

## 🛠️ Troubleshooting

If admin accounts don't work:

1. Check Firebase console for admin documents in `admins` collection
2. Verify passwords match in `adminAuth.ts`
3. Check browser console for authentication errors
4. Ensure admin system is properly initialized

## 📝 Next Steps

1. Test all admin accounts
2. Verify permissions work correctly
3. Create your own admin accounts as needed
4. Remove example accounts before production
