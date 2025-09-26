// User management utilities for admin system

import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserInfo {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastSignIn?: Date;
  emailVerified: boolean;
  disabled: boolean;
  isAdmin: boolean;
}

export const createUserProfile = async (uid: string, email: string, displayName?: string) => {
  try {
    const userRef = doc(db, 'users', uid);

    // Check if user already exists to avoid overwriting disabled status
    const existingUser = await getDoc(userRef);

    if (existingUser.exists()) {
      // User exists, only update lastSignIn and keep existing disabled status
      const updateData = {
        lastSignIn: new Date(),
        updatedAt: new Date()
      };

      await setDoc(userRef, updateData, { merge: true });
      console.log('User profile updated with last sign in:', uid);

      const data = existingUser.data();
      return {
        uid: data.uid || uid,
        email: data.email,
        displayName: data.displayName,
        createdAt: data.createdAt.toDate(),
        lastSignIn: new Date(),
        emailVerified: data.emailVerified,
        disabled: data.disabled || false, // Keep existing disabled status
        isAdmin: data.isAdmin || false,
      } as UserInfo;
    } else {
      // New user, create profile
      const userData: UserInfo = {
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        createdAt: new Date(),
        lastSignIn: new Date(),
        emailVerified: true,
        disabled: false, // New users start as enabled
        isAdmin: false, // Normal users are never admin
      };

      await setDoc(userRef, userData);
      console.log('User profile created:', userData);
      return userData;
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<UserInfo[]> => {
  try {
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));
    const usersSnapshot = await getDocs(usersQuery);
    
    const users: UserInfo[] = [];
    const emailGroups: Record<string, UserInfo[]> = {};
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      const userInfo: UserInfo = {
        uid: data.uid || doc.id, // Use data.uid if available, fallback to doc.id
        email: data.email,
        displayName: data.displayName,
        createdAt: data.createdAt.toDate(),
        lastSignIn: data.lastSignIn?.toDate(),
        emailVerified: data.emailVerified,
        disabled: data.disabled,
        isAdmin: data.isAdmin,
      };
      
      // Group by email to handle duplicates
      if (!emailGroups[userInfo.email]) {
        emailGroups[userInfo.email] = [];
      }
      emailGroups[userInfo.email].push(userInfo);
    });

    // For each email, keep only the real Firebase Auth UID (longer UID)
    const finalUsers: UserInfo[] = [];
    for (const [email, userList] of Object.entries(emailGroups)) {
      if (userList.length === 1) {
        // No duplicates, add the user
        finalUsers.push(userList[0]);
      } else {
        // Multiple users with same email, prioritize real Firebase Auth UID
        const sortedUsers = userList.sort((a, b) => {
          const aIsReal = a.uid.length > 20; // Real Firebase UIDs are longer
          const bIsReal = b.uid.length > 20;
          
          if (aIsReal && !bIsReal) return -1; // a comes first
          if (!aIsReal && bIsReal) return 1;  // b comes first
          return 0; // keep original order
        });
        
        // Keep only the first user (real Firebase Auth UID)
        finalUsers.push(sortedUsers[0]);
        console.log(`Filtered duplicates for ${email}: kept ${sortedUsers[0].uid}, removed ${sortedUsers.length - 1} others`);
      }
    }

    return finalUsers;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const getUserById = async (uid: string): Promise<UserInfo | null> => {
  try {
    // First try to get the user document directly by UID (more efficient)
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid: data.uid || uid, // Use provided uid if data.uid is missing
        email: data.email,
        displayName: data.displayName,
        createdAt: data.createdAt.toDate(),
        lastSignIn: data.lastSignIn?.toDate(),
        emailVerified: data.emailVerified,
        disabled: data.disabled || false, // Default to false if undefined
        isAdmin: data.isAdmin || false, // Default to false if undefined
      };
    }

    // Fallback: search by uid field (in case document ID doesn't match uid)
    const userQuery = await getDocs(query(collection(db, 'users'), where('uid', '==', uid)));

    if (!userQuery.empty) {
      const data = userQuery.docs[0].data();
      return {
        uid: data.uid || uid,
        email: data.email,
        displayName: data.displayName,
        createdAt: data.createdAt.toDate(),
        lastSignIn: data.lastSignIn?.toDate(),
        emailVerified: data.emailVerified,
        disabled: data.disabled || false,
        isAdmin: data.isAdmin || false,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserInfo>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { ...updates, updatedAt: new Date() }, { merge: true });
    console.log('User profile updated:', uid);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const disableUserProfile = async (uid: string) => {
  try {
    console.log('🚫 Starting disable process for user:', uid);

    // First check if document exists
    const userRef = doc(db, 'users', uid);
    const existingUser = await getDoc(userRef);

    if (!existingUser.exists()) {
      console.error('❌ User document does not exist:', uid);
      throw new Error(`User document not found: ${uid}`);
    }

    console.log('📋 Current user data:', existingUser.data());

    const updateData = {
      disabled: true,
      disabledAt: new Date(),
      disabledBy: 'admin',
      updatedAt: new Date()
    };
    console.log('🚫 Update data to apply:', updateData);

    // Attempt the update
    console.log('💾 Attempting database update...');
    await setDoc(userRef, updateData, { merge: true });
    console.log('✅ Database update completed');

    // Verify the update worked by reading back
    console.log('🔍 Verifying update...');
    const updatedUser = await getDoc(userRef);
    if (updatedUser.exists()) {
      const data = updatedUser.data();
      console.log('🔍 Verified user data after update:', JSON.stringify(data, null, 2));
      console.log('🔍 Disabled status confirmed:', data.disabled);

      if (data.disabled !== true) {
        console.error('❌ WARNING: Update may have failed - disabled is still:', data.disabled);
      }
    } else {
      console.error('❌ User document missing after update!');
    }
  } catch (error) {
    console.error('❌ Error disabling user profile:', error);
    console.error('❌ Error details:', {
      code: (error as any)?.code,
      message: (error as any)?.message,
      stack: (error as any)?.stack
    });
    throw error;
  }
};

export const enableUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { 
      disabled: false, 
      enabledAt: new Date(),
      enabledBy: 'admin'
    }, { merge: true });
    console.log('User profile enabled:', uid);
  } catch (error) {
    console.error('Error enabling user profile:', error);
    throw error;
  }
};

export const removeDuplicateUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    const emailGroups: Record<string, any[]> = {};
    
    // Group users by email
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      const email = data.email;
      if (!emailGroups[email]) {
        emailGroups[email] = [];
      }
      emailGroups[email].push({ id: doc.id, data });
    });
    
    // Find duplicates and prioritize real Firebase Auth UIDs
    for (const [email, users] of Object.entries(emailGroups)) {
      if (users.length > 1) {
        console.log(`Found ${users.length} duplicates for email: ${email}`);
        
        // Sort users: real Firebase Auth UIDs first, then hardcoded ones
        const sortedUsers = users.sort((a, b) => {
          const aIsReal = a.data.uid && a.data.uid.length > 20; // Real Firebase UIDs are longer
          const bIsReal = b.data.uid && b.data.uid.length > 20;
          
          if (aIsReal && !bIsReal) return -1; // a comes first
          if (!aIsReal && bIsReal) return 1;  // b comes first
          return 0; // keep original order
        });
        
        // Keep the first user (real Firebase Auth UID), delete the rest
        const usersToDelete = sortedUsers.slice(1);
        
        for (const userToDelete of usersToDelete) {
          const userRef = doc(db, 'users', userToDelete.id);
          await setDoc(userRef, { disabled: true, deletedAt: new Date(), isDuplicate: true }, { merge: true });
          console.log(`Marked duplicate user as deleted: ${userToDelete.id} (${userToDelete.data.uid})`);
        }
        
        console.log(`Kept user: ${sortedUsers[0].id} (${sortedUsers[0].data.uid})`);
      }
    }
    
    console.log('Duplicate users cleaned up');
  } catch (error) {
    console.error('Error removing duplicate users:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<UserInfo | null> => {
  try {
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        uid: data.uid || doc.id,
        email: data.email,
        displayName: data.displayName,
        createdAt: data.createdAt.toDate(),
        lastSignIn: data.lastSignIn?.toDate(),
        emailVerified: data.emailVerified,
        disabled: data.disabled || false,
        isAdmin: data.isAdmin || false,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const syncUserData = async () => {
  try {
    console.log('Syncing user data...');
    
    // Get all users from users collection
    const allUsers = await getAllUsers();
    console.log('Users in users collection:', allUsers.length);
    
    // Get all restaurants
    const restaurantsRef = collection(db, 'restaurants');
    const restaurantsSnapshot = await getDocs(restaurantsRef);
    console.log('Restaurants found:', restaurantsSnapshot.size);
    
    // Get all orders
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    console.log('Orders found:', ordersSnapshot.size);
    
    // Check for data mismatches
    const restaurantOwnerIds = new Set();
    const orderUserIds = new Set();
    
    restaurantsSnapshot.forEach((doc) => {
      const data = doc.data();
      restaurantOwnerIds.add(data.ownerId);
    });
    
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      orderUserIds.add(data.userId);
    });
    
    console.log('Restaurant owner IDs:', Array.from(restaurantOwnerIds));
    console.log('Order user IDs:', Array.from(orderUserIds));
    console.log('User UIDs from users collection:', allUsers.map(u => u.uid));
    
    // Find mismatches
    const userUids = new Set(allUsers.map(u => u.uid));
    const missingInUsers = Array.from(restaurantOwnerIds).filter((id): id is string => typeof id === 'string' && !userUids.has(id));
    const missingInUsersOrders = Array.from(orderUserIds).filter((id): id is string => typeof id === 'string' && !userUids.has(id));
    
    console.log('Owner IDs not in users collection:', missingInUsers);
    console.log('User IDs in orders not in users collection:', missingInUsersOrders);
    
    return {
      usersCount: allUsers.length,
      restaurantsCount: restaurantsSnapshot.size,
      ordersCount: ordersSnapshot.size,
      missingOwners: missingInUsers,
      missingOrderUsers: missingInUsersOrders,
    };
  } catch (error) {
    console.error('Error syncing user data:', error);
    throw error;
  }
};
