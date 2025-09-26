// Hook for dedicated admin authentication system
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { AdminInfo, AdminSession } from '@/lib/adminManagement';
import { getCurrentAdminSession, isValidAdminSession, logoutAdmin, getCurrentAdmin } from '@/lib/adminAuth';

interface AdminAuthContextType {
  admin: AdminInfo | null;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session on mount
    const checkAdminSession = () => {
      try {
        const session = getCurrentAdminSession();
        if (session) {
          const adminInfo = getCurrentAdmin();
          setAdmin(adminInfo);
          console.log('✅ Admin session restored:', adminInfo?.email);
        } else {
          console.log('❌ No valid admin session found');
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  const logout = async () => {
    try {
      await logoutAdmin();
      setAdmin(null);
      console.log('✅ Admin logged out');
    } catch (error) {
      console.error('Error logging out admin:', error);
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!admin) return false;

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

  const value = {
    admin,
    isAdmin: !!admin,
    isLoading,
    logout,
    hasPermission,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Hook to use admin authentication
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Legacy hook for backward compatibility (returns simple boolean)
export function useOldAdminAuth(): { isAdmin: boolean; isLoading: boolean } {
  const { isAdmin, isLoading } = useAdminAuth();
  return { isAdmin, isLoading };
}