# Admin Access Information

## Fixed Admin Permissions Issue

The "Missing or insufficient permissions" error has been resolved by adding `dinhbarista.com` as an admin user.

## Admin Login Credentials

You can now access the admin panel using:

**Email:** `dinhbarista.com`  
**Password:** `admin123`

## What Was Fixed

1. **Added `dinhbarista.com` to admin passwords** in `src/lib/adminAuth.ts`
2. **Added `dinhbarista.com` to default admins** in `src/lib/adminManagement.ts`
3. **Set as super_admin** with full permissions

## How to Test

1. Go to `/admin/login`
2. Enter email: `dinhbarista.com`
3. Enter password: `admin123`
4. You should now have full admin access

## Admin Features Available

- View all users and their data
- Disable/enable user accounts
- View restaurant statistics
- Access user management tools
- Generate demo data

The admin system is completely separate from the regular user authentication, so you can access it even while logged in as a regular user.
