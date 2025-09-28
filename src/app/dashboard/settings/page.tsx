'use client';

import { PageContent } from '@/components/shared/PageContent';
import { SettingsTabs } from '@/components/settings/SettingsTabs';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <PageContent
      title={t('settings.title')}
      description={t('settings.description')}
    >
      <SettingsTabs />
    </PageContent>
  );
}
