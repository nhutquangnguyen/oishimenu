import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MenuBuilderRefactored } from '@/components/menu/MenuBuilderRefactored';

export default function MenuPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Menu Builder</h1>
          <p className="text-gray-600">Create and manage your restaurant menu with drag-and-drop ease.</p>
        </div>
        <MenuBuilderRefactored />
      </div>
    </DashboardLayout>
  );
}
