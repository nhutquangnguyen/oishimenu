'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Menu, 
  Users, 
  DollarSign, 
  TrendingUp,
  Settings,
  BarChart3,
  ShoppingCart,
  Clock,
  Star
} from 'lucide-react';

interface MerchantStats {
  totalOrders: number;
  totalRevenue: number;
  activeMenuItems: number;
  customerRating: number;
  todayOrders: number;
  todayRevenue: number;
}

export default function MerchantDashboard() {
  const params = useParams();
  const merchantId = params.merchantId as string;
  const [merchant, setMerchant] = useState<any>(null);
  const [stats, setStats] = useState<MerchantStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeMenuItems: 0,
    customerRating: 0,
    todayOrders: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMerchant = {
      id: merchantId,
      name: merchantId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      shortName: merchantId,
      description: 'Your restaurant dashboard',
      location: 'Your City, State',
      logo: '🍽️'
    };
    
    const mockStats: MerchantStats = {
      totalOrders: 1250,
      totalRevenue: 45600,
      activeMenuItems: 24,
      customerRating: 4.8,
      todayOrders: 45,
      todayRevenue: 1800
    };

    setMerchant(mockMerchant);
    setStats(mockStats);
  }, [merchantId]);

  const quickActions = [
    {
      title: 'Manage Menu',
      description: 'Add, edit, or remove menu items',
      icon: Menu,
      href: `/merchant/${merchantId}/menu`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'View Orders',
      description: 'Track and manage orders',
      icon: ShoppingCart,
      href: `/merchant/${merchantId}/orders`,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Analytics',
      description: 'View performance metrics',
      icon: BarChart3,
      href: `/merchant/${merchantId}/analytics`,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Settings',
      description: 'Configure your restaurant',
      icon: Settings,
      href: `/merchant/${merchantId}/settings`,
      color: 'from-gray-500 to-gray-600'
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', items: 3, total: 45.50, status: 'completed', time: '2 min ago' },
    { id: 'ORD-002', customer: 'Jane Smith', items: 2, total: 32.00, status: 'preparing', time: '5 min ago' },
    { id: 'ORD-003', customer: 'Mike Johnson', items: 1, total: 18.75, status: 'pending', time: '8 min ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">{merchant?.logo}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{merchant?.name}</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Star className="w-3 h-3 mr-1" />
                {stats.customerRating}
              </Badge>
              <Button 
                variant="outline"
                onClick={() => window.location.href = 'https://oishimenu.com'}
              >
                Back to Main Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menu Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeMenuItems}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Menu className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.customerRating}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Today's Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Orders Today</span>
                  <span className="font-semibold">{stats.todayOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue Today</span>
                  <span className="font-semibold">${stats.todayRevenue}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">${order.total}</p>
                      <Badge 
                        variant={order.status === 'completed' ? 'default' : order.status === 'preparing' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your restaurant efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-lg transition-all duration-300"
                    onClick={() => window.location.href = action.href}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">{action.title}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
