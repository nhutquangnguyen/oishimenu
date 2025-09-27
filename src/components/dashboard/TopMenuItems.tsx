'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { AnalyticsData } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface TopMenuItemsProps {
  analytics: AnalyticsData;
}

export function TopMenuItems({ analytics }: TopMenuItemsProps) {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          {t('dashboard.topMenuItems.title')}
        </CardTitle>
        <CardDescription>{t('dashboard.topMenuItems.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analytics.topItems.slice(0, 5).map((item, index) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-gray-500">{item.count} {t('dashboard.topMenuItems.orders')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.count / Math.max(...analytics.topItems.map(i => i.count))) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
