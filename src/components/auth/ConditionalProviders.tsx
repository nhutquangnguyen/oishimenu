'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
import { AuthWrapper } from './AuthWrapper';

interface ConditionalProvidersProps {
  children: React.ReactNode;
}

export function ConditionalProviders({ children }: ConditionalProvidersProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || false;

  // For admin routes, only provide minimal providers
  if (isAdminRoute) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  // For all other routes, provide full context stack
  return (
    <AuthProvider>
      <RestaurantProvider>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </RestaurantProvider>
    </AuthProvider>
  );
}