'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
import { TablesManagerRefactored } from '@/components/tables/TablesManagerRefactored';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TablesPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <PageContent
        title={t('tables.title')}
        description={t('tables.description')}
      >
        <TablesManagerRefactored />
      </PageContent>
    </DashboardLayout>
  );
}
