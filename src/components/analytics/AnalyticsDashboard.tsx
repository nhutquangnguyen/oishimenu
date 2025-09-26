'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Clock,
  Star,
  Download,
  Calendar
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    current: number;
    change: number;
  };
  orders: {
    current: number;
    change: number;
  };
  averageOrder: {
    current: number;
    change: number;
  };
  customers: {
    current: number;
    change: number;
  };
  topItems: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    timestamp: string;
  }>;
  insights: Array<{
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
  }>;
}

interface AnalyticsDashboardProps {
  data?: AnalyticsData;
  loading?: boolean;
}

export function AnalyticsDashboard({ data, loading = false }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('today');

  // Use provided data or show loading state
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">Loading analytics data...</div>
        </div>
      </div>
    );
  }

  const getPercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getChangeIcon = (current: number, previous: number) => {
    return current >= previous ? TrendingUp : TrendingDown;
  };

  const getChangeColor = (current: number, previous: number) => {
    return current >= previous ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="lastWeek">Last Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.revenue.current.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {(() => {
                const change = data.revenue.change;
                const Icon = change >= 0 ? TrendingUp : TrendingDown;
                const color = change >= 0 ? 'text-green-600' : 'text-red-600';
                return (
                  <>
                    <Icon className={`h-3 w-3 mr-1 ${color}`} />
                    <span className={color}>
                      {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="ml-1">from last period</span>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.orders.current}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {(() => {
                const change = data.orders.change;
                const Icon = change >= 0 ? TrendingUp : TrendingDown;
                const color = change >= 0 ? 'text-green-600' : 'text-red-600';
                return (
                  <>
                    <Icon className={`h-3 w-3 mr-1 ${color}`} />
                    <span className={color}>
                      {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="ml-1">from last period</span>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.customers.current}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {(() => {
                const change = data.customers.change;
                const Icon = change >= 0 ? TrendingUp : TrendingDown;
                const color = change >= 0 ? 'text-green-600' : 'text-red-600';
                return (
                  <>
                    <Icon className={`h-3 w-3 mr-1 ${color}`} />
                    <span className={color}>
                      {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="ml-1">from last period</span>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.averageOrder.current.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {(() => {
                const change = data.averageOrder.change;
                const Icon = change >= 0 ? TrendingUp : TrendingDown;
                const color = change >= 0 ? 'text-green-600' : 'text-red-600';
                return (
                  <>
                    <Icon className={`h-3 w-3 mr-1 ${color}`} />
                    <span className={color}>
                      {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="ml-1">from last period</span>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Items</CardTitle>
            <CardDescription>Most ordered items this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>AI-powered recommendations for your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.insights.map((insight, index) => (
              <div key={index} className={`flex items-start space-x-3 p-4 rounded-lg ${
                insight.type === 'positive' ? 'bg-green-50' :
                insight.type === 'negative' ? 'bg-red-50' :
                'bg-blue-50'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  insight.type === 'positive' ? 'bg-green-100' :
                  insight.type === 'negative' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  <Star className={`h-3 w-3 ${
                    insight.type === 'positive' ? 'text-green-600' :
                    insight.type === 'negative' ? 'text-red-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className={`font-medium ${
                    insight.type === 'positive' ? 'text-green-900' :
                    insight.type === 'negative' ? 'text-red-900' :
                    'text-blue-900'
                  }`}>{insight.title}</p>
                  <p className={`text-sm mt-1 ${
                    insight.type === 'positive' ? 'text-green-700' :
                    insight.type === 'negative' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}