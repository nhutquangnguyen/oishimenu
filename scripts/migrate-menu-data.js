const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, collection, query, getDocs, where } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateMenuData() {
  try {
    console.log('Starting menu data migration...');
    
    // Get all restaurants
    const restaurantsRef = collection(db, 'restaurants');
    const restaurantsSnapshot = await getDocs(restaurantsRef);
    
    console.log(`Found ${restaurantsSnapshot.docs.length} restaurants`);
    
    for (const restaurantDoc of restaurantsSnapshot.docs) {
      const restaurantData = restaurantDoc.data();
      const restaurantId = restaurantDoc.id;
      const ownerId = restaurantData.ownerId;
      
      console.log(`\nProcessing restaurant: ${restaurantData.name} (ID: ${restaurantId})`);
      console.log(`Owner: ${ownerId}`);
      
      // Check if menu exists for user ID
      const userMenuDoc = await getDoc(doc(db, 'menus', ownerId));
      if (userMenuDoc.exists()) {
        console.log(`Found menu data for user ${ownerId}`);
        
        // Check if menu already exists for restaurant
        const restaurantMenuDoc = await getDoc(doc(db, 'menus', restaurantId));
        if (restaurantMenuDoc.exists()) {
          console.log(`Menu already exists for restaurant ${restaurantId}, skipping...`);
          continue;
        }
        
        // Copy menu data to restaurant ID
        const menuData = userMenuDoc.data();
        await setDoc(doc(db, 'menus', restaurantId), menuData);
        console.log(`✅ Migrated menu data to restaurant ${restaurantId}`);
      } else {
        console.log(`No menu data found for user ${ownerId}`);
      }
    }
    
    console.log('\n🎉 Menu data migration completed!');
    
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// Run migration
migrateMenuData();
