// Debug script to check user status in Firestore
// Run with: node debug-user.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs, query, where } = require('firebase/firestore');

const firebaseConfig = {
  // You'll need to add your Firebase config here
  // Or we can run this from the browser console instead
};

// For now, let's create a browser-based debug function
console.log(`
🔍 DEBUG USER STATUS

Open the browser console and run this code to check user status:

// Check specific user by email
const checkUserStatus = async (email) => {
  const { collection, query, where, getDocs } = await import('firebase/firestore');
  const { db } = await import('./src/lib/firebase.js');

  console.log('🔍 Searching for user:', email);

  const usersQuery = query(collection(db, 'users'), where('email', '==', email));
  const userSnapshot = await getDocs(usersQuery);

  if (userSnapshot.empty) {
    console.log('❌ No user found with email:', email);
    return;
  }

  userSnapshot.forEach((doc) => {
    console.log('📋 User document ID:', doc.id);
    console.log('📋 User data:', JSON.stringify(doc.data(), null, 2));
  });
};

// Run it
checkUserStatus('dinhbarista@gmail.com');
`);