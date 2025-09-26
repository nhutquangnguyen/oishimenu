import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { MenuData } from '@/components/menu/types';
import { TablesData } from '@/components/tables/types';

/**
 * Migration utilities to help transition from user-based to restaurant-based data structure
 */

export const migrateUserDataToRestaurant = async (userId: string, restaurantId: string) => {
  const migrations = [];

  try {
    // 1. Migrate menu data
    console.log('🔄 Migrating menu data...');
    const userMenuDoc = await getDoc(doc(db, 'menus', userId));
    if (userMenuDoc.exists()) {
      const userMenuData = userMenuDoc.data() as any;

      // Update the menu data with proper restaurant ID
      const migratedMenuData: MenuData = {
        ...userMenuData,
        restaurantId,
        categories: userMenuData.categories?.map((category: any) => ({
          ...category,
          restaurantId,
          items: category.items?.map((item: any) => ({
            ...item,
            restaurantId
          })) || []
        })) || [],
        lastUpdated: new Date()
      };

      // Save to restaurant ID and remove from user ID
      await setDoc(doc(db, 'menus', restaurantId), migratedMenuData);
      await deleteDoc(doc(db, 'menus', userId));
      migrations.push('✅ Menu data migrated');
    } else {
      migrations.push('ℹ️  No menu data to migrate');
    }

    // 2. Migrate tables data
    console.log('🔄 Migrating tables data...');
    const userTablesDoc = await getDoc(doc(db, 'tables', userId));
    if (userTablesDoc.exists()) {
      const userTablesData = userTablesDoc.data() as any;

      // Update the tables data with proper restaurant ID
      const migratedTablesData: TablesData = {
        ...userTablesData,
        restaurantId,
        areas: userTablesData.areas?.map((area: any) => ({
          ...area,
          restaurantId,
          tables: area.tables?.map((table: any) => ({
            ...table,
            restaurantId
          })) || []
        })) || [],
        lastUpdated: new Date()
      };

      // Save to restaurant ID and remove from user ID
      await setDoc(doc(db, 'tables', restaurantId), migratedTablesData);
      await deleteDoc(doc(db, 'tables', userId));
      migrations.push('✅ Tables data migrated');
    } else {
      migrations.push('ℹ️  No tables data to migrate');
    }

    // 3. Update analytics to use restaurant ID
    console.log('🔄 Migrating analytics data...');
    const userAnalyticsDoc = await getDoc(doc(db, 'analytics', userId));
    if (userAnalyticsDoc.exists()) {
      const userAnalyticsData = userAnalyticsDoc.data() as any;

      // Save analytics under restaurant ID
      const migratedAnalyticsData = {
        ...userAnalyticsData,
        userId: restaurantId // Keep for backward compatibility
      };

      await setDoc(doc(db, 'analytics', restaurantId), migratedAnalyticsData);
      await deleteDoc(doc(db, 'analytics', userId));
      migrations.push('✅ Analytics data migrated');
    } else {
      migrations.push('ℹ️  No analytics data to migrate');
    }

    console.log('🎉 Migration completed successfully:', migrations);
    return migrations;

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
};

export const checkNeedsMigration = async (userId: string): Promise<boolean> => {
  try {
    // Check if user has data stored under their user ID instead of restaurant ID
    const userMenuDoc = await getDoc(doc(db, 'menus', userId));
    const userTablesDoc = await getDoc(doc(db, 'tables', userId));
    const userAnalyticsDoc = await getDoc(doc(db, 'analytics', userId));

    return userMenuDoc.exists() || userTablesDoc.exists() || userAnalyticsDoc.exists();
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
};