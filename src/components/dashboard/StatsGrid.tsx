'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown,
  ShoppingCart, 
  DollarSign,
  Clock
} from 'lucide-react';
import { AnalyticsData } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsGridProps {
  analytics: AnalyticsData;
}

export function StatsGrid({ analytics }: StatsGridProps) {
  const { t } = useLanguage();
  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon 
  }: { 
    title: string; 
    value: string; 
    change: number; 
    icon: any;
  }) => {
    const ChangeIcon = change >= 0 ? TrendingUp : TrendingDown;
    const color = change >= 0 ? 'text-green-600' : 'text-red-600';
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">{title}</CardTitle>
          <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-base sm:text-lg lg:text-2xl font-bold truncate">{value}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ChangeIcon className={`w-3 h-3 mr-1 flex-shrink-0 ${color}`} />
            <span className={`${color} truncate`}>{change >= 0 ? '+' : ''}{change.toFixed(1)}%</span>
            <span className="ml-1 hidden sm:inline truncate">{t('dashboard.stats.fromPreviousPeriod')}</span>
            <span className="ml-1 sm:hidden">{t('dashboard.stats.vsLast')}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <StatCard
        title={t('dashboard.analytics.revenue')}
        value={`$${analytics.revenue.current.toFixed(2)}`}
        change={analytics.revenue.change}
        icon={DollarSign}
      />
      <StatCard
        title={t('dashboard.analytics.orders')}
        value={analytics.orders.current.toString()}
        change={analytics.orders.change}
        icon={ShoppingCart}
      />
      <StatCard
        title={t('dashboard.analytics.averageOrder')}
        value={`$${analytics.averageOrder.current.toFixed(2)}`}
        change={analytics.averageOrder.change}
        icon={TrendingUp}
      />
      <StatCard
        title={t('dashboard.analytics.completionRate')}
        value={`${analytics.completionRate.current.toFixed(1)}%`}
        change={analytics.completionRate.change}
        icon={Clock}
      />
    </div>
  );
}
