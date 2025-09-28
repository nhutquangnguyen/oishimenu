'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Search,
  Clock,
  CheckCircle,
  CheckCircle2,
  Circle,
  XCircle,
  Eye,
  DollarSign,
  User,
  Phone,
  ChefHat,
  Timer,
  AlertCircle,
  Star,
  Utensils,
  Plus,
  Trash2,
  Minus,
  MapPin,
  Calendar,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import {
  getOrdersByRestaurant,
  getActiveOrdersByRestaurant,
  updateOrderStatus,
  updateOrderItemCompletion,
  addItemToOrder,
  removeItemFromOrder,
  updateOrderItemQuantity,
  updateOrderItemCompletedQuantity,
  getMenuItems,
  FirestoreOrder,
  FirestoreOrderItem
} from '@/lib/firestore';
import { useLanguage } from '@/contexts/LanguageContext';
import { OrderDetailsDialog } from './OrderDetailsDialog';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji?: string;
  description?: string;
}

export interface Order {
  id: string;
  tableId: string;
  customerName?: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  tip: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  paymentMethod: 'cash' | 'card' | 'digital';
  isPaid: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  category: string;
  isCompleted?: boolean;
  completedQuantity?: number;
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
  card: { label: 'Card', icon: DollarSign },
  digital: { label: 'Digital Wallet', icon: DollarSign },
};

export function UnifiedOrdersList() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [tableTypeFilter, setTableTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [displayLimit, setDisplayLimit] = useState(20);

  // Dialog state
  const [selectedOrder, setSelectedOrder] = useState<FirestoreOrder | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [addingItemToOrder, setAddingItemToOrder] = useState<string | null>(null);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;

      try {
        setLoading(true);
        const restaurantOrders = await getOrdersByRestaurant(currentRestaurant.id);
        // Convert Firestore Timestamps to JavaScript Dates
        const convertedOrders = restaurantOrders.map(order => ({
          ...order,
          createdAt: order.createdAt.toDate(),
          updatedAt: order.updatedAt.toDate()
        }));
        setOrders(convertedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.uid, currentRestaurant?.id]);

  // Load menu items for adding items to orders
  useEffect(() => {
    const loadMenuItems = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;

      try {
        const menuCategories = await getMenuItems(currentRestaurant.id, user.uid);
        if (menuCategories && menuCategories.length > 0) {
          const allItems: MenuItem[] = [];
          menuCategories.forEach((category: any) => {
            if (category.items) {
              category.items.forEach((item: any) => {
                allItems.push({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  category: category.name,
                  emoji: item.emoji || '🍽️',
                  description: item.description
                });
              });
            }
          });
          setMenuItems(allItems);
        }
      } catch (error) {
        console.error('Failed to load menu items:', error);
      }
    };

    loadMenuItems();
  }, [user?.uid, currentRestaurant?.id]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      order.tableId.includes(searchTerm) ||
      order.id.includes(searchTerm);

    const matchesStatus = (() => {
      if (statusFilter === 'active') {
        return order.status !== 'delivered' && order.status !== 'cancelled';
      }
      if (statusFilter === 'all') {
        return true;
      }
      return order.status === statusFilter;
    })();

    const matchesTableType = tableTypeFilter === 'all' ||
      (order as any).tableType === tableTypeFilter ||
      (tableTypeFilter === 'dine-in' && !(order as any).tableType); // Legacy orders without tableType

    const matchesDate = (() => {
      const now = new Date();
      const orderDate = order.createdAt;

      switch (dateFilter) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesTableType && matchesDate;
  }).slice(0, displayLimit);

  // Helper functions
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

  const getUrgencyLevel = (order: Order) => {
    const now = new Date();
    const timeDiff = now.getTime() - order.createdAt.getTime();
    const minutesOld = Math.floor(timeDiff / (1000 * 60));

    if (order.status === 'ready') return 'high';
    if (minutesOld > 30) return 'high';
    if (minutesOld > 15) return 'medium';
    return 'low';
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleToggleItemCompletion = async (orderId: string, itemId: string, currentStatus: boolean) => {
    try {
      await updateOrderItemCompletion(orderId, itemId, !currentStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? {
          ...order,
          items: order.items.map(item =>
            item.id === itemId ? { ...item, isCompleted: !currentStatus } : item
          )
        } : order
      ));
    } catch (error) {
      console.error('Failed to toggle item completion:', error);
    }
  };

  const handleOrderUpdated = () => {
    // Reload orders after update
    const loadOrders = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;
      try {
        const restaurantOrders = await getOrdersByRestaurant(currentRestaurant.id);
        const convertedOrders = restaurantOrders.map(order => ({
          ...order,
          createdAt: order.createdAt.toDate(),
          updatedAt: order.updatedAt.toDate()
        }));
        setOrders(convertedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };
    loadOrders();
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order as FirestoreOrder);
    setIsDetailsDialogOpen(true);
  };

  // Group menu items for add item dialog
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading orders...</div>
          <div className="text-sm text-gray-500">Please wait while we load your orders</div>
        </div>
      </div>
    );
  }

  // Active orders for kitchen dashboard header
  const activeOrders = orders.filter(order =>
    order.status !== 'delivered' && order.status !== 'cancelled'
  );

  const isActiveView = statusFilter === 'active';

  return (
    <div className="space-y-6">
      {/* Kitchen Dashboard Header (only for active orders) */}
      {isActiveView && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">{t('orders.kitchenDashboard')}</h2>
              <p className="text-blue-700 text-sm">{t('orders.kitchenDashboardDescription')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="hidden sm:inline">{t('orders.priority.high')} ({filteredOrders.filter(o => getUrgencyLevel(o) === 'high').length})</span>
                <span className="sm:hidden">{t('orders.priority.highShort')} ({filteredOrders.filter(o => getUrgencyLevel(o) === 'high').length})</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="hidden sm:inline">{t('orders.priority.medium')} ({filteredOrders.filter(o => getUrgencyLevel(o) === 'medium').length})</span>
                <span className="sm:hidden">{t('orders.priority.mediumShort')} ({filteredOrders.filter(o => getUrgencyLevel(o) === 'medium').length})</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="hidden sm:inline">{t('orders.priority.low')} ({filteredOrders.filter(o => getUrgencyLevel(o) === 'low').length})</span>
                <span className="sm:hidden">{t('orders.priority.lowShort')} ({filteredOrders.filter(o => getUrgencyLevel(o) === 'low').length})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search orders by customer, table, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Orders</SelectItem>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tableTypeFilter} onValueChange={setTableTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="dine-in">Dine In</SelectItem>
              <SelectItem value="takeaway">Takeaway</SelectItem>
              <SelectItem value="grab">Grab</SelectItem>
              <SelectItem value="shopee">Shopee Food</SelectItem>
              <SelectItem value="foodpanda">FoodPanda</SelectItem>
              <SelectItem value="gojek">GoJek</SelectItem>
              <SelectItem value="custom">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || tableTypeFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Orders will appear here when customers place them.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = statusInfo.icon;
            const urgencyLevel = getUrgencyLevel(order);

            return (
              <Card
                key={order.id}
                className={`hover:shadow-md transition-shadow ${
                  isActiveView && urgencyLevel === 'high' ? 'border-red-300 bg-red-50' :
                  isActiveView && urgencyLevel === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                  'border-gray-200'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">Order #{order.id.slice(-8)}</CardTitle>
                      <CardDescription className="text-sm">
                        Table {order.tableId} • {getTimeAgo(order.createdAt)}
                        {order.customerName && ` • ${order.customerName}`}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <Badge className={`${statusInfo.color} text-xs`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="w-full sm:w-auto"
                      >
                        <Eye className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items with Kitchen View */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            item.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            {isActiveView && (
                              <button
                                onClick={() => handleToggleItemCompletion(order.id, item.id, item.isCompleted || false)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                {item.isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium ${item.isCompleted ? 'line-through text-gray-500' : ''}`}>
                                {item.quantity}× {item.name}
                              </div>
                              {item.specialInstructions && (
                                <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mt-1">
                                  <strong>Note:</strong> {item.specialInstructions}
                                </div>
                              )}
                              {(item.completedQuantity || 0) > 0 && item.quantity > 1 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.completedQuantity}/{item.quantity} completed
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                            <div className="text-xs text-gray-500">${item.price.toFixed(2)} each</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-3 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Payment: {paymentMethodConfig[order.paymentMethod].label}</span>
                        <Badge variant={order.isPaid ? "default" : "secondary"}>
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${((order.total || 0) + (order.tip || 0)).toFixed(2)}
                      </div>
                    </div>

                    {/* Quick Actions for Active Orders */}
                    {isActiveView && order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t">
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            className="bg-gray-600 hover:bg-gray-700"
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Show More Button */}
      {filteredOrders.length === displayLimit && orders.length > displayLimit && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setDisplayLimit(displayLimit + 20)}
          >
            <Download className="w-4 h-4 mr-2" />
            Show More Orders
          </Button>
        </div>
      )}

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedOrder(null);
        }}
        onOrderUpdated={handleOrderUpdated}
        isEditable={true}
      />
    </div>
  );
}