'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  DollarSign,
  CreditCard,
  Receipt,
  Calendar,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { OrderItemManager, OrderItem } from './OrderItemManager';
import { updateOrderStatus, FirestoreOrder } from '@/lib/firestore';

interface OrderDetailsDialogProps {
  order: FirestoreOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: () => void;
  isEditable?: boolean;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-800', icon: Clock },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  delivered: { label: 'Delivered', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const paymentMethodConfig = {
  cash: { label: 'Cash', icon: DollarSign },
  card: { label: 'Card', icon: CreditCard },
  digital: { label: 'Digital Wallet', icon: CreditCard },
};

export function OrderDetailsDialog({ order, isOpen, onClose, onOrderUpdated, isEditable = true }: OrderDetailsDialogProps) {
  const { t } = useLanguage();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (order) {
      setOrderItems(order.items.map(item => ({
        ...item,
        isCompleted: item.isCompleted || false,
        completedQuantity: item.completedQuantity || 0
      })));
    }
  }, [order]);

  if (!order) return null;

  const handleStatusUpdate = async (newStatus: FirestoreOrder['status']) => {
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(order.id!, newStatus);
      onOrderUpdated();
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleItemsUpdated = () => {
    onOrderUpdated();
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  const getPaymentIcon = (method: string) => {
    const config = paymentMethodConfig[method as keyof typeof paymentMethodConfig];
    const IconComponent = config?.icon || DollarSign;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5" />
            <span>Order Details - #{order.id?.slice(-8)}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
          {/* Order Information */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Order Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Table</label>
                  <p className="font-medium">{order.tableId}</p>
                </div>

                {order.customerName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer</label>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={statusConfig[order.status].color}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{statusConfig[order.status].label}</span>
                    </Badge>
                    {isEditable && (
                      <Select value={order.status} onValueChange={handleStatusUpdate} disabled={isUpdatingStatus}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getPaymentIcon(order.paymentMethod)}
                    <span>{paymentMethodConfig[order.paymentMethod].label}</span>
                    <Badge variant={order.isPaid ? "default" : "secondary"}>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm">{formatDate(order.updatedAt)}</p>
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-sm bg-gray-50 p-2 rounded">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Total */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Order Total</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                {order.tip > 0 && (
                  <div className="flex justify-between">
                    <span>Tip</span>
                    <span>${order.tip.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(order.total + order.tip).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <div className="lg:col-span-3 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Edit3 className="w-4 h-4" />
                  <span>Order Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <OrderItemManager
                  orderId={order.id!}
                  items={orderItems}
                  onItemsUpdated={handleItemsUpdated}
                  isEditable={isEditable}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isEditable && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Button
              onClick={() => handleStatusUpdate('delivered')}
              disabled={isUpdatingStatus}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdatingStatus ? 'Updating...' : 'Mark as Delivered'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}