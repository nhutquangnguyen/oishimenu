const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, addDoc, writeBatch, doc } = require('firebase/firestore');

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

async function generateDemoData() {
  try {
    console.log('Starting demo data generation...');
    
    // Sign in as the demo user
    const userCredential = await signInWithEmailAndPassword(auth, 'nguyenquang.btr@gmail.com', 'password123');
    const user = userCredential.user;
    console.log('Signed in as:', user.email);
    
    // Generate 50 orders
    const batch = writeBatch(db);
    const menuItems = [
      { name: 'Bruschetta', price: 8.99, category: 'Appetizers' },
      { name: 'Caesar Salad', price: 12.99, category: 'Appetizers' },
      { name: 'Grilled Salmon', price: 24.99, category: 'Main Courses' },
      { name: 'Chicken Parmesan', price: 18.99, category: 'Main Courses' },
      { name: 'Beef Tenderloin', price: 32.99, category: 'Main Courses' },
      { name: 'Coca-Cola', price: 2.99, category: 'Beverages' },
      { name: 'Fresh Orange Juice', price: 4.99, category: 'Beverages' },
    ];
    
    const customerNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi'];
    const statuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    const paymentMethods = ['cash', 'card', 'digital'];
    
    for (let i = 0; i < 50; i++) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));
      createdAt.setHours(Math.floor(Math.random() * 12) + 10, Math.floor(Math.random() * 60), 0, 0);
      
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let total = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = randomItem.price * quantity;
        total += itemTotal;
        
        orderItems.push({
          id: `item-${i}-${j}`,
          name: randomItem.name,
          price: randomItem.price,
          quantity,
          category: randomItem.category
        });
      }
      
      const tip = Math.round(total * (Math.random() * 0.2 + 0.1) * 100) / 100;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const isPaid = Math.random() > 0.1;
      
      const orderData = {
        tableId: `table-${Math.floor(Math.random() * 20) + 1}`,
        customerName: Math.random() > 0.3 ? customerNames[Math.floor(Math.random() * customerNames.length)] : undefined,
        items: orderItems,
        status,
        total: Math.round(total * 100) / 100,
        tip: Math.round(tip * 100) / 100,
        createdAt,
        updatedAt: new Date(createdAt.getTime() + (Math.random() * 2 * 60 * 60 * 1000)),
        paymentMethod,
        isPaid,
        userId: user.uid
      };
      
      const orderRef = doc(collection(db, 'orders'));
      batch.set(orderRef, orderData);
    }
    
    await batch.commit();
    console.log('Successfully generated 50 demo orders for user:', user.email);
    
  } catch (error) {
    console.error('Error generating demo data:', error);
  }
}

generateDemoData();
