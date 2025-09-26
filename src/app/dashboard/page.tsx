'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Download
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getAnalytics, calculateAnalytics, saveAnalytics, generateDemoOrders } from '@/lib/firestore';
import { AnalyticsData } from '@/components/dashboard/types';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { OrderCountChart } from '@/components/dashboard/OrderCountChart';
import { CustomerSatisfaction } from '@/components/dashboard/CustomerSatisfaction';
import { PerformanceInsights } from '@/components/dashboard/PerformanceInsights';
import { TopMenuItems } from '@/components/dashboard/TopMenuItems';
import { HourlyActivity } from '@/components/dashboard/HourlyActivity';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('today');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, isDisabled } = useAuth();
  const { currentRestaurant } = useRestaurant();
  
  // Load real analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;
      
      try {
        setLoading(true);
        
        // First, try to get cached analytics
        let analyticsData = await getAnalytics(currentRestaurant.id);
        
        // If no cached analytics, generate demo data and calculate
        if (!analyticsData) {
          // Generate demo orders for the restaurant (only if they don't exist)
          await generateDemoOrders(currentRestaurant.id, user.uid, user.email);
          
          // Calculate and cache analytics
          analyticsData = await calculateAnalytics(currentRestaurant.id);
          // Set the userId for the analytics data
          analyticsData.userId = user.uid;
          await saveAnalytics(analyticsData);
        }
        
        // Convert Firestore Timestamps to JavaScript Dates for the component
        const convertedAnalytics = {
          ...analyticsData,
          recentOrders: analyticsData.recentOrders.map(order => ({
            ...order,
            createdAt: order.createdAt.toDate()
          })),
          lastUpdated: analyticsData.lastUpdated.toDate()
        };
        setAnalytics(convertedAnalytics);
      } catch (error) {
        console.error('Error loading analytics:', error);
        // Set empty analytics on error
        setAnalytics({
          userId: user.uid,
          revenue: { current: 0, change: 0 },
          orders: { current: 0, change: 0 },
          averageOrder: { current: 0, change: 0 },
          completionRate: { current: 0, change: 0 },
          topItems: [],
          recentOrders: [],
          insights: [],
          lastUpdated: new Date()
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [user?.uid, user?.email, currentRestaurant?.id]);

  const handleAddMenuItem = () => {
    router.push('/dashboard/menu');
  };

  const handlePreviewMenu = () => {
    if (user?.uid) {
      // Use current restaurant ID if available, otherwise fall back to user ID
      const restaurantId = currentRestaurant?.id || user.uid;
      window.open(`/menu/${restaurantId}`, '_blank');
    } else {
      window.open('/menu', '_blank');
    }
  };

  const handleViewAnalytics = () => {
    // Since analytics is integrated into dashboard, just scroll to insights
    const insightsElement = document.querySelector('[data-insights]');
    if (insightsElement) {
      insightsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCustomRange = () => {
    // TODO: Implement custom date range picker
    alert('Custom date range picker coming soon!');
  };

  const handleExportReport = () => {
    // TODO: Implement report export functionality
    alert('Export functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (isDisabled) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <div className="flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Account Disabled</h3>
              <p className="text-red-700">Your account has been disabled. Please contact support for assistance.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-600">Start by adding some menu items and receiving orders.</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your restaurant.</p>
            </div>
            <div className="flex space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
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
              <Button variant="outline" onClick={handleCustomRange}>
                <Calendar className="w-4 h-4 mr-2" />
                Custom Range
              </Button>
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid with Analytics */}
        <StatsGrid analytics={analytics} />

        {/* Quick Actions and Hourly Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <QuickActions
            onAddMenuItem={handleAddMenuItem}
            onPreviewMenu={handlePreviewMenu}
            onViewAnalytics={handleViewAnalytics}
          />
          <HourlyActivity analytics={analytics} />
        </div>

        {/* Order Count Trend Chart */}
        <OrderCountChart analytics={analytics} />

        {/* Top Menu Items */}
        <div className="mb-8">
          <TopMenuItems analytics={analytics} />
        </div>

        {/* Customer Satisfaction & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CustomerSatisfaction analytics={analytics} />
          <PerformanceInsights analytics={analytics} />
        </div>
      </div>
    </DashboardLayout>
  );
}