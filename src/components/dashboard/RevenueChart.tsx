'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { AnalyticsData } from './types';

interface RevenueChartProps {
  analytics: AnalyticsData;
}

export function RevenueChart({ analytics }: RevenueChartProps) {
  // Generate revenue data based on recent orders
  const generateRevenueData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const revenueData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Calculate revenue for this day based on orders
      const dayOrders = analytics.recentOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      revenueData.push({
        day: days[6 - i],
        revenue: Math.round(dayRevenue),
        date: date
      });
    }
    
    return revenueData;
  };

  const revenueData = generateRevenueData();
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Revenue Trend
        </CardTitle>
        <CardDescription>Daily revenue over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2">
          {revenueData.map((data, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="bg-blue-500 rounded-t w-8 transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(data.revenue / maxRevenue) * 200}px` }}
              ></div>
              <div className="text-xs text-gray-500">
                {data.day}
              </div>
              <div className="text-xs font-medium">${data.revenue}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
