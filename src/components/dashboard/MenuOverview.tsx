'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from './types';

interface MenuOverviewProps {
  analytics: AnalyticsData;
}

export function MenuOverview({ analytics }: MenuOverviewProps) {
  // Calculate menu statistics from real data
  const calculateMenuStats = () => {
    // Get unique categories from top items
    const categories = [...new Set(analytics.topItems.map(item => item.category))];
    
    // Count total menu items
    const totalItems = analytics.topItems.reduce((sum, item) => sum + item.count, 0);
    
    // Count featured items (items with high order count)
    const maxOrders = Math.max(...analytics.topItems.map(item => item.count), 1);
    const featuredItems = analytics.topItems.filter(item => item.count >= maxOrders * 0.7).length;
    
    return {
      categories: categories.length,
      totalItems: totalItems,
      featuredItems: featuredItems
    };
  };

  const stats = calculateMenuStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Overview</CardTitle>
        <CardDescription>Your current menu status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.totalItems}</div>
            <div className="text-sm text-gray-600">Menu Items</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.featuredItems}</div>
            <div className="text-sm text-gray-600">Featured Items</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
