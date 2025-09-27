'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { AnalyticsData } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface HourlyActivityProps {
  analytics: AnalyticsData;
}

export function HourlyActivity({ analytics }: HourlyActivityProps) {
  const { t } = useLanguage();
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
  const maxOrders = Math.max(...hourlyData.map(d => d.orders), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          {t('dashboard.hourlyActivity.title')}
        </CardTitle>
        <CardDescription>{t('dashboard.hourlyActivity.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {hourlyData.map((data, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-12 text-xs text-gray-500">{data.hour}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(data.orders / maxOrders) * 100}%` }}
                ></div>
              </div>
              <div className="w-6 text-xs text-gray-500">{data.orders}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
