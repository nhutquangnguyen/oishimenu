'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Restaurant } from '@/types/restaurant';
import { doc, getDoc, setDoc, addDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { checkNeedsMigration, migrateUserDataToRestaurant } from '@/lib/migration';
import { createSampleMenu } from '@/lib/sample-menu-templates';

interface RestaurantContextType {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  createRestaurant: (restaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) => Promise<string>;
  updateRestaurant: (restaurantId: string, updates: Partial<Restaurant>) => Promise<void>;
  deleteRestaurant: (restaurantId: string) => Promise<void>;
  loading: boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  // Custom setCurrentRestaurant that also saves to localStorage
  const setCurrentRestaurantWithPersistence = (restaurant: Restaurant | null) => {
    setCurrentRestaurant(restaurant);
    
    if (user?.uid) {
      if (restaurant) {
        localStorage.setItem(`selectedRestaurant_${user.uid}`, restaurant.id);
      } else {
        localStorage.removeItem(`selectedRestaurant_${user.uid}`);
      }
    }
  };

  // Load user's restaurants
  useEffect(() => {
    const loadRestaurants = async () => {
      if (!user?.uid) {
        setRestaurants([]);
        setCurrentRestaurantWithPersistence(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const restaurantsRef = collection(db, 'restaurants');
        const q = query(
          restaurantsRef,
          where('ownerId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const userRestaurants: Restaurant[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userRestaurants.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          } as Restaurant);
        });

        setRestaurants(userRestaurants);

        // If restaurants exist, set the current one
        if (userRestaurants.length > 0) {
          // Try to restore the previously selected restaurant from localStorage
          const savedRestaurantId = localStorage.getItem(`selectedRestaurant_${user.uid}`);
          const savedRestaurant = savedRestaurantId
            ? userRestaurants.find(r => r.id === savedRestaurantId)
            : null;

          if (savedRestaurant) {
            setCurrentRestaurantWithPersistence(savedRestaurant);
          } else if (!currentRestaurant) {
            // Set current restaurant to the first one if none selected and no saved preference
            setCurrentRestaurantWithPersistence(userRestaurants[0]);
          }
        } else {
          // If user has no restaurants, automatically create one
          console.log('🏪 User has no restaurants, creating default setup...');
          await createDefaultSetup();
        }
      } catch (error) {
        console.error('Error loading restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [user?.uid]);

  // Create default setup for new users
  const createDefaultSetup = async () => {
    if (!user?.uid) return;

    try {
      console.log('Creating default setup for new user...');

      // Check for pending restaurant name from signup flow
      const pendingRestaurantName = localStorage.getItem('pendingRestaurantName');

      // 1. Create default restaurant
      const now = new Date();
      const defaultRestaurant: Omit<Restaurant, 'id'> = {
        name: pendingRestaurantName || 'My Restaurant',
        description: 'Welcome to your new restaurant!',
        address: '',
        phone: '',
        email: '',
        logo: '🏪',
        theme: 'blue',
        isActive: true,
        ownerId: user.uid,
        createdAt: now,
        updatedAt: now,
      };

      const restaurantRef = await addDoc(collection(db, 'restaurants'), defaultRestaurant);
      const restaurantId = restaurantRef.id;

      const createdRestaurant: Restaurant = {
        id: restaurantId,
        ...defaultRestaurant,
      };

      setRestaurants([createdRestaurant]);
      setCurrentRestaurantWithPersistence(createdRestaurant);

      // 2. Create default area with one table
      const defaultTablesData = {
        areas: [
          {
            name: 'Main Dining',
            tables: [
              {
                id: `table-${Date.now()}`,
                name: 'Table 1',
                capacity: 4,
                status: 'available'
              }
            ]
          }
        ],
        lastUpdated: now
      };

      await setDoc(doc(db, 'tables', restaurantId), defaultTablesData);

      // 3. Create basic restaurant data for the menu (without categories - will be added after template selection)
      const defaultMenuData = {
        categories: [],
        optionGroups: [],
        isPublic: true,
        theme: 'blue',
        restaurant: {
          name: pendingRestaurantName || 'My Restaurant',
          logo: '🏪',
          description: 'Welcome to your new restaurant!',
          address: '',
          phone: '',
          hours: 'Mon-Sun: 11:00 AM - 10:00 PM'
        },
        lastUpdated: now
      };

      await setDoc(doc(db, 'menus', restaurantId), defaultMenuData);

      // 4. Migrate any legacy user data to this restaurant
      try {
        const needsMigration = await checkNeedsMigration(user.uid);
        if (needsMigration) {
          console.log('🔄 Migrating legacy user data to new restaurant structure...');
          await migrateUserDataToRestaurant(user.uid, restaurantId);
          console.log('✅ Migration completed successfully');
        }
      } catch (migrationError) {
        console.warn('⚠️  Migration failed, but restaurant was created successfully:', migrationError);
      }

      // 5. Update the restaurants state with the new restaurant
      setRestaurants([createdRestaurant]);
      setCurrentRestaurantWithPersistence(createdRestaurant);

      // 6. Clear the pending restaurant name after successful setup
      if (pendingRestaurantName) {
        localStorage.removeItem('pendingRestaurantName');
        console.log('✅ Restaurant created with name:', pendingRestaurantName);
      }

      console.log('✅ Default setup created successfully - restaurant ready!');

    } catch (error) {
      console.error('Error creating default setup:', error);
    }
  };

  const createRestaurant = async (restaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      const now = new Date();
      const newRestaurant: Omit<Restaurant, 'id'> = {
        ...restaurantData,
        ownerId: user.uid,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, 'restaurants'), newRestaurant);
      const restaurantId = docRef.id;

      const createdRestaurant: Restaurant = {
        id: restaurantId,
        ...newRestaurant,
      };

      // Create empty menu structure (will be populated after template selection)
      const defaultMenuData = {
        categories: [],
        optionGroups: [],
        isPublic: true,
        theme: restaurantData.theme || 'blue',
        restaurant: {
          name: restaurantData.name,
          logo: restaurantData.logo || '🏪',
          description: restaurantData.description || '',
          address: restaurantData.address || '',
          phone: restaurantData.phone || '',
          hours: 'Mon-Sun: 11:00 AM - 10:00 PM'
        },
        lastUpdated: now
      };

      await setDoc(doc(db, 'menus', restaurantId), defaultMenuData);

      // Create default area with one table for manually created restaurants too
      const defaultTablesData = {
        areas: [
          {
            name: 'Main Dining',
            tables: [
              {
                id: `table-${Date.now()}`,
                name: 'Table 1',
                capacity: 4,
                status: 'available'
              }
            ]
          }
        ],
        lastUpdated: now
      };

      await setDoc(doc(db, 'tables', restaurantId), defaultTablesData);

      setRestaurants(prev => [createdRestaurant, ...prev]);
      setCurrentRestaurantWithPersistence(createdRestaurant);

      return restaurantId;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  };

  const updateRestaurant = async (restaurantId: string, updates: Partial<Restaurant>) => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      await setDoc(restaurantRef, updateData, { merge: true });

      setRestaurants(prev => 
        prev.map(restaurant => 
          restaurant.id === restaurantId 
            ? { ...restaurant, ...updates, updatedAt: new Date() }
            : restaurant
        )
      );

      if (currentRestaurant?.id === restaurantId) {
        const updatedRestaurant = currentRestaurant ? { ...currentRestaurant, ...updates, updatedAt: new Date() } : null;
        setCurrentRestaurantWithPersistence(updatedRestaurant);
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  };

  const deleteRestaurant = async (restaurantId: string) => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      console.log('🗑️ Deleting restaurant and all related data:', restaurantId);

      // Delete all related data
      const batch = [];

      // 1. Mark restaurant as deleted (soft delete for audit trail)
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      batch.push(setDoc(restaurantRef, {
        isActive: false,
        deletedAt: new Date(),
        deletedBy: user.uid
      }, { merge: true }));

      // 2. Delete menu data
      const menuRef = doc(db, 'menus', restaurantId);
      batch.push(setDoc(menuRef, { isDeleted: true, deletedAt: new Date() }, { merge: true }));

      // 3. Delete tables data
      const tablesRef = doc(db, 'tables', restaurantId);
      batch.push(setDoc(tablesRef, { isDeleted: true, deletedAt: new Date() }, { merge: true }));

      // 4. Mark inventory collections as deleted
      // Note: We use soft delete to preserve data for potential recovery
      try {
        // Get and mark ingredients as deleted
        const ingredientsQuery = query(
          collection(db, 'ingredients'),
          where('restaurantId', '==', restaurantId)
        );
        const ingredientsSnapshot = await getDocs(ingredientsQuery);
        ingredientsSnapshot.forEach((doc) => {
          batch.push(setDoc(doc.ref, { isDeleted: true, deletedAt: new Date() }, { merge: true }));
        });

        // Get and mark recipes as deleted
        const recipesQuery = query(
          collection(db, 'recipes'),
          where('restaurantId', '==', restaurantId)
        );
        const recipesSnapshot = await getDocs(recipesQuery);
        recipesSnapshot.forEach((doc) => {
          batch.push(setDoc(doc.ref, { isDeleted: true, deletedAt: new Date() }, { merge: true }));
        });

        // Get and mark inventory transactions as deleted
        const transactionsQuery = query(
          collection(db, 'inventory_transactions'),
          where('restaurantId', '==', restaurantId)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        transactionsSnapshot.forEach((doc) => {
          batch.push(setDoc(doc.ref, { isDeleted: true, deletedAt: new Date() }, { merge: true }));
        });

        // Get and mark purchases as deleted
        const purchasesQuery = query(
          collection(db, 'purchases'),
          where('restaurantId', '==', restaurantId)
        );
        const purchasesSnapshot = await getDocs(purchasesQuery);
        purchasesSnapshot.forEach((doc) => {
          batch.push(setDoc(doc.ref, { isDeleted: true, deletedAt: new Date() }, { merge: true }));
        });

        // Get and mark orders as deleted
        const ordersQuery = query(
          collection(db, 'orders'),
          where('restaurantId', '==', restaurantId)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        ordersSnapshot.forEach((doc) => {
          batch.push(setDoc(doc.ref, { isDeleted: true, deletedAt: new Date() }, { merge: true }));
        });

      } catch (dataError) {
        console.warn('Some related data might not be fully cleaned up:', dataError);
      }

      // Execute all operations
      await Promise.all(batch);

      // Update local state
      setRestaurants(prev => prev.filter(restaurant => restaurant.id !== restaurantId));

      if (currentRestaurant?.id === restaurantId) {
        const remainingRestaurants = restaurants.filter(r => r.id !== restaurantId);
        setCurrentRestaurantWithPersistence(remainingRestaurants.length > 0 ? remainingRestaurants[0] : null);
      }

      // Clear localStorage for this restaurant
      localStorage.removeItem(`selectedRestaurant_${user.uid}`);

      console.log('✅ Restaurant and all related data deleted successfully');
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  };

  return (
    <RestaurantContext.Provider value={{
      restaurants,
      currentRestaurant,
      setCurrentRestaurant: setCurrentRestaurantWithPersistence,
      createRestaurant,
      updateRestaurant,
      deleteRestaurant,
      loading,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
