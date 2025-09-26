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
        
        // Force sign out from Firebase Auth
        if (auth.currentUser) {
          console.log('🚪 Signing out from Firebase Auth for admin access');
          await signOut(auth);
          console.log('✅ Firebase Auth signed out successfully');
        }
        
        // Clear all Firebase Auth related data
        if (typeof window !== 'undefined') {
          // Clear localStorage
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('firebase:') || key.startsWith('firebase:authUser')) {
              localStorage.removeItem(key);
            }
          });
          
          // Clear sessionStorage
          Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('firebase:') || key.startsWith('firebase:authUser')) {
              sessionStorage.removeItem(key);
            }
          });
          
          console.log('🧹 Cleared all Firebase Auth data');
        }
        
        console.log('✅ Admin system initialized');
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
