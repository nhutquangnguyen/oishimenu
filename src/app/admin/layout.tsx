'use client';

import { useEffect } from 'react';
import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initializeAdminSystem = async () => {
      try {
        console.log('🔧 Initializing admin system...');
        
        // Clear any remaining auth state first
        if (typeof window !== 'undefined') {
          // Clear localStorage auth data
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('firebase:') || key.includes('authUser') || key.includes('auth')) {
              localStorage.removeItem(key);
            }
          });
          
          console.log('🧹 Cleared Firebase Auth data');
        }
        
        // Force sign out from Firebase Auth to ensure clean state
        if (auth.currentUser) {
          console.log('🚪 Signing out from Firebase Auth for admin access');
          await signOut(auth);
          console.log('✅ Firebase Auth signed out successfully');
        }
        
        // Additional cleanup
        if (typeof window !== 'undefined') {
          // Clear session storage as well
          sessionStorage.clear();
          
          // Clear any Firebase auth state
          Object.keys(localStorage).forEach(key => {
            if (key.includes('firebase') || key.includes('auth')) {
              localStorage.removeItem(key);
            }
          });
        }
        
        console.log('✅ Admin system ready');
      } catch (error) {
        console.error('❌ Error initializing admin system:', error);
      }
    };

    initializeAdminSystem();
  }, []);

  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}