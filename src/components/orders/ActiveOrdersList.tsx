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
  Minus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import {
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
  isCompleted?: boolean; // Track if the item is completed/prepared
}

const getStatusConfig = (t: (key: string) => string) => ({
  pending: { label: t('orders.status.pending'), color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  preparing: { label: t('orders.status.preparing'), color: 'bg-blue-100 text-blue-800', icon: ChefHat },
  ready: { label: t('orders.status.ready'), color: 'bg-green-100 text-green-800', icon: CheckCircle },
  delivered: { label: t('orders.status.delivered'), color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  cancelled: { label: t('orders.status.cancelled'), color: 'bg-red-100 text-red-800', icon: XCircle },
});

export function ActiveOrdersList() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [tableTypeFilter, setTableTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<FirestoreOrder | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [addingItemToOrder, setAddingItemToOrder] = useState<string | null>(null);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [menuSearchTerm, setMenuSearchTerm] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;
      
      try {
        setLoading(true);
        const restaurantOrders = await getActiveOrdersByRestaurant(currentRestaurant.id);
        // Convert Firestore Timestamps to JavaScript Dates for the component
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

  // Load menu items
  useEffect(() => {
    const loadMenuItems = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;

      try {
        const menuCategories = await getMenuItems(currentRestaurant.id, user.uid);
        console.log('Loaded menu categories:', menuCategories);

        if (menuCategories && menuCategories.length > 0) {
          const allItems: MenuItem[] = [];
          menuCategories.forEach((category: any) => {
            console.log('Processing category:', category);
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
          console.log('Converted menu items:', allItems);
          setMenuItems(allItems);
        }
      } catch (error) {
        console.error('Failed to load menu items:', error);
      }
    };

    loadMenuItems();
  }, [user?.uid, currentRestaurant?.id]);

  // Group menu items by category (similar to POS)
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Filter for active orders (not delivered or cancelled)
  const activeOrders = orders.filter(order =>
    order.status !== 'delivered' && order.status !== 'cancelled'
  );

  const filteredOrders = activeOrders.filter(order => {
    const matchesSearch =
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      order.tableId.includes(searchTerm) ||
      order.id.includes(searchTerm);

    const matchesStatus = statusFilter === 'active' || order.status === statusFilter;

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
  });

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    // Convert the local Order type to FirestoreOrder type for the dialog
    const firestoreOrder: FirestoreOrder = {
      ...order,
      createdAt: { toDate: () => order.createdAt } as any,
      updatedAt: { toDate: () => order.updatedAt } as any,
      userId: user?.uid || '',
      restaurantId: currentRestaurant?.id || ''
    };
    setSelectedOrder(firestoreOrder);
    setIsDetailsDialogOpen(true);
  };

  const handleOrderUpdated = async () => {
    // Reload orders when an order is updated
    if (!user?.uid || !currentRestaurant?.id) return;

    try {
      setLoading(true);
      const restaurantOrders = await getActiveOrdersByRestaurant(currentRestaurant.id);
      const convertedOrders = restaurantOrders.map(order => ({
        ...order,
        createdAt: order.createdAt.toDate(),
        updatedAt: order.updatedAt.toDate()
      }));
      setOrders(convertedOrders);
    } catch (error) {
      console.error('Error reloading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemCompletion = async (orderId: string, itemId: string, currentStatus: boolean) => {
    try {
      await updateOrderItemCompletion(orderId, itemId, !currentStatus);

      // Update the local state to reflect the change immediately
      setOrders(orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            items: order.items.map(item =>
              item.id === itemId ? { ...item, isCompleted: !currentStatus } : item
            )
          };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating item completion:', error);
    }
  };

  const handleRemoveItem = async (orderId: string, itemId: string) => {
    try {
      await removeItemFromOrder(orderId, itemId);

      // Update local state immediately
      setOrders(orders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.items.filter(item => item.id !== itemId);
          const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return {
            ...order,
            items: updatedItems,
            total: newTotal
          };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleAddItem = async (orderId: string) => {
    if (!selectedMenuItem) return;

    try {
      const newItem: FirestoreOrderItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: selectedMenuItem.name,
        price: selectedMenuItem.price,
        quantity: quantity,
        category: selectedMenuItem.category,
        specialInstructions: specialInstructions || null,
        isCompleted: false,
        completedQuantity: 0
      };

      await addItemToOrder(orderId, newItem);

      // Update local state immediately
      setOrders(orders.map(order => {
        if (order.id === orderId) {
          const updatedItems = [...order.items, newItem];
          const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return {
            ...order,
            items: updatedItems,
            total: newTotal
          };
        }
        return order;
      }));

      // Reset form and close
      setSelectedMenuItem(null);
      setQuantity(1);
      setSpecialInstructions('');
      setMenuSearchTerm('');
      setIsAddItemDialogOpen(false);
      setAddingItemToOrder(null);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const openAddItemDialog = (orderId: string) => {
    setAddingItemToOrder(orderId);
    setIsAddItemDialogOpen(true);
  };

  const handleUpdateQuantity = async (orderId: string, itemId: string, newQuantity: number) => {
    try {
      await updateOrderItemQuantity(orderId, itemId, newQuantity);

      // Update local state immediately
      setOrders(orders.map(order => {
        if (order.id === orderId) {
          const updatedItems = newQuantity <= 0
            ? order.items.filter(item => item.id !== itemId)
            : order.items.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
              );
          const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return {
            ...order,
            items: updatedItems,
            total: newTotal
          };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleUpdateCompletedQuantity = async (orderId: string, itemId: string, completedQuantity: number) => {
    try {
      await updateOrderItemCompletedQuantity(orderId, itemId, completedQuantity);
      // Update local state immediately
      setOrders(orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            items: order.items.map(item => {
              if (item.id === itemId) {
                const isCompleted = completedQuantity === item.quantity;
                return { ...item, completedQuantity, isCompleted };
              }
              return item;
            })
          };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating completed quantity:', error);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t('orders.time.justNow');
    if (diffInMinutes < 60) return t('orders.time.minutesAgo').replace('{minutes}', diffInMinutes.toString());

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return t('orders.time.hoursAgo').replace('{hours}', diffInHours.toString());

    const diffInDays = Math.floor(diffInHours / 24);
    return t('orders.time.daysAgo').replace('{days}', diffInDays.toString());
  };

  const getUrgencyLevel = (order: Order) => {
    const minutesSinceOrder = Math.floor((new Date().getTime() - order.createdAt.getTime()) / (1000 * 60));
    if (minutesSinceOrder > 30) return 'high';
    if (minutesSinceOrder > 15) return 'medium';
    return 'low';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('orders.loadingActiveOrders')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Staff-focused Header */}
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

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t('orders.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t('orders.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t('orders.filter.allActive')}</SelectItem>
              <SelectItem value="pending">{t('orders.status.pending')}</SelectItem>
              <SelectItem value="preparing">{t('orders.status.preparing')}</SelectItem>
              <SelectItem value="ready">{t('orders.status.ready')}</SelectItem>
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
              <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('orders.noActiveOrders')}</h3>
              <p className="text-gray-500">{t('orders.allCaughtUp')}</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders
            .sort((a, b) => {
              // Sort by urgency first, then by creation time
              const urgencyA = getUrgencyLevel(a);
              const urgencyB = getUrgencyLevel(b);
              const urgencyOrder = { high: 3, medium: 2, low: 1 };
              
              if (urgencyOrder[urgencyA] !== urgencyOrder[urgencyB]) {
                return urgencyOrder[urgencyB] - urgencyOrder[urgencyA];
              }
              
              return b.createdAt.getTime() - a.createdAt.getTime();
            })
            .map((order) => {
              const statusConfig = getStatusConfig(t);
              const StatusIcon = statusConfig[order.status].icon;
              const urgency = getUrgencyLevel(order);
              const urgencyColor = getUrgencyColor(urgency);
              
              return (
                <Card 
                  key={order.id} 
                  className={`hover:shadow-md transition-shadow border-l-4 ${urgencyColor}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                          <span className="truncate">Order #{order.id}</span>
                          {urgency === 'high' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                          {urgency === 'medium' && <Timer className="w-4 h-4 text-yellow-500 flex-shrink-0" />}

                          {/* Progress Indicator */}
                          {(() => {
                            // Calculate progress based on completed quantities
                            const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
                            const completedQuantity = order.items.reduce((sum, item) => sum + (item.completedQuantity || 0), 0);
                            const percentage = totalQuantity > 0 ? Math.round((completedQuantity / totalQuantity) * 100) : 0;
                            const completedItems = order.items.filter(item => item.isCompleted).length;
                            const totalItems = order.items.length;

                            return (
                              <div className="flex items-center space-x-2 ml-2">
                                <div className="text-xs text-gray-500 font-medium">
                                  {completedQuantity}/{totalQuantity} items ({completedItems}/{totalItems} types)
                                </div>
                                <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{percentage}%</span>
                              </div>
                            );
                          })()}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          Table {order.tableId} • {getTimeAgo(order.createdAt)}
                          {urgency === 'high' && <span className="text-red-600 font-semibold ml-2">⚠️ URGENT</span>}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <Badge className={`${statusConfig[order.status].color} text-xs`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handleViewOrderDetails(order)}
                        >
                          <Eye className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">View Details</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Customer
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>{order.customerName || 'Walk-in Customer'}</div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {order.paymentMethod.toUpperCase()} • {order.isPaid ? 'Paid' : 'Unpaid'}
                          </div>
                        </div>
                      </div>

                      {/* Detailed Order Items - Staff Focus */}
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Utensils className="w-4 h-4 mr-2" />
                          Order Details
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className={`flex items-start p-3 rounded-lg border transition-all ${
                              item.isCompleted
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}>
                              {/* Completion Toggle */}
                              <button
                                onClick={() => handleItemCompletion(order.id, item.id, item.isCompleted || false)}
                                className="p-1 rounded-full hover:bg-white/50 transition-colors mr-3 mt-1 flex-shrink-0"
                              >
                                {item.isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                )}
                              </button>

                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleUpdateQuantity(order.id, item.id, item.quantity - 1)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="font-medium text-sm w-6 text-center">{item.quantity}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleUpdateQuantity(order.id, item.id, item.quantity + 1)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>

                                  <span className={`font-semibold ${
                                    item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                                  }`}>
                                    {item.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {item.category}
                                  </Badge>
                                  {(item.completedQuantity || 0) > 0 && (
                                    <Badge className={`text-xs ${
                                      item.isCompleted
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {item.isCompleted
                                        ? '✓ Done'
                                        : `${item.completedQuantity}/${item.quantity} done`
                                      }
                                    </Badge>
                                  )}
                                </div>
                                {item.specialInstructions && (
                                  <div className="text-sm text-orange-600 mt-1 flex items-start">
                                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
                                    <span className="font-medium">Special: {item.specialInstructions}</span>
                                  </div>
                                )}
                                {/* Completion Controls for multiple quantity items */}
                                {item.quantity > 1 && (
                                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                                    <span className="text-xs text-gray-500 font-medium">Completed:</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleUpdateCompletedQuantity(order.id, item.id, Math.max(0, (item.completedQuantity || 0) - 1))}
                                      disabled={(item.completedQuantity || 0) <= 0}
                                      className="h-5 w-5 p-0"
                                    >
                                      <Minus className="w-2 h-2" />
                                    </Button>
                                    <span className="text-xs font-semibold w-8 text-center">
                                      {item.completedQuantity || 0}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleUpdateCompletedQuantity(order.id, item.id, Math.min(item.quantity, (item.completedQuantity || 0) + 1))}
                                      disabled={(item.completedQuantity || 0) >= item.quantity}
                                      className="h-5 w-5 p-0"
                                    >
                                      <Plus className="w-2 h-2" />
                                    </Button>
                                    <span className="text-xs text-gray-500">
                                      ({item.quantity - (item.completedQuantity || 0)} remaining)
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Price and Remove */}
                              <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                                <div className="text-right">
                                  <div className="font-semibold text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ${item.price.toFixed(2)} each
                                  </div>
                                </div>

                                {/* Remove Button */}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveItem(order.id, item.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          {/* Add Item Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAddItemDialog(order.id)}
                            className="w-full mt-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item from Menu
                          </Button>
                        </div>
                      </div>

                      {/* Actions & Total */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Total & Actions</h4>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          ${(order.total + order.tip).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          Subtotal: ${order.total.toFixed(2)} + Tip: ${order.tip.toFixed(2)}
                        </div>
                        
                        <div className="space-y-2">
                          {order.status === 'pending' && (
                            <Button 
                              className="w-full bg-blue-600 hover:bg-blue-700" 
                              onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                            >
                              <ChefHat className="w-4 h-4 mr-2" />
                              Start Cooking
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700" 
                              onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Ready
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button 
                              className="w-full bg-gray-600 hover:bg-gray-700" 
                              onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Delivered
                            </Button>
                          )}
                          {order.status !== 'delivered' && (
                            <Button 
                              variant="outline" 
                              className="w-full text-red-600 hover:text-red-700 border-red-300"
                              onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Kitchen Note:</strong> {order.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
        )}
      </div>

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

      {/* Add Item Dialog - POS Style */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Item from Menu</span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Menu Items Section - POS Style */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Menu Items</CardTitle>
                  <CardDescription>Select items to add to the order</CardDescription>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search menu items..."
                      value={menuSearchTerm}
                      onChange={(e) => setMenuSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {Object.keys(groupedMenuItems).length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🍽️</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Menu Items</h3>
                      <p className="text-gray-500 mb-4">No menu items are available.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-96 overflow-y-auto">
                      {Object.entries(groupedMenuItems)
                        .filter(([category, items]) =>
                          items.some(item =>
                            item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
                            category.toLowerCase().includes(menuSearchTerm.toLowerCase())
                          )
                        )
                        .map(([category, items]) => (
                          <div key={category}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                              {items
                                .filter(item =>
                                  item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
                                  category.toLowerCase().includes(menuSearchTerm.toLowerCase())
                                )
                                .map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => setSelectedMenuItem(item)}
                                    className={`p-3 border rounded-lg text-left transition-colors min-h-[100px] flex flex-col justify-between ${
                                      selectedMenuItem?.id === item.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex flex-col h-full">
                                      <div className="flex items-center justify-center mb-2">
                                        {item.emoji && <span className="text-2xl">{item.emoji}</span>}
                                      </div>
                                      <div className="text-center flex-1">
                                        <div className="font-medium text-sm mb-1 line-clamp-2">{item.name}</div>
                                        <div className="text-sm text-gray-500 mb-2">{item.category}</div>
                                        <div className="font-bold text-green-600">${item.price.toFixed(2)}</div>
                                      </div>
                                      <div className="flex justify-center mt-2">
                                        <Plus className="w-4 h-4 text-gray-400" />
                                      </div>
                                    </div>
                                  </button>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Selected Item & Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Item</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMenuItem ? (
                    <div className="space-y-4">
                      {/* Item Details */}
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-center space-x-3 mb-3">
                          {selectedMenuItem.emoji && (
                            <span className="text-2xl">{selectedMenuItem.emoji}</span>
                          )}
                          <div>
                            <h3 className="font-semibold">{selectedMenuItem.name}</h3>
                            <p className="text-sm text-gray-600">{selectedMenuItem.category}</p>
                            <p className="text-lg font-bold text-green-600">
                              ${selectedMenuItem.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {selectedMenuItem.description && (
                          <p className="text-sm text-gray-600 mb-3">{selectedMenuItem.description}</p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              disabled={quantity <= 1}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center font-semibold">{quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setQuantity(quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Special Instructions */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Special Instructions (optional)
                          </label>
                          <Input
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            placeholder="e.g., No onions, extra sauce..."
                          />
                        </div>

                        {/* Total */}
                        <div className="pt-3 border-t mt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total:</span>
                            <span className="text-xl font-bold text-green-600">
                              ${(selectedMenuItem.price * quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Select an item from the menu</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddItemDialogOpen(false);
                    setSelectedMenuItem(null);
                    setQuantity(1);
                    setSpecialInstructions('');
                    setMenuSearchTerm('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => addingItemToOrder && handleAddItem(addingItemToOrder)}
                  disabled={!selectedMenuItem}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Add to Order
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
