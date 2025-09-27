'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Eye,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickActionsProps {
  onAddMenuItem: () => void;
  onPreviewMenu: () => void;
  onViewAnalytics: () => void;
}

export function QuickActions({ 
  onAddMenuItem, 
  onPreviewMenu, 
  onViewAnalytics 
}: QuickActionsProps) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.quickActions.title')}</CardTitle>
        <CardDescription>{t('dashboard.quickActions.description') || 'Common tasks to get you started'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start text-sm sm:text-base" onClick={onAddMenuItem}>
          <Plus className="mr-2 h-4 w-4" />
          {t('dashboard.quickActions.addMenuItem')}
        </Button>
        <Button variant="outline" className="w-full justify-start text-sm sm:text-base" onClick={() => router.push('/dashboard/pos')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{t('dashboard.quickActions.openPOS')}</span>
          <span className="sm:hidden">{t('dashboard.quickActions.posSystem')}</span>
        </Button>
        <Button variant="outline" className="w-full justify-start text-sm sm:text-base" onClick={onPreviewMenu}>
          <Eye className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{t('dashboard.quickActions.previewPublicMenu')}</span>
          <span className="sm:hidden">{t('dashboard.quickActions.previewMenu')}</span>
        </Button>
        <Button variant="outline" className="w-full justify-start text-sm sm:text-base" onClick={onViewAnalytics}>
          <BarChart3 className="mr-2 h-4 w-4" />
          {t('dashboard.quickActions.viewAnalytics')}
        </Button>
      </CardContent>
    </Card>
  );
}
