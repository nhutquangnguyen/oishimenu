'use client';

import { usePathname } from 'next/navigation';
import { AuthWrapper } from './AuthWrapper';

export function ConditionalAuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Skip AuthWrapper for admin routes
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }
  
  return <AuthWrapper>{children}</AuthWrapper>;
}