import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
import { OrdersTabs } from '@/components/orders/OrdersTabs';

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <PageContent
        title="Orders"
        description="Manage and track customer orders in real-time."
      >
        <OrdersTabs />
      </PageContent>
    </DashboardLayout>
  );
}
