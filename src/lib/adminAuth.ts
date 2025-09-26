// Dedicated admin authentication system - separate from regular Firebase Auth
import { AdminInfo, AdminSession, getAdminByEmail, updateAdminLastLogin, createAdminSession } from './adminManagement';

// Simple password verification (in production, use proper hashing)
const ADMIN_PASSWORDS: Record<string, string> = {
  'nguyenquang.btr@gmail.com': 'admin123', // Replace with secure password hashing
  'dinhbarista.com': 'admin123', // Added dinhbarista.com as admin
  // Example admin accounts for testing
  'admin@example.com': 'admin123',
  'manager@example.com': 'manager123',
  'moderator@example.com': 'moderator123'
};

// Admin session storage (in production, use secure session storage)
let currentAdminSession: AdminSession | null = null;

// Login admin with email/password
export const loginAdmin = async (email: string, password: string): Promise<AdminSession | null> => {
  try {
    console.log('🔐 Admin login attempt:', email);

    // Verify password (simplified for demo)
    if (ADMIN_PASSWORDS[email] !== password) {
      console.log('❌ Invalid password for admin:', email);
      return null;
    }

    // Get admin from database
    const admin = await getAdminByEmail(email);
    if (!admin || !admin.isActive) {
      console.log('❌ Admin not found or inactive:', email);
      return null;
    }

    console.log('✅ Admin found:', admin.email, admin.role);

    // Update last login
    await updateAdminLastLogin(admin.id);

    // Create session
    const session = createAdminSession(admin);
    currentAdminSession = session;

    console.log('✅ Admin session created:', session.adminId);

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSession', JSON.stringify({
        ...session,
        loginAt: session.loginAt.toISOString(),
        expiresAt: session.expiresAt.toISOString()
      }));
    }

    return session;
  } catch (error) {
    console.error('❌ Error during admin login:', error);
    return null;
  }
};

// Logout admin
export const logoutAdmin = async (): Promise<void> => {
  try {
    console.log('🚪 Admin logout');
    currentAdminSession = null;

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminSession');
    }
  } catch (error) {
    console.error('Error during admin logout:', error);
  }
};

// Get current admin session
export const getCurrentAdminSession = (): AdminSession | null => {
  // First check memory
  if (currentAdminSession) {
    // Check if session is still valid
    if (new Date() < currentAdminSession.expiresAt) {
      return currentAdminSession;
    } else {
      // Session expired
      currentAdminSession = null;
    }
  }

  // Try to restore from localStorage
  if (typeof window !== 'undefined') {
    try {
      const storedSession = localStorage.getItem('adminSession');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        const expiresAt = new Date(session.expiresAt);

        // Check if session is still valid
        if (new Date() < expiresAt) {
          currentAdminSession = {
            ...session,
            loginAt: new Date(session.loginAt),
            expiresAt: expiresAt
          };
          return currentAdminSession;
        } else {
          // Session expired, clear it
          localStorage.removeItem('adminSession');
        }
      }
    } catch (error) {
      console.error('Error restoring admin session:', error);
      localStorage.removeItem('adminSession');
    }
  }

  return null;
};

// Check if current session is valid admin
export const isValidAdminSession = (): boolean => {
  const session = getCurrentAdminSession();
  return session !== null;
};

// Get admin info from current session
export const getCurrentAdmin = (): AdminInfo | null => {
  const session = getCurrentAdminSession();
  if (!session) return null;

  return {
    id: session.adminId,
    email: session.email,
    name: '', // We'll need to fetch full info if needed
    role: session.role as any,
    permissions: session.permissions,
    createdAt: new Date(), // Placeholder
    isActive: true
  };
};

// Initialize admin system
export const initializeAdminSystem = async (): Promise<void> => {
  try {
    console.log('🚀 Initializing admin system...');

    // Import here to avoid circular dependency
    const { initializeDefaultAdmins } = await import('./adminManagement');
    await initializeDefaultAdmins();

    console.log('✅ Admin system initialized');
  } catch (error) {
    console.error('❌ Error initializing admin system:', error);
  }
};