# 🔐 Admin Accounts Reference

## Test Admin Accounts

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| `admin@example.com` | `admin123` | Super Admin | All permissions |
| `manager@example.com` | `manager123` | Admin | User management, read restaurants/orders |
| `moderator@example.com` | `moderator123` | Moderator | Read users and restaurants |

## 🚀 Quick Start

1. **Start your app**: `npm run dev`
2. **Go to admin login**: `http://localhost:3000/admin/login`
3. **Use any account above** to test admin functionality

## 🔧 Admin Roles

### Super Admin (`admin@example.com`)
- ✅ Full system access
- ✅ Can manage all users
- ✅ Can view all restaurants and orders
- ✅ Can create/delete other admins
- ✅ Access to all analytics

### Admin (`manager@example.com`)
- ✅ Can manage users (disable/enable)
- ✅ Can view restaurants and orders
- ❌ Cannot create other admins
- ✅ Limited analytics access

### Moderator (`moderator@example.com`)
- ✅ Read-only access to users and restaurants
- ❌ Cannot modify data
- ✅ Basic monitoring capabilities

## 🧪 Testing Checklist

- [ ] Admin login works
- [ ] Dashboard loads correctly
- [ ] User management page accessible
- [ ] Different permission levels work
- [ ] Admin logout works
- [ ] No access to normal user dashboard

## 🚨 Troubleshooting

### Login Issues
1. Check browser console for errors
2. Verify Firebase connection
3. Check if admin documents exist in Firestore
4. Ensure admin system is initialized

### Permission Issues
1. Verify admin role in database
2. Check permission configuration
3. Test with different admin accounts

## 📝 Production Notes

- Change all passwords before production
- Use proper password hashing
- Remove example accounts
- Implement proper admin invitation system
- Add two-factor authentication

## 🔒 Security Best Practices

1. **Strong Passwords**: Use complex passwords
2. **Regular Updates**: Update admin credentials regularly
3. **Access Logging**: Monitor admin access
4. **Permission Audits**: Regular permission reviews
5. **Backup Access**: Always have multiple admin accounts
