'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  User,
  Calendar,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getOrdersByRestaurant } from '@/lib/firestore';

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
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-800', icon: Clock },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  delivered: { label: 'Delivered', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export function AllOrdersList() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [displayLimit, setDisplayLimit] = useState(20);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;
      
      try {
        const restaurantOrders = await getOrdersByRestaurant(currentRestaurant.id);
        // Convert Firestore Timestamps to JavaScript Dates for the component
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
  }, [user?.uid, currentRestaurant?.id]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      order.tableId.includes(searchTerm) ||
      order.id.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
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
    
    return matchesSearch && matchesStatus && matchesDate;
  }).slice(0, displayLimit);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
    ));
  };

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


  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
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
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>

      {/* Orders Summary */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">
              Showing {filteredOrders.length} of {orders.length} orders
            </h3>
            <p className="text-sm text-gray-600">
              {statusFilter !== 'all' && `Filtered by: ${statusFilter}`}
              {dateFilter !== 'all' && ` • Date: ${dateFilter}`}
              {searchTerm && ` • Searching for: "${searchTerm}"`}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Orders will appear here when customers place them.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">Order #{order.id}</CardTitle>
                      <CardDescription className="text-sm">
                        Table {order.tableId} • {getTimeAgo(order.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <Badge className={`${statusConfig[order.status].color} text-xs`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[order.status].label}
                      </Badge>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Customer</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {order.customerName || 'Walk-in Customer'}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {order.paymentMethod.toUpperCase()} • {order.isPaid ? 'Paid' : 'Unpaid'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {order.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total & Actions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Total</h4>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        ${(order.total + order.tip).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        Subtotal: ${order.total.toFixed(2)} + Tip: ${order.tip.toFixed(2)}
                      </div>
                      
                      <div className="space-y-2">
                        {order.status === 'pending' && (
                          <Button 
                            className="w-full" 
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                          >
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button 
                            className="w-full" 
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button 
                            className="w-full" 
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                          >
                            Mark Delivered
                          </Button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <Button 
                            variant="outline" 
                            className="w-full text-red-600 hover:text-red-700"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> {order.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
        
        {/* Show More Button */}
        {filteredOrders.length === displayLimit && displayLimit < orders.length && (
          <div className="text-center py-4">
            <Button 
              variant="outline" 
              onClick={() => setDisplayLimit(prev => prev + 20)}
            >
              Show More Orders ({orders.length - displayLimit} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
