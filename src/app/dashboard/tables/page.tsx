import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TablesManagerRefactored } from '@/components/tables/TablesManagerRefactored';

export default function TablesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tables</h1>
          <p className="text-gray-600">Manage your restaurant tables and generate QR codes for contactless ordering.</p>
        </div>
        <TablesManagerRefactored />
      </div>
    </DashboardLayout>
  );
}
