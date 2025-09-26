import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PublicMenuPreview } from '@/components/public/PublicMenuPreview';

export default function PublicMenuPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Public Menu</h1>
          <p className="text-gray-600">Preview and manage your customer-facing digital menu.</p>
        </div>
        <PublicMenuPreview />
      </div>
    </DashboardLayout>
  );
}
