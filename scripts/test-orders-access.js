#!/usr/bin/env node

/**
 * Test Orders Access Script
 * 
 * This script tests if the admin system can access the orders collection.
 * Run this to verify the orders collection is accessible.
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function testOrdersAccess() {
  try {
    console.log('🛒 Testing Orders Collection Access...');
    console.log('');

    // Test orders collection access
    console.log('1. Testing orders collection...');
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    
    console.log(`✅ Orders collection accessible: ${ordersSnapshot.size} documents`);
    
    if (ordersSnapshot.size > 0) {
      console.log('📊 Sample order data:');
      ordersSnapshot.forEach((doc, index) => {
        if (index < 3) { // Show first 3 orders
          const data = doc.data();
          console.log(`   Order ${index + 1}:`, {
            id: doc.id,
            total: data.total || 0,
            userId: data.userId || 'N/A',
            restaurantId: data.restaurantId || 'N/A'
          });
        }
      });
    } else {
      console.log('ℹ️ No orders found in collection');
    }

    console.log('');
    console.log('✅ Orders collection access test completed successfully!');
    console.log('');
    console.log('🎉 The admin system should now be able to access orders data.');
    console.log('   Try refreshing your admin dashboard to see if the error is resolved.');

  } catch (error) {
    console.error('❌ Error testing orders access:', error);
    console.error('❌ Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    console.log('');
    console.log('🚨 Troubleshooting Steps:');
    console.log('1. Check if Firebase config is correct');
    console.log('2. Verify Firestore rules are deployed');
    console.log('3. Check if orders collection exists');
    console.log('4. Ensure Firebase project is properly configured');
  }
}

// Run the test
if (require.main === module) {
  console.log('🚀 Starting Orders Access Test...');
  console.log('');
  console.log('⚠️  Make sure to update Firebase config in this script first!');
  console.log('');
  
  testOrdersAccess();
}

module.exports = { testOrdersAccess };
