import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface FirestoreOrder {
  id?: string;
  tableId: string;
  customerName?: string | null;
  items: FirestoreOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  tip: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  notes?: string | null;
  paymentMethod: 'cash' | 'card' | 'digital';
  isPaid: boolean;
  userId: string;
  restaurantId: string;
}

export interface FirestoreOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string | null;
  category: string;
}

export interface FirestoreAnalytics {
  userId: string;
  revenue: {
    current: number;
    change: number;
  };
  orders: {
    current: number;
    change: number;
  };
  averageOrder: {
    current: number;
    change: number;
  };
  completionRate: {
    current: number;
    change: number;
  };
  topItems: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    tableId: string;
    customerName?: string | null;
    total: number;
    status: string;
    createdAt: Timestamp;
  }>;
  insights: Array<{
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
  }>;
  lastUpdated: Timestamp;
}

// Collections
const ORDERS_COLLECTION = 'orders';
const ANALYTICS_COLLECTION = 'analytics';

// Order Functions
export const createOrder = async (order: Omit<FirestoreOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = Timestamp.now();
  const orderData = {
    ...order,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
  return docRef.id;
};

export const getOrdersByUser = async (userId: string): Promise<FirestoreOrder[]> => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.fromDate(new Date(data.createdAt)),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.fromDate(new Date(data.updatedAt))
    } as FirestoreOrder;
  });
};

export const getOrdersByRestaurant = async (restaurantId: string): Promise<FirestoreOrder[]> => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.fromDate(new Date(data.createdAt)),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.fromDate(new Date(data.updatedAt))
    } as FirestoreOrder;
  });
};

export const getActiveOrdersByUser = async (userId: string): Promise<FirestoreOrder[]> => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('userId', '==', userId),
    where('status', 'in', ['pending', 'preparing', 'ready']),
    orderBy('createdAt', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.fromDate(new Date(data.createdAt)),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.fromDate(new Date(data.updatedAt))
    } as FirestoreOrder;
  });
};

export const getActiveOrdersByRestaurant = async (restaurantId: string): Promise<FirestoreOrder[]> => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('restaurantId', '==', restaurantId),
    where('status', 'in', ['pending', 'preparing', 'ready']),
    orderBy('createdAt', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.fromDate(new Date(data.createdAt)),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.fromDate(new Date(data.updatedAt))
    } as FirestoreOrder;
  });
};

export const updateOrderStatus = async (orderId: string, status: FirestoreOrder['status']) => {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: Timestamp.now()
  });
};

export const getOrdersByTable = async (userId: string, tableId: string): Promise<FirestoreOrder[]> => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('userId', '==', userId),
    where('tableId', '==', tableId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.fromDate(new Date(data.createdAt)),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.fromDate(new Date(data.updatedAt))
    } as FirestoreOrder;
  });
};

// Analytics Functions
export const calculateAnalytics = async (restaurantId: string): Promise<FirestoreAnalytics> => {
  const orders = await getOrdersByRestaurant(restaurantId);
  
  // If no orders, return empty analytics
  if (orders.length === 0) {
    return {
      userId: '', // This will be set by the calling function
      revenue: { current: 0, change: 0 },
      orders: { current: 0, change: 0 },
      averageOrder: { current: 0, change: 0 },
      completionRate: { current: 0, change: 0 },
      topItems: [],
      recentOrders: [],
      insights: [],
      lastUpdated: Timestamp.now()
    };
  }
  
  const now = new Date();
  const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  const last14Days = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
  
  // Filter orders by time periods
  const ordersLast7Days = orders.filter(order => 
    order.createdAt.toDate() >= last7Days
  );
  const ordersLast14Days = orders.filter(order => {
    const orderDate = order.createdAt.toDate();
    return orderDate >= last14Days && orderDate < last7Days;
  });
  
  // Calculate current metrics
  const currentRevenue = ordersLast7Days.reduce((sum, order) => 
    order.status !== 'cancelled' ? sum + order.total + order.tip : sum, 0
  );
  const currentOrders = ordersLast7Days.length;
  const currentAvgOrder = currentOrders > 0 ? currentRevenue / currentOrders : 0;
  const currentCompleted = ordersLast7Days.filter(order => order.status === 'delivered').length;
  const currentCompletionRate = currentOrders > 0 ? (currentCompleted / currentOrders) * 100 : 0;
  
  // Calculate previous metrics
  const prevRevenue = ordersLast14Days.reduce((sum, order) => 
    order.status !== 'cancelled' ? sum + order.total + order.tip : sum, 0
  );
  const prevOrders = ordersLast14Days.length;
  const prevAvgOrder = prevOrders > 0 ? prevRevenue / prevOrders : 0;
  const prevCompleted = ordersLast14Days.filter(order => order.status === 'delivered').length;
  const prevCompletionRate = prevOrders > 0 ? (prevCompleted / prevOrders) * 100 : 0;
  
  // Calculate changes
  const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const ordersChange = prevOrders > 0 ? ((currentOrders - prevOrders) / prevOrders) * 100 : 0;
  const avgOrderChange = prevAvgOrder > 0 ? ((currentAvgOrder - prevAvgOrder) / prevAvgOrder) * 100 : 0;
  const completionChange = prevCompletionRate > 0 ? ((currentCompletionRate - prevCompletionRate) / prevCompletionRate) * 100 : 0;
  
  // Calculate top items
  const itemCounts: { [key: string]: { count: number; revenue: number } } = {};
  ordersLast7Days.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items.forEach(item => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = { count: 0, revenue: 0 };
        }
        itemCounts[item.name].count += item.quantity;
        itemCounts[item.name].revenue += item.price * item.quantity;
      });
    }
  });
  
  const topItems = Object.entries(itemCounts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Recent orders
  const recentOrders = ordersLast7Days
    .slice(0, 10)
    .map(order => ({
      id: order.id!,
      tableId: order.tableId,
      customerName: order.customerName,
      total: order.total + order.tip,
      status: order.status,
      createdAt: order.createdAt
    }));
  
  // Generate insights
  const insights = [];
  if (currentCompletionRate > 90) {
    insights.push({
      title: 'Excellent Completion Rate',
      description: `Your completion rate of ${currentCompletionRate.toFixed(1)}% is outstanding!`,
      type: 'positive' as const
    });
  }
  if (currentAvgOrder > prevAvgOrder) {
    insights.push({
      title: 'Average Order Value Up',
      description: `Your average order value increased by ${avgOrderChange.toFixed(1)}%`,
      type: 'positive' as const
    });
  }
  if (currentOrders < 10) {
    insights.push({
      title: 'Low Order Volume',
      description: 'Consider promoting your restaurant to increase orders',
      type: 'negative' as const
    });
  }
  
  const analytics: FirestoreAnalytics = {
    userId: '', // This will be set by the calling function
    revenue: {
      current: currentRevenue,
      change: revenueChange
    },
    orders: {
      current: currentOrders,
      change: ordersChange
    },
    averageOrder: {
      current: currentAvgOrder,
      change: avgOrderChange
    },
    completionRate: {
      current: currentCompletionRate,
      change: completionChange
    },
    topItems,
    recentOrders,
    insights,
    lastUpdated: Timestamp.now()
  };
  
  return analytics;
};

export const saveAnalytics = async (analytics: FirestoreAnalytics) => {
  const analyticsRef = doc(db, ANALYTICS_COLLECTION, analytics.userId);
  await setDoc(analyticsRef, analytics);
};

export const getAnalytics = async (restaurantId: string): Promise<FirestoreAnalytics | null> => {
  const analyticsRef = doc(db, ANALYTICS_COLLECTION, restaurantId);
  const analyticsDoc = await getDoc(analyticsRef);

  if (analyticsDoc.exists()) {
    return analyticsDoc.data() as FirestoreAnalytics;
  }

  return null;
};

// Update analytics to use restaurant ID instead of user ID
export const saveAnalyticsByRestaurant = async (restaurantId: string, analytics: Omit<FirestoreAnalytics, 'userId'>) => {
  const analyticsData: FirestoreAnalytics = {
    ...analytics,
    userId: restaurantId // For backward compatibility, but this should be restaurantId
  };
  const analyticsRef = doc(db, ANALYTICS_COLLECTION, restaurantId);
  await setDoc(analyticsRef, analyticsData);
};

// Batch operations for generating demo data
// Migrate menu data from user ID to restaurant ID
export const migrateMenuData = async (userId: string, restaurantId: string) => {
  try {
    const userMenuDoc = await getDoc(doc(db, 'menus', userId));
    if (userMenuDoc.exists()) {
      const userMenuData = userMenuDoc.data();
      await setDoc(doc(db, 'menus', restaurantId), userMenuData);
      console.log('✅ Menu data migrated from user to restaurant');
      return userMenuData.categories || [];
    }
    return [];
  } catch (error) {
    console.error('Error migrating menu data:', error);
    return [];
  }
};

// Get menu items for POS
export const getMenuItems = async (restaurantId: string, userId?: string) => {
  try {
    let menuDoc = await getDoc(doc(db, 'menus', restaurantId));
    
    // If no menu found for restaurant and we have user ID, try to migrate
    if (!menuDoc.exists() && userId) {
      console.log('No menu found for restaurant, attempting migration from user menu...');
      return await migrateMenuData(userId, restaurantId);
    }
    
    if (menuDoc.exists()) {
      const menuData = menuDoc.data();
      return menuData.categories || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting menu items:', error);
    return [];
  }
};

// Get tables for POS
export const getTables = async (restaurantId: string) => {
  try {
    const tablesDoc = await getDoc(doc(db, 'tables', restaurantId));

    if (tablesDoc.exists()) {
      const tablesData = tablesDoc.data();
      console.log('Raw tables data from Firestore:', tablesData);

      // Transform the data structure from Tables Management format to POS format
      const allTables: any[] = [];
      if (tablesData.areas) {
        tablesData.areas.forEach((area: any) => {
          if (area.tables) {
            area.tables.forEach((table: any) => {
              allTables.push({
                id: table.id,
                number: table.name, // Tables Management stores table number as "name"
                capacity: table.capacity,
                status: table.status,
                area: area.name
              });
            });
          }
        });
      }

      console.log('Transformed tables for POS:', allTables);
      return allTables;
    }

    console.log('No tables document found for restaurant:', restaurantId);
    return [];
  } catch (error) {
    console.error('Error getting tables:', error);
    return [];
  }
};

export const generateDemoOrders = async (restaurantId: string, userId: string, userEmail: string) => {
  // Generate demo data for any authenticated user
  if (!userEmail) {
    return;
  }
  
  // Check if orders already exist to avoid regenerating
  const existingOrders = await getOrdersByRestaurant(restaurantId);
  if (existingOrders.length > 0) {
    console.log('Demo orders already exist, skipping generation');
    return;
  }
  
  const batch = writeBatch(db);
  const menuItems = [
    // Appetizers
    { name: 'Bruschetta', price: 8.99, category: 'Appetizers' },
    { name: 'Caesar Salad', price: 12.99, category: 'Appetizers' },
    { name: 'Garlic Bread', price: 6.99, category: 'Appetizers' },
    { name: 'Mozzarella Sticks', price: 9.99, category: 'Appetizers' },
    { name: 'Wings (10pc)', price: 14.99, category: 'Appetizers' },
    
    // Main Courses
    { name: 'Grilled Salmon', price: 24.99, category: 'Main Courses' },
    { name: 'Chicken Parmesan', price: 18.99, category: 'Main Courses' },
    { name: 'Beef Tenderloin', price: 32.99, category: 'Main Courses' },
    { name: 'Pasta Carbonara', price: 16.99, category: 'Main Courses' },
    { name: 'Ribeye Steak', price: 28.99, category: 'Main Courses' },
    { name: 'Fish & Chips', price: 15.99, category: 'Main Courses' },
    { name: 'Chicken Alfredo', price: 17.99, category: 'Main Courses' },
    { name: 'Margherita Pizza', price: 14.99, category: 'Main Courses' },
    
    // Beverages
    { name: 'Coca-Cola', price: 2.99, category: 'Beverages' },
    { name: 'Fresh Orange Juice', price: 4.99, category: 'Beverages' },
    { name: 'Coffee', price: 3.99, category: 'Beverages' },
    { name: 'Tea', price: 2.99, category: 'Beverages' },
    { name: 'Beer', price: 5.99, category: 'Beverages' },
    { name: 'Wine', price: 8.99, category: 'Beverages' },
    
    // Desserts
    { name: 'Chocolate Cake', price: 7.99, category: 'Desserts' },
    { name: 'Tiramisu', price: 6.99, category: 'Desserts' },
    { name: 'Ice Cream', price: 4.99, category: 'Desserts' },
    { name: 'Cheesecake', price: 8.99, category: 'Desserts' }
  ];
  
  const customerNames = [
    'John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Brown', 'David Wilson',
    'Lisa Anderson', 'Chris Taylor', 'Amy Martinez', 'James Thompson', 'Maria Garcia',
    'Robert Lee', 'Jennifer White', 'Michael Clark', 'Jessica Hall', 'William Young'
  ];
  
  const statuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
  const paymentMethods = ['cash', 'card', 'digital'];
  const specialInstructions = [
    'No onions', 'Extra spicy', 'Well done', 'Medium rare', 'No salt',
    'Gluten free', 'Vegetarian', 'Vegan', 'Extra sauce', 'On the side'
  ];
  
  const notes = [
    'Birthday celebration', 'Anniversary dinner', 'Business meeting', 'Date night',
    'Family dinner', 'Quick lunch', 'Takeout order', 'Dine-in', 'Large group',
    'Dietary restrictions', 'Allergy alert', 'Special occasion'
  ];
  
  // Generate 50 orders (reduced for faster loading)
  for (let i = 0; i < 50; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - randomDaysAgo);
    createdAt.setHours(Math.floor(Math.random() * 12) + 10, Math.floor(Math.random() * 60), 0, 0);
    
    // Generate 1-5 items per order
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const orderItems: FirestoreOrderItem[] = [];
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
        specialInstructions: Math.random() > 0.7 ? specialInstructions[Math.floor(Math.random() * specialInstructions.length)] : null,
        category: randomItem.category
      });
    }
    
    const tip = Math.round(total * (Math.random() * 0.2 + 0.1) * 100) / 100;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const isPaid = Math.random() > 0.1;
    
    const updatedAt = new Date(createdAt.getTime() + (Math.random() * 2 * 60 * 60 * 1000));
    
    const orderData: Omit<FirestoreOrder, 'id'> = {
      tableId: `table-${Math.floor(Math.random() * 20) + 1}`,
      customerName: Math.random() > 0.3 ? customerNames[Math.floor(Math.random() * customerNames.length)] : null,
      items: orderItems,
      status: status as FirestoreOrder['status'],
      total: Math.round(total * 100) / 100,
      tip: Math.round(tip * 100) / 100,
      createdAt: Timestamp.fromDate(createdAt),
      updatedAt: Timestamp.fromDate(updatedAt),
      notes: Math.random() > 0.6 ? notes[Math.floor(Math.random() * notes.length)] : null,
      paymentMethod: paymentMethod as FirestoreOrder['paymentMethod'],
      isPaid,
      userId,
      restaurantId
    };
    
    const orderRef = doc(collection(db, ORDERS_COLLECTION));
    batch.set(orderRef, orderData);
  }
  
  await batch.commit();
  console.log('Generated 50 demo orders for user:', userId);
};
