'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart,
  BarChart3,
  Clock
} from 'lucide-react';
import { AnalyticsData } from './types';

interface AnalyticsChartsProps {
  analytics: AnalyticsData;
}

export function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  // Calculate order status distribution
  const statusCounts = analytics.recentOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusConfig = [
    { status: 'pending', label: 'Pending', color: 'bg-yellow-500', count: statusCounts.pending || 0 },
    { status: 'preparing', label: 'Preparing', color: 'bg-blue-500', count: statusCounts.preparing || 0 },
    { status: 'ready', label: 'Ready', color: 'bg-green-500', count: statusCounts.ready || 0 },
    { status: 'delivered', label: 'Delivered', color: 'bg-gray-500', count: statusCounts.delivered || 0 },
    { status: 'cancelled', label: 'Cancelled', color: 'bg-red-500', count: statusCounts.cancelled || 0 }
  ];

  // Calculate hourly activity from real orders
  const calculateHourlyActivity = () => {
    const hours = [
      '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', 
      '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'
    ];
    
    return hours.map(hour => {
      const hourNum = parseInt(hour.split(' ')[0]) + (hour.includes('PM') && hour !== '12 PM' ? 12 : 0);
      const orders = analytics.recentOrders.filter(order => {
        const orderHour = new Date(order.createdAt).getHours();
        return orderHour === hourNum;
      });
      
      return {
        hour,
        orders: orders.length
      };
    });
  };

  const hourlyData = calculateHourlyActivity();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="w-5 h-5 mr-2" />
          Order Status
        </CardTitle>
        <CardDescription>Current order distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusConfig.map((status) => (
            <div key={status.status} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${status.color} rounded-full`}></div>
                <span className="text-sm">{status.label}</span>
              </div>
              <span className="font-semibold">{status.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
