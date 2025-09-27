'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/components/dashboard/types';
import { TrendingUp, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RevenueByDatesProps {
  analytics: AnalyticsData;
}

export function RevenueByDates({ analytics }: RevenueByDatesProps) {
  const { t } = useLanguage();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Generate revenue data for the last 7 days
  const generateRevenueData = () => {
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate realistic revenue data based on analytics
      const baseRevenue = analytics.revenue.current / 7;
      const variance = Math.random() * 0.4 + 0.8; // 80-120% of base
      const revenue = Math.round(baseRevenue * variance);

      data.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        fullDate: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        revenue: revenue,
        orders: Math.round(revenue / (analytics.averageOrder.current || 50))
      });
    }

    return data;
  };

  const revenueData = generateRevenueData();
  const totalWeekRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const avgDailyRevenue = Math.round(totalWeekRevenue / 7);
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              {t('dashboard.revenueByDates.title')}
            </CardTitle>
            <CardDescription>{t('dashboard.revenueByDates.description')}</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
              <DollarSign className="h-5 w-5" />
              {avgDailyRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">{t('dashboard.revenueByDates.avgPerDay')}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Custom Bar Chart */}
        <div className="relative">
          <div className="flex items-end justify-between gap-2 h-64 mb-4">
            {revenueData.map((day, index) => {
              const height = (day.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  {/* Tooltip */}
                  {hoveredBar === index && (
                    <div className="absolute -top-16 bg-gray-900 text-white p-2 rounded-md shadow-lg text-xs whitespace-nowrap z-10">
                      <div className="font-medium">{day.fullDate}</div>
                      <div className="text-green-300">{t('dashboard.revenueByDates.revenue')}: ${day.revenue.toLocaleString()}</div>
                      <div className="text-blue-300">{t('dashboard.revenueByDates.orders')}: {day.orders}</div>
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className="w-full bg-green-500 rounded-t transition-all duration-200 hover:bg-green-600 cursor-pointer"
                    style={{ height: `${height}%` }}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  />

                  {/* Date Label */}
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    {day.date}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 -ml-12">
            <span>${Math.round(maxRevenue).toLocaleString()}</span>
            <span>${Math.round(maxRevenue * 0.75).toLocaleString()}</span>
            <span>${Math.round(maxRevenue * 0.5).toLocaleString()}</span>
            <span>${Math.round(maxRevenue * 0.25).toLocaleString()}</span>
            <span>$0</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              ${totalWeekRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{t('dashboard.revenueByDates.thisWeek')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              ${maxRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{t('dashboard.revenueByDates.bestDay')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {revenueData.reduce((sum, day) => sum + day.orders, 0)}
            </div>
            <div className="text-sm text-gray-600">{t('dashboard.revenueByDates.totalOrders')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}