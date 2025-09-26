# 🛠️ Development Tools

This folder contains utility scripts and development tools for the OishiMenu project.

## 📋 **Development Tools**

### **User Management**
- **[debug-user.js](./debug-user.js)** - Debug user authentication and data
- **[delete-user-data.js](./delete-user-data.js)** - Delete user data and accounts

### **Data Generation**
- **[generate-demo-data.js](./generate-demo-data.js)** - Generate demo data for testing

## 🎯 **Quick Reference**

### **For User Debugging**
```bash
# Debug user authentication
node tools/debug-user.js

# Delete user data
node tools/delete-user-data.js
```

### **For Demo Data**
```bash
# Generate demo data
node tools/generate-demo-data.js
```

## 🔧 **Tool Usage**

### **Debug User Script**
- **Purpose**: Debug user authentication issues
- **Usage**: `node tools/debug-user.js`
- **Output**: User authentication status and data

### **Delete User Data Script**
- **Purpose**: Clean up user data and accounts
- **Usage**: `node tools/delete-user-data.js`
- **Warning**: This permanently deletes user data

### **Generate Demo Data Script**
- **Purpose**: Create sample data for testing
- **Usage**: `node tools/generate-demo-data.js`
- **Output**: Sample restaurants, menus, and orders

## ⚠️ **Important Notes**

### **Safety**
- **Backup data** before running delete scripts
- **Test in development** environment first
- **Review scripts** before execution

### **Environment**
- **Set up environment variables** before running
- **Configure Firebase** connection
- **Check permissions** for database access

## 📞 **Support**

For tool usage:
1. Check the script documentation
2. Review the usage instructions
3. Test in development environment
4. Contact support for issues
