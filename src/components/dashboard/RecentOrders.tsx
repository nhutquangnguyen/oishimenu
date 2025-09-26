'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from './types';

interface RecentOrdersProps {
  analytics: AnalyticsData;
}

export function RecentOrders({ analytics }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analytics.recentOrders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-500">Table {order.tableId} • {order.customerName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500 capitalize">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
