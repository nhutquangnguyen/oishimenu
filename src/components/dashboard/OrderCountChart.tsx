'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { AnalyticsData } from './types';

interface OrderCountChartProps {
  analytics: AnalyticsData;
}

export function OrderCountChart({ analytics }: OrderCountChartProps) {
  // Calculate order count by hour of day
  const calculateOrderCountByHour = () => {
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
        count: orders.length
      };
    });
  };

  const orderData = calculateOrderCountByHour();
  const maxCount = Math.max(...orderData.map(d => d.count), 1);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Order Count Trend
        </CardTitle>
        <CardDescription>Number of orders by hour of day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2">
          {orderData.map((data, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="bg-green-500 rounded-t w-8 transition-all duration-300 hover:bg-green-600"
                style={{ height: `${(data.count / maxCount) * 200}px` }}
              ></div>
              <div className="text-xs text-gray-500">
                {data.hour}
              </div>
              <div className="text-xs font-medium">{data.count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
