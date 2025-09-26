'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Table, Calendar } from 'lucide-react';

interface Order {
  id: string;
  tableId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface AdminUserOrdersProps {
  orders: Order[];
}

export function AdminUserOrders({ orders }: AdminUserOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Recent Orders ({orders.length})
        </CardTitle>
        <CardDescription>
          Orders placed by this user
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders found</p>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 10).map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Table className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Table {order.tableId}</span>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                    <p className="text-sm text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
            {orders.length > 10 && (
              <p className="text-center text-gray-500 text-sm">
                Showing 10 of {orders.length} orders
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
