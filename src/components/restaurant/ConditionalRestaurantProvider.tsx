'use client';

import { usePathname } from 'next/navigation';
import { RestaurantProvider } from '@/contexts/RestaurantContext';

interface ConditionalRestaurantProviderProps {
  children: React.ReactNode;
}

export function ConditionalRestaurantProvider({ children }: ConditionalRestaurantProviderProps) {
  const pathname = usePathname();
  
  // Check if we're in admin routes
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // For admin routes, don't use RestaurantProvider to avoid useAuth dependency
  if (isAdminRoute) {
    console.log('🔧 Admin route detected, skipping RestaurantProvider');
    return <>{children}</>;
  }
  
  // For all other routes, use normal RestaurantProvider
  return (
    <RestaurantProvider>
      {children}
    </RestaurantProvider>
  );
}
