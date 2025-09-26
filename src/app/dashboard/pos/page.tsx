'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { POSInterface } from '@/components/pos/POSInterface';

export default function POSPage() {
  return (
    <DashboardLayout>
      <POSInterface />
    </DashboardLayout>
  );
}
