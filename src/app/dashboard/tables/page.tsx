import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
import { TablesManagerRefactored } from '@/components/tables/TablesManagerRefactored';

export default function TablesPage() {
  return (
    <DashboardLayout>
      <PageContent
        title="Tables"
        description="Manage your restaurant tables and generate QR codes for contactless ordering."
      >
        <TablesManagerRefactored />
      </PageContent>
    </DashboardLayout>
  );
}
