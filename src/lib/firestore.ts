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
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Ingredient,
  Recipe,
  InventoryTransaction,
  Purchase,
  Wallet,
  InventoryAlert,
  StockLevel
} from '@/components/inventory/types';

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
  isCompleted?: boolean; // Track if the item is completed/prepared
  completedQuantity?: number; // Track how many of this item are completed (0 to quantity)
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
const INGREDIENTS_COLLECTION = 'ingredients';
const RECIPES_COLLECTION = 'recipes';
const INVENTORY_TRANSACTIONS_COLLECTION = 'inventory_transactions';
const PURCHASES_COLLECTION = 'purchases';
const WALLETS_COLLECTION = 'wallets';
const INVENTORY_ALERTS_COLLECTION = 'inventory_alerts';

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

// Update individual item completion status
export const updateOrderItemCompletion = async (orderId: string, itemId: string, isCompleted: boolean) => {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const orderDoc = await getDoc(orderRef);

  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }

  const orderData = orderDoc.data() as FirestoreOrder;
  const updatedItems = orderData.items.map(item => {
    if (item.id === itemId) {
      const completedQuantity = isCompleted ? item.quantity : 0;
      return { ...item, isCompleted, completedQuantity };
    }
    return item;
  });

  await updateDoc(orderRef, {
    items: updatedItems,
    updatedAt: Timestamp.now()
  });
};

// Update completed quantity for partial completion
export const updateOrderItemCompletedQuantity = async (orderId: string, itemId: string, completedQuantity: number) => {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const orderDoc = await getDoc(orderRef);

  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }

  const orderData = orderDoc.data() as FirestoreOrder;
  const updatedItems = orderData.items.map(item => {
    if (item.id === itemId) {
      const clampedQuantity = Math.max(0, Math.min(completedQuantity, item.quantity));
      const isCompleted = clampedQuantity === item.quantity;
      return { ...item, completedQuantity: clampedQuantity, isCompleted };
    }
    return item;
  });

  await updateDoc(orderRef, {
    items: updatedItems,
    updatedAt: Timestamp.now()
  });
};

// Add item to existing order
export const addItemToOrder = async (orderId: string, newItem: FirestoreOrderItem) => {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const orderDoc = await getDoc(orderRef);

  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }

  const orderData = orderDoc.data() as FirestoreOrder;
  const updatedItems = [...orderData.items, { ...newItem, isCompleted: false }];
  const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  await updateDoc(orderRef, {
    items: updatedItems,
    total: newTotal,
    updatedAt: Timestamp.now()
  });
};

// Remove item from existing order
export const removeItemFromOrder = async (orderId: string, itemId: string) => {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const orderDoc = await getDoc(orderRef);

  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }

  const orderData = orderDoc.data() as FirestoreOrder;
  const updatedItems = orderData.items.filter(item => item.id !== itemId);
  const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  await updateDoc(orderRef, {
    items: updatedItems,
    total: newTotal,
    updatedAt: Timestamp.now()
  });
};

// Update item quantity in existing order
export const updateOrderItemQuantity = async (orderId: string, itemId: string, quantity: number) => {
  if (quantity <= 0) {
    await removeItemFromOrder(orderId, itemId);
    return;
  }

  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const orderDoc = await getDoc(orderRef);

  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }

  const orderData = orderDoc.data() as FirestoreOrder;
  const updatedItems = orderData.items.map(item =>
    item.id === itemId ? { ...item, quantity } : item
  );
  const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  await updateDoc(orderRef, {
    items: updatedItems,
    total: newTotal,
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

// ============= INVENTORY MANAGEMENT FUNCTIONS =============

// Ingredient Functions
export const createIngredient = async (ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date();
  const ingredientData = {
    ...ingredient,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };

  const docRef = await addDoc(collection(db, INGREDIENTS_COLLECTION), ingredientData);
  return docRef.id;
};

export const getIngredientsByRestaurant = async (restaurantId: string): Promise<Ingredient[]> => {
  const q = query(
    collection(db, INGREDIENTS_COLLECTION),
    where('restaurantId', '==', restaurantId),
    where('isActive', '==', true),
    orderBy('name')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    expiryDate: doc.data().expiryDate ? doc.data().expiryDate.toDate() : undefined,
  })) as Ingredient[];
};

export const updateIngredientStock = async (ingredientId: string, newStock: number) => {
  const ingredientRef = doc(db, INGREDIENTS_COLLECTION, ingredientId);
  await updateDoc(ingredientRef, {
    currentStock: newStock,
    updatedAt: Timestamp.now(),
  });
};

export const updateIngredient = async (ingredientId: string, updates: Partial<Ingredient>) => {
  const ingredientRef = doc(db, INGREDIENTS_COLLECTION, ingredientId);
  await updateDoc(ingredientRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteIngredient = async (ingredientId: string) => {
  const ingredientRef = doc(db, INGREDIENTS_COLLECTION, ingredientId);
  await updateDoc(ingredientRef, {
    isActive: false,
    updatedAt: Timestamp.now(),
  });
};

// Recipe Functions
export const createRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date();
  const recipeData = {
    ...recipe,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };

  const docRef = await addDoc(collection(db, RECIPES_COLLECTION), recipeData);
  return docRef.id;
};

export const getRecipesByRestaurant = async (restaurantId: string): Promise<Recipe[]> => {
  const q = query(
    collection(db, RECIPES_COLLECTION),
    where('restaurantId', '==', restaurantId),
    orderBy('menuItemName')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Recipe[];
};

export const getRecipeById = async (recipeId: string): Promise<Recipe | null> => {
  try {
    const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
    const recipeDoc = await getDoc(recipeRef);

    if (!recipeDoc.exists()) {
      return null;
    }

    return {
      id: recipeDoc.id,
      ...recipeDoc.data(),
      createdAt: recipeDoc.data()?.createdAt.toDate(),
      updatedAt: recipeDoc.data()?.updatedAt.toDate(),
    } as Recipe;
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    return null;
  }
};

export const getRecipeByMenuItem = async (menuItemId: string): Promise<Recipe | null> => {
  const q = query(
    collection(db, RECIPES_COLLECTION),
    where('menuItemId', '==', menuItemId),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;

  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  } as Recipe;
};

export const updateRecipe = async (recipeId: string, updates: Partial<Recipe>) => {
  const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
  await updateDoc(recipeRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// Inventory Transaction Functions
export const createInventoryTransaction = async (
  transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>
) => {
  const transactionData = {
    ...transaction,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, INVENTORY_TRANSACTIONS_COLLECTION), transactionData);

  // Update ingredient stock
  if (transaction.type === 'purchase' || transaction.type === 'adjustment') {
    const ingredientRef = doc(db, INGREDIENTS_COLLECTION, transaction.ingredientId);
    await updateDoc(ingredientRef, {
      currentStock: increment(transaction.quantity),
      updatedAt: Timestamp.now(),
    });
  } else if (transaction.type === 'usage' || transaction.type === 'waste') {
    const ingredientRef = doc(db, INGREDIENTS_COLLECTION, transaction.ingredientId);
    await updateDoc(ingredientRef, {
      currentStock: increment(-Math.abs(transaction.quantity)),
      updatedAt: Timestamp.now(),
    });
  }

  return docRef.id;
};

export const getInventoryTransactions = async (
  restaurantId: string,
  limit_count: number = 50
): Promise<InventoryTransaction[]> => {
  const q = query(
    collection(db, INVENTORY_TRANSACTIONS_COLLECTION),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc'),
    limit(limit_count)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as InventoryTransaction[];
};

// Purchase Functions
export const createPurchase = async (purchase: Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date();
  const purchaseData = {
    ...purchase,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };

  const batch = writeBatch(db);

  // Create purchase record
  const purchaseRef = doc(collection(db, PURCHASES_COLLECTION));
  batch.set(purchaseRef, purchaseData);

  // Deduct from wallet
  const walletRef = doc(db, WALLETS_COLLECTION, `${purchase.restaurantId}_${purchase.walletType}`);
  batch.update(walletRef, {
    balance: increment(-purchase.totalCost),
    lastUpdated: Timestamp.now(),
  });

  // Create inventory transactions for each item
  for (const item of purchase.ingredients) {
    const transactionRef = doc(collection(db, INVENTORY_TRANSACTIONS_COLLECTION));
    batch.set(transactionRef, {
      type: 'purchase',
      ingredientId: item.ingredientId,
      ingredientName: item.ingredientName,
      quantity: item.quantity,
      unit: item.unit,
      costPerUnit: item.costPerUnit,
      totalCost: item.totalCost,
      reason: `Purchase from ${purchase.supplier}`,
      purchaseId: purchaseRef.id,
      walletType: purchase.walletType,
      restaurantId: purchase.restaurantId,
      userId: purchase.userId,
      createdAt: Timestamp.now(),
    });

    // Update ingredient stock
    const ingredientRef = doc(db, INGREDIENTS_COLLECTION, item.ingredientId);
    batch.update(ingredientRef, {
      currentStock: increment(item.quantity),
      costPerUnit: item.costPerUnit, // Update cost per unit
      updatedAt: Timestamp.now(),
    });
  }

  await batch.commit();
  return purchaseRef.id;
};

export const getPurchasesByRestaurant = async (restaurantId: string): Promise<Purchase[]> => {
  const q = query(
    collection(db, PURCHASES_COLLECTION),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    purchaseDate: doc.data().purchaseDate.toDate(),
    expectedDelivery: doc.data().expectedDelivery ? doc.data().expectedDelivery.toDate() : undefined,
    actualDelivery: doc.data().actualDelivery ? doc.data().actualDelivery.toDate() : undefined,
  })) as Purchase[];
};

// Wallet Functions
export const getWallet = async (restaurantId: string, type: 'cash' | 'bank'): Promise<Wallet | null> => {
  const walletId = `${restaurantId}_${type}`;
  const walletRef = doc(db, WALLETS_COLLECTION, walletId);
  const walletDoc = await getDoc(walletRef);

  if (!walletDoc.exists()) {
    // Create wallet if it doesn't exist
    const newWallet: Wallet = {
      id: walletId,
      restaurantId,
      type,
      balance: 0,
      currency: 'USD',
      lastUpdated: new Date(),
    };

    await setDoc(walletRef, {
      ...newWallet,
      lastUpdated: Timestamp.fromDate(newWallet.lastUpdated),
    });

    return newWallet;
  }

  return {
    id: walletDoc.id,
    ...walletDoc.data(),
    lastUpdated: walletDoc.data()?.lastUpdated.toDate(),
  } as Wallet;
};

export const updateWalletBalance = async (
  restaurantId: string,
  type: 'cash' | 'bank',
  amount: number
) => {
  const walletId = `${restaurantId}_${type}`;
  const walletRef = doc(db, WALLETS_COLLECTION, walletId);

  await updateDoc(walletRef, {
    balance: increment(amount),
    lastUpdated: Timestamp.now(),
  });
};

// Stock Level and Alert Functions
export const getStockLevels = async (restaurantId: string): Promise<StockLevel[]> => {
  const ingredients = await getIngredientsByRestaurant(restaurantId);

  return ingredients.map(ingredient => {
    let status: StockLevel['status'] = 'in_stock';

    if (ingredient.currentStock <= 0) {
      status = 'out_of_stock';
    } else if (ingredient.currentStock <= ingredient.minStock) {
      status = 'low_stock';
    } else if (ingredient.maxStock && ingredient.currentStock >= ingredient.maxStock) {
      status = 'overstocked';
    }

    return {
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      currentStock: ingredient.currentStock,
      minStock: ingredient.minStock,
      maxStock: ingredient.maxStock,
      unit: ingredient.unit,
      status,
    };
  });
};

export const createInventoryAlert = async (
  alert: Omit<InventoryAlert, 'id' | 'createdAt'>
) => {
  const alertData = {
    ...alert,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, INVENTORY_ALERTS_COLLECTION), alertData);
  return docRef.id;
};

export const getInventoryAlerts = async (restaurantId: string): Promise<InventoryAlert[]> => {
  const q = query(
    collection(db, INVENTORY_ALERTS_COLLECTION),
    where('restaurantId', '==', restaurantId),
    where('isRead', '==', false),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as InventoryAlert[];
};

// Usage tracking when orders are completed
export const trackIngredientUsage = async (orderId: string, restaurantId: string, userId: string) => {
  // Get the recipe for each order item and deduct ingredient quantities
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const orderDoc = await getDoc(orderRef);

  if (!orderDoc.exists()) return;

  const order = orderDoc.data() as FirestoreOrder;

  for (const item of order.items) {
    const recipe = await getRecipeByMenuItem(item.id);
    if (!recipe) continue;

    // Create usage transactions for each ingredient in the recipe
    for (const recipeIngredient of recipe.ingredients) {
      const usageQuantity = recipeIngredient.quantity * item.quantity;

      await createInventoryTransaction({
        type: 'usage',
        ingredientId: recipeIngredient.ingredientId,
        ingredientName: recipeIngredient.ingredientName,
        quantity: -usageQuantity, // Negative for usage
        unit: recipeIngredient.unit,
        costPerUnit: recipeIngredient.costPerUnit,
        totalCost: usageQuantity * recipeIngredient.costPerUnit,
        reason: `Used for order ${orderId} - ${item.name}`,
        orderId,
        walletType: 'cash', // Default for usage tracking
        restaurantId,
        userId,
      });
    }
  }
};
