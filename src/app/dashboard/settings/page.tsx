'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
import { SettingsTabs } from '@/components/settings/SettingsTabs';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <PageContent
        title={t('settings.title')}
        description={t('settings.description')}
      >
        <SettingsTabs />
      </PageContent>
    </DashboardLayout>
  );
}
