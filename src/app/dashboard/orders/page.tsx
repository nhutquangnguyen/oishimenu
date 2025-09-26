import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OrdersTabs } from '@/components/orders/OrdersTabs';

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track customer orders in real-time.</p>
        </div>
        <OrdersTabs />
      </div>
    </DashboardLayout>
  );
}
