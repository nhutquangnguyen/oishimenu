import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SettingsTabs } from '@/components/settings/SettingsTabs';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your restaurant settings, profile, and preferences.</p>
        </div>
        
        <SettingsTabs />
      </div>
    </DashboardLayout>
  );
}
