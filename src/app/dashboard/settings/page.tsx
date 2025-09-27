import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
import { SettingsTabs } from '@/components/settings/SettingsTabs';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <PageContent
        title="Settings"
        description="Manage your restaurant settings, profile, and preferences."
      >
        <SettingsTabs />
      </PageContent>
    </DashboardLayout>
  );
}
