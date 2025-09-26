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
  Phone,
  ChefHat,
  Timer,
  AlertCircle,
  Star,
  Utensils
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getActiveOrdersByRestaurant, updateOrderStatus } from '@/lib/firestore';

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
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-800', icon: ChefHat },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  delivered: { label: 'Delivered', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export function ActiveOrdersList() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');

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
    
    return matchesSearch && matchesStatus;
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
          <p className="text-gray-600">Loading active orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Staff-focused Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Kitchen Dashboard</h2>
            <p className="text-blue-700 text-sm">Active orders requiring attention</p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High Priority ({filteredOrders.filter(o => getUrgencyLevel(o) === 'high').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium Priority ({filteredOrders.filter(o => getUrgencyLevel(o) === 'medium').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Low Priority ({filteredOrders.filter(o => getUrgencyLevel(o) === 'low').length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by table, customer, or order ID..."
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
            <SelectItem value="active">All Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No active orders</h3>
              <p className="text-gray-500">All caught up! New orders will appear here.</p>
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
              const StatusIcon = statusConfig[order.status].icon;
              const urgency = getUrgencyLevel(order);
              const urgencyColor = getUrgencyColor(urgency);
              
              return (
                <Card 
                  key={order.id} 
                  className={`hover:shadow-md transition-shadow border-l-4 ${urgencyColor}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>Order #{order.id}</span>
                            {urgency === 'high' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            {urgency === 'medium' && <Timer className="w-4 h-4 text-yellow-500" />}
                          </CardTitle>
                          <CardDescription>
                            Table {order.tableId} • {getTimeAgo(order.createdAt)}
                            {urgency === 'high' && <span className="text-red-600 font-semibold ml-2">⚠️ URGENT</span>}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={statusConfig[order.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                            <div key={item.id} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{item.quantity}x</span>
                                  <span className="font-semibold">{item.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {item.category}
                                  </Badge>
                                </div>
                                {item.specialInstructions && (
                                  <div className="text-sm text-orange-600 mt-1 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    <span className="font-medium">Special: {item.specialInstructions}</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                              </div>
                            </div>
                          ))}
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
    </div>
  );
}
