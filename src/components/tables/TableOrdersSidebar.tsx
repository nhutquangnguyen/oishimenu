'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Receipt
} from 'lucide-react';
import { Table, Order } from './types';
import { statusConfig } from './constants';

interface TableOrdersSidebarProps {
  selectedTable: Table;
  selectedTableOrders: Order[];
  onClose: () => void;
}

export function TableOrdersSidebar({ 
  selectedTable, 
  selectedTableOrders, 
  onClose 
}: TableOrdersSidebarProps) {

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const totalRevenue = selectedTableOrders.reduce((sum, order) => sum + order.total + order.tip, 0);

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Table {selectedTable.number} - {selectedTable.area}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedTableOrders.length} orders • ${totalRevenue.toFixed(2)} total
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {selectedTableOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500">Orders for this table will appear here when customers place them.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {selectedTableOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription>
                        {order.customerName || 'Walk-in Customer'} • {getTimeAgo(order.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusConfig[order.status].color}>
                        {statusConfig[order.status].label}
                      </Badge>
                      <div className="text-right">
                        <div className="font-semibold">${(order.total + order.tip).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">
                          {order.paymentMethod.toUpperCase()} • {order.isPaid ? 'Paid' : 'Unpaid'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{item.quantity}x</span>
                              <span>{item.name}</span>
                              {item.specialInstructions && (
                                <Badge variant="outline" className="text-xs">
                                  {item.specialInstructions}
                                </Badge>
                              )}
                            </div>
                            <span className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {order.notes && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> {order.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
