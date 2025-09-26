'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RouteBasedAuthProviderProps {
  children: React.ReactNode;
}

export function RouteBasedAuthProvider({ children }: RouteBasedAuthProviderProps) {
  const pathname = usePathname();
  const [shouldUseAuth, setShouldUseAuth] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Always call hooks in the same order
    const isAdminRoute = pathname?.startsWith('/admin');
    setShouldUseAuth(!isAdminRoute);
    setIsInitialized(true);
    
    if (isAdminRoute) {
      console.log('🔧 Admin route detected, skipping AuthProvider');
    } else {
      console.log('🔧 Normal route detected, using AuthProvider');
    }
  }, [pathname]);

  // Always render the same structure
  return (
    <>
      {isInitialized ? (
        shouldUseAuth ? (
          <AuthProvider>
            {children}
          </AuthProvider>
        ) : (
          children
        )
      ) : (
        // Show loading while determining route type
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing...</p>
          </div>
        </div>
      )}
    </>
  );
}
