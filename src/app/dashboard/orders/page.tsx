'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
import { OrdersTabs } from '@/components/orders/OrdersTabs';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OrdersPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <PageContent
        title={t('orders.title')}
        description={t('orders.description')}
      >
        <OrdersTabs />
      </PageContent>
    </DashboardLayout>
  );
}
