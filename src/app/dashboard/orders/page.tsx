'use client';

import { PageContent } from '@/components/shared/PageContent';
import { OrdersTabs } from '@/components/orders/OrdersTabs';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OrdersPage() {
  const { t } = useLanguage();

  return (
    <PageContent
      title={t('orders.title')}
      description={t('orders.description')}
    >
      <OrdersTabs />
    </PageContent>
  );
}
