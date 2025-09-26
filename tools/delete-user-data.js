// Script to delete user data for dinhbarista@gmail.com
// Run this with: node delete-user-data.js

const { initializeApp } = require('firebase/app');
const { getAuth, deleteUser } = require('firebase/auth');
const { getFirestore, collection, query, where, getDocs, deleteDoc, doc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function deleteUserData(email) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`);
    
    // Note: You'll need to authenticate as an admin to delete users
    // This script shows you what data would be deleted
    
    // 1. Find restaurants owned by this user
    console.log('\n📋 Finding restaurants...');
    const restaurantsRef = collection(db, 'restaurants');
    const restaurantsQuery = query(restaurantsRef, where('ownerId', '==', 'USER_UID_HERE')); // Replace with actual UID
    const restaurantsSnapshot = await getDocs(restaurantsQuery);
    
    console.log(`Found ${restaurantsSnapshot.size} restaurants`);
    restaurantsSnapshot.forEach((doc) => {
      console.log(`- Restaurant: ${doc.data().name} (ID: ${doc.id})`);
    });
    
    // 2. Find menus
    console.log('\n🍽️ Finding menus...');
    const menusRef = collection(db, 'menus');
    const menusQuery = query(menusRef, where('restaurant.ownerId', '==', 'USER_UID_HERE')); // Replace with actual UID
    const menusSnapshot = await getDocs(menusQuery);
    
    console.log(`Found ${menusSnapshot.size} menus`);
    
    // 3. Find tables
    console.log('\n🪑 Finding tables...');
    const tablesRef = collection(db, 'tables');
    const tablesQuery = query(tablesRef, where('ownerId', '==', 'USER_UID_HERE')); // Replace with actual UID
    const tablesSnapshot = await getDocs(tablesQuery);
    
    console.log(`Found ${tablesSnapshot.size} table configurations`);
    
    // 4. Find orders
    console.log('\n📦 Finding orders...');
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, where('userId', '==', 'USER_UID_HERE')); // Replace with actual UID
    const ordersSnapshot = await getDocs(ordersQuery);
    
    console.log(`Found ${ordersSnapshot.size} orders`);
    
    console.log('\n⚠️  To actually delete this data, you need to:');
    console.log('1. Get the user UID from Firebase Console');
    console.log('2. Replace USER_UID_HERE with the actual UID');
    console.log('3. Uncomment the deletion code below');
    console.log('4. Run the script again');
    
    // Uncomment these lines to actually delete the data:
    /*
    console.log('\n🗑️  Deleting data...');
    
    // Delete restaurants
    for (const restaurantDoc of restaurantsSnapshot.docs) {
      await deleteDoc(doc(db, 'restaurants', restaurantDoc.id));
      console.log(`Deleted restaurant: ${restaurantDoc.data().name}`);
    }
    
    // Delete menus
    for (const menuDoc of menusSnapshot.docs) {
      await deleteDoc(doc(db, 'menus', menuDoc.id));
      console.log(`Deleted menu: ${menuDoc.id}`);
    }
    
    // Delete tables
    for (const tableDoc of tablesSnapshot.docs) {
      await deleteDoc(doc(db, 'tables', tableDoc.id));
      console.log(`Deleted table config: ${tableDoc.id}`);
    }
    
    // Delete orders
    for (const orderDoc of ordersSnapshot.docs) {
      await deleteDoc(doc(db, 'orders', orderDoc.id));
      console.log(`Deleted order: ${orderDoc.id}`);
    }
    
    console.log('\n✅ User data deleted successfully!');
    */
    
  } catch (error) {
    console.error('❌ Error deleting user data:', error);
  }
}

// Run the script
deleteUserData('dinhbarista@gmail.com');
