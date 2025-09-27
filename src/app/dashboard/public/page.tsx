import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
import { PublicMenuPreview } from '@/components/public/PublicMenuPreview';

export default function PublicMenuPage() {
  return (
    <DashboardLayout>
      <PageContent
        title="Public Menu"
        description="Preview and manage your customer-facing digital menu."
      >
        <PublicMenuPreview />
      </PageContent>
    </DashboardLayout>
  );
}
