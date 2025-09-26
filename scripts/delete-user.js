#!/usr/bin/env node

/**
 * Server-side script to delete users from Firebase Authentication
 * This requires Firebase Admin SDK and can only be run on the server
 * 
 * Usage: node scripts/delete-user.js <email>
 * Example: node scripts/delete-user.js dinhbarista@gmail.com
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json'); // You need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add your project ID here
  projectId: 'your-project-id'
});

async function deleteUserByEmail(email) {
  try {
    console.log(`Looking for user with email: ${email}`);
    
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`Found user: ${userRecord.uid} (${userRecord.email})`);
    
    // Delete the user
    await admin.auth().deleteUser(userRecord.uid);
    console.log(`✅ User ${email} has been permanently deleted from Firebase Authentication`);
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`❌ User with email ${email} not found in Firebase Authentication`);
    } else {
      console.error('❌ Error deleting user:', error.message);
    }
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/delete-user.js <email>');
  console.log('Example: node scripts/delete-user.js dinhbarista@gmail.com');
  process.exit(1);
}

deleteUserByEmail(email)
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
