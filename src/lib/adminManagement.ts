// Dedicated admin management system - separate from regular users
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AdminInfo {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  createdBy?: string; // ID of admin who created this admin
}

export interface AdminPermission {
  resource: string; // 'users', 'restaurants', 'orders', 'analytics'
  actions: string[]; // ['read', 'write', 'delete']
}

export interface AdminSession {
  adminId: string;
  email: string;
  role: string;
  permissions: AdminPermission[];
  loginAt: Date;
  expiresAt: Date;
}

// Default admin accounts (hardcoded for initial setup)
const DEFAULT_ADMINS = [
  {
    email: 'nguyenquang.btr@gmail.com',
    name: 'Nguyen Quang',
    role: 'super_admin' as const,
    permissions: [
      { resource: '*', actions: ['*'] } // Super admin has all permissions
    ]
  },
  {
    email: 'dinhbarista.com',
    name: 'Dinh Barista',
    role: 'super_admin' as const,
    permissions: [
      { resource: '*', actions: ['*'] } // Super admin has all permissions
    ]
  },
  // Example admin accounts for testing
  {
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'super_admin' as const,
    permissions: [
      { resource: '*', actions: ['*'] } // Super admin has all permissions
    ]
  },
  {
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'admin' as const,
    permissions: [
      { resource: 'users', actions: ['read', 'write'] },
      { resource: 'restaurants', actions: ['read'] },
      { resource: 'orders', actions: ['read'] }
    ]
  },
  {
    email: 'moderator@example.com',
    name: 'Moderator User',
    role: 'moderator' as const,
    permissions: [
      { resource: 'users', actions: ['read'] },
      { resource: 'restaurants', actions: ['read'] }
    ]
  }
];

// Create admin profile in dedicated admins collection
export const createAdminProfile = async (adminData: Omit<AdminInfo, 'id' | 'createdAt'>): Promise<AdminInfo> => {
  try {
    const adminId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const adminRef = doc(db, 'admins', adminId);

    const newAdmin: AdminInfo = {
      id: adminId,
      createdAt: new Date(),
      ...adminData,
    };

    await setDoc(adminRef, {
      ...newAdmin,
      createdAt: newAdmin.createdAt,
      lastLoginAt: adminData.lastLoginAt || null
    });

    console.log('Admin profile created:', newAdmin);
    return newAdmin;
  } catch (error) {
    console.error('Error creating admin profile:', error);
    throw error;
  }
};

// Initialize default admin accounts
export const initializeDefaultAdmins = async () => {
  try {
    console.log('Initializing default admin accounts...');

    for (const defaultAdmin of DEFAULT_ADMINS) {
      // Check if admin already exists
      const existingAdmin = await getAdminByEmail(defaultAdmin.email);

      if (!existingAdmin) {
        await createAdminProfile({
          email: defaultAdmin.email,
          name: defaultAdmin.name,
          role: defaultAdmin.role,
          permissions: defaultAdmin.permissions,
          isActive: true,
          lastLoginAt: new Date()
        });
        console.log(`Created default admin: ${defaultAdmin.email}`);
      } else {
        console.log(`Admin already exists: ${defaultAdmin.email}`);
      }
    }

    console.log('Default admin initialization completed');
  } catch (error) {
    console.error('Error initializing default admins:', error);
    throw error;
  }
};

// Get admin by email
export const getAdminByEmail = async (email: string): Promise<AdminInfo | null> => {
  try {
    const adminsRef = collection(db, 'admins');
    const adminQuery = query(adminsRef, where('email', '==', email));
    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
      return null;
    }

    const adminDoc = adminSnapshot.docs[0];
    const data = adminDoc.data();

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      permissions: data.permissions,
      createdAt: data.createdAt.toDate(),
      lastLoginAt: data.lastLoginAt?.toDate(),
      isActive: data.isActive,
      createdBy: data.createdBy
    };
  } catch (error) {
    console.error('Error getting admin by email:', error);
    return null;
  }
};

// Get admin by ID
export const getAdminById = async (adminId: string): Promise<AdminInfo | null> => {
  try {
    const adminRef = doc(db, 'admins', adminId);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      return null;
    }

    const data = adminSnap.data();
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      permissions: data.permissions,
      createdAt: data.createdAt.toDate(),
      lastLoginAt: data.lastLoginAt?.toDate(),
      isActive: data.isActive,
      createdBy: data.createdBy
    };
  } catch (error) {
    console.error('Error getting admin by ID:', error);
    return null;
  }
};

// Authenticate admin (check credentials and permissions)
export const authenticateAdmin = async (email: string, password: string): Promise<AdminInfo | null> => {
  try {
    // For now, we'll use a simple email-based check
    // In production, you'd want proper password hashing
    const admin = await getAdminByEmail(email);

    if (!admin || !admin.isActive) {
      return null;
    }

    // Update last login time
    await updateAdminLastLogin(admin.id);

    return admin;
  } catch (error) {
    console.error('Error authenticating admin:', error);
    return null;
  }
};

// Update admin last login time
export const updateAdminLastLogin = async (adminId: string) => {
  try {
    const adminRef = doc(db, 'admins', adminId);
    await updateDoc(adminRef, {
      lastLoginAt: new Date()
    });
  } catch (error) {
    console.error('Error updating admin last login:', error);
  }
};

// Get all admins (for admin management)
export const getAllAdmins = async (): Promise<AdminInfo[]> => {
  try {
    const adminsRef = collection(db, 'admins');
    const adminsQuery = query(adminsRef, orderBy('createdAt', 'desc'));
    const adminsSnapshot = await getDocs(adminsQuery);

    const admins: AdminInfo[] = [];

    adminsSnapshot.forEach((doc) => {
      const data = doc.data();
      admins.push({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        permissions: data.permissions,
        createdAt: data.createdAt.toDate(),
        lastLoginAt: data.lastLoginAt?.toDate(),
        isActive: data.isActive,
        createdBy: data.createdBy
      });
    });

    return admins;
  } catch (error) {
    console.error('Error getting all admins:', error);
    return [];
  }
};

// Check if admin has permission for specific action
export const hasPermission = (admin: AdminInfo, resource: string, action: string): boolean => {
  // Super admin has all permissions
  if (admin.role === 'super_admin') {
    return true;
  }

  // Check specific permissions
  return admin.permissions.some(permission =>
    (permission.resource === '*' || permission.resource === resource) &&
    (permission.actions.includes('*') || permission.actions.includes(action))
  );
};

// Create admin session (for session management)
export const createAdminSession = (admin: AdminInfo): AdminSession => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
    loginAt: now,
    expiresAt
  };
};

// Disable/Enable admin
export const toggleAdminStatus = async (adminId: string, isActive: boolean) => {
  try {
    const adminRef = doc(db, 'admins', adminId);
    await updateDoc(adminRef, {
      isActive,
      updatedAt: new Date()
    });
    console.log(`Admin ${adminId} ${isActive ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error('Error toggling admin status:', error);
    throw error;
  }
};