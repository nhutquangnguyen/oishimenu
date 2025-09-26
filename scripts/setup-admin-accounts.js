#!/usr/bin/env node

/**
 * Admin Account Setup Script
 * 
 * This script helps you create example admin accounts for testing.
 * Run this script to set up admin accounts in your database.
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc } = require('firebase/firestore');

// Firebase configuration (update with your config)
const firebaseConfig = {
  // Add your Firebase config here
  // You can find this in your Firebase console > Project Settings > General
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Example admin accounts to create
const EXAMPLE_ADMINS = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'super_admin',
    password: 'admin123',
    permissions: [
      { resource: '*', actions: ['*'] } // Super admin has all permissions
    ]
  },
  {
    email: 'manager@example.com', 
    name: 'Manager User',
    role: 'admin',
    password: 'manager123',
    permissions: [
      { resource: 'users', actions: ['read', 'write'] },
      { resource: 'restaurants', actions: ['read'] },
      { resource: 'orders', actions: ['read'] }
    ]
  },
  {
    email: 'moderator@example.com',
    name: 'Moderator User', 
    role: 'moderator',
    password: 'moderator123',
    permissions: [
      { resource: 'users', actions: ['read'] },
      { resource: 'restaurants', actions: ['read'] }
    ]
  }
];

async function createAdminAccount(adminData) {
  try {
    const adminId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const adminRef = doc(db, 'admins', adminId);

    const newAdmin = {
      id: adminId,
      email: adminData.email,
      name: adminData.name,
      role: adminData.role,
      permissions: adminData.permissions,
      createdAt: new Date(),
      isActive: true,
      createdBy: 'system'
    };

    await setDoc(adminRef, {
      ...newAdmin,
      createdAt: newAdmin.createdAt
    });

    console.log(`✅ Created admin: ${adminData.email} (${adminData.role})`);
    console.log(`   ID: ${adminId}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('');
    
    return newAdmin;
  } catch (error) {
    console.error(`❌ Error creating admin ${adminData.email}:`, error);
    throw error;
  }
}

async function updateAdminPasswords() {
  console.log('📝 Updating admin passwords in adminAuth.ts...');
  console.log('');
  console.log('Add these to your ADMIN_PASSWORDS in src/lib/adminAuth.ts:');
  console.log('');
  
  EXAMPLE_ADMINS.forEach(admin => {
    console.log(`  '${admin.email}': '${admin.password}',`);
  });
  
  console.log('');
  console.log('Example updated adminAuth.ts:');
  console.log('```typescript');
  console.log('const ADMIN_PASSWORDS: Record<string, string> = {');
  EXAMPLE_ADMINS.forEach(admin => {
    console.log(`  '${admin.email}': '${admin.password}',`);
  });
  console.log('};');
  console.log('```');
  console.log('');
}

async function main() {
  try {
    console.log('🚀 Setting up example admin accounts...');
    console.log('');
    
    // Create admin accounts
    for (const adminData of EXAMPLE_ADMINS) {
      await createAdminAccount(adminData);
    }
    
    console.log('✅ All admin accounts created successfully!');
    console.log('');
    
    // Show password update instructions
    await updateAdminPasswords();
    
    console.log('📋 Next Steps:');
    console.log('1. Update your Firebase config in this script');
    console.log('2. Run: node scripts/setup-admin-accounts.js');
    console.log('3. Update ADMIN_PASSWORDS in src/lib/adminAuth.ts');
    console.log('4. Test admin login at /admin/login');
    console.log('');
    
    console.log('🔐 Test Admin Accounts:');
    EXAMPLE_ADMINS.forEach(admin => {
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${admin.password}`);
      console.log(`   Role: ${admin.role}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error setting up admin accounts:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createAdminAccount, EXAMPLE_ADMINS };
