'use client';

import { useAuth } from '@/contexts/AuthContext';
import { DisabledAccountNotification } from './DisabledAccountNotification';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isDisabled, disabledUserEmail, clearDisabledState, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasShownDisabledNotification, setHasShownDisabledNotification] = useState(false);

  // Always call hooks in the same order
  const handleReturnToLogin = () => {
    clearDisabledState();
    setHasShownDisabledNotification(false);
    router.push('/auth/signin');
  };

  // Show toast notification only once for disabled users
  useEffect(() => {
    if (isDisabled && disabledUserEmail && !hasShownDisabledNotification) {
      toast.error(`Account disabled: ${disabledUserEmail}`, {
        description: 'Your account has been disabled by an administrator',
        duration: 5000,
      });
      setHasShownDisabledNotification(true);
    }
  }, [isDisabled, disabledUserEmail, hasShownDisabledNotification]);

  // Allow landing page and auth pages to load without authentication
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth/') || pathname.startsWith('/menu/');

  // Always render the same structure, just conditionally show content
  return (
    <>
      {loading && !isPublicPage ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      ) : isDisabled && disabledUserEmail ? (
        <DisabledAccountNotification
          email={disabledUserEmail}
          onReturnToLogin={handleReturnToLogin}
        />
      ) : (
        children
      )}
    </>
  );
}