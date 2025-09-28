'use client';

import { PageContent } from '@/components/shared/PageContent';
import { TablesManagerRefactored } from '@/components/tables/TablesManagerRefactored';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TablesPage() {
  const { t } = useLanguage();

  return (
    <PageContent
      title={t('tables.title')}
      description={t('tables.description')}
    >
      <TablesManagerRefactored />
    </PageContent>
  );
}
