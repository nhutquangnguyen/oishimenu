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

interface StatsGridProps {
  analytics: AnalyticsData;
}

export function StatsGrid({ analytics }: StatsGridProps) {
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
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <ChangeIcon className={`w-3 h-3 mr-1 ${color}`} />
            <span className={color}>{change >= 0 ? '+' : ''}{change.toFixed(1)}%</span>
            <span className="ml-1">from previous period</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Revenue"
        value={`$${analytics.revenue.current.toFixed(2)}`}
        change={analytics.revenue.change}
        icon={DollarSign}
      />
      <StatCard
        title="Orders"
        value={analytics.orders.current.toString()}
        change={analytics.orders.change}
        icon={ShoppingCart}
      />
      <StatCard
        title="Avg Order Value"
        value={`$${analytics.averageOrder.current.toFixed(2)}`}
        change={analytics.averageOrder.change}
        icon={TrendingUp}
      />
      <StatCard
        title="Completion Rate"
        value={`${analytics.completionRate.current.toFixed(1)}%`}
        change={analytics.completionRate.change}
        icon={Clock}
      />
    </div>
  );
}
