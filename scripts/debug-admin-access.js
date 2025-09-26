#!/usr/bin/env node

/**
 * Debug Admin Access Script
 * 
 * This script helps debug admin access issues.
 * Run this to check if admin system can access Firestore data.
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

// Firebase configuration (update with your config)
const firebaseConfig = {
  // Add your Firebase config here
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

async function testAdminAccess() {
  try {
    console.log('🔍 Testing Admin Access to Firestore...');
    console.log('');

    // Test 1: Check if we can access users collection
    console.log('1. Testing users collection access...');
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      console.log(`✅ Users collection accessible: ${usersSnapshot.size} documents`);
    } catch (error) {
      console.log(`❌ Users collection access failed: ${error.message}`);
    }

    // Test 2: Check if we can access restaurants collection
    console.log('2. Testing restaurants collection access...');
    try {
      const restaurantsRef = collection(db, 'restaurants');
      const restaurantsSnapshot = await getDocs(restaurantsRef);
      console.log(`✅ Restaurants collection accessible: ${restaurantsSnapshot.size} documents`);
    } catch (error) {
      console.log(`❌ Restaurants collection access failed: ${error.message}`);
    }

    // Test 3: Check if we can access orders collection
    console.log('3. Testing orders collection access...');
    try {
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      console.log(`✅ Orders collection accessible: ${ordersSnapshot.size} documents`);
    } catch (error) {
      console.log(`❌ Orders collection access failed: ${error.message}`);
    }

    // Test 4: Check if we can access admins collection
    console.log('4. Testing admins collection access...');
    try {
      const adminsRef = collection(db, 'admins');
      const adminsSnapshot = await getDocs(adminsRef);
      console.log(`✅ Admins collection accessible: ${adminsSnapshot.size} documents`);
    } catch (error) {
      console.log(`❌ Admins collection access failed: ${error.message}`);
    }

    console.log('');
    console.log('📋 Troubleshooting Steps:');
    console.log('');
    console.log('If you see permission errors:');
    console.log('1. Check your Firestore rules');
    console.log('2. Verify admin emails are in the rules');
    console.log('3. Make sure Firebase config is correct');
    console.log('4. Check if admin system is properly initialized');
    console.log('');

  } catch (error) {
    console.error('❌ Error testing admin access:', error);
  }
}

// Run the test
if (require.main === module) {
  console.log('🚀 Starting Admin Access Debug...');
  console.log('');
  console.log('⚠️  Make sure to update Firebase config in this script first!');
  console.log('');
  
  testAdminAccess();
}

module.exports = { testAdminAccess };
