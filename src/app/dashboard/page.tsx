'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
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
import { TopMenuItems } from '@/components/dashboard/TopMenuItems';
import { HourlyActivity } from '@/components/dashboard/HourlyActivity';
import { RevenueByDates } from '@/components/dashboard/RevenueByDates';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('today');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const router = useRouter();
  const { user, isDisabled } = useAuth();
  const { currentRestaurant, restaurants, loading: restaurantsLoading } = useRestaurant();
  
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

  // Check onboarding completion and redirect to template selection if needed
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;

      const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');

      if (!hasCompletedOnboarding) {
        // Check if the restaurant has any menu items
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase');
          const menuDoc = await getDoc(doc(db, 'menus', currentRestaurant.id));

          if (menuDoc.exists()) {
            const menuData = menuDoc.data();
            const hasMenuItems = menuData.categories && menuData.categories.length > 0;

            if (!hasMenuItems) {
              // No menu items and no onboarding completed - redirect to template selection
              router.push('/dashboard/onboarding/templates');
              return;
            } else {
              // Has menu items - mark onboarding as completed
              localStorage.setItem('onboardingCompleted', 'true');
              setOnboardingCompleted(true);
            }
          } else {
            // No menu document - redirect to template selection
            router.push('/dashboard/onboarding/templates');
            return;
          }
        } catch (error) {
          console.error('Error checking menu data:', error);
        }
      } else {
        setOnboardingCompleted(true);
      }
    };

    checkOnboarding();
  }, [user?.uid, currentRestaurant?.id, router]);

  // Note: Removed redirect to /dashboard/restaurants as restaurants are now auto-created
  // Users will always have at least one restaurant after login

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

  const headerActions = (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-full sm:w-48">
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
      <div className="grid grid-cols-2 sm:flex sm:space-x-2 gap-2 sm:gap-0">
        <Button variant="outline" onClick={handleCustomRange} className="text-xs sm:text-sm">
          <Calendar className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Custom Range</span>
          <span className="sm:hidden">Custom</span>
        </Button>
        <Button variant="outline" onClick={handleExportReport} className="text-xs sm:text-sm">
          <Download className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Export Report</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <PageContent
        title="Dashboard"
        description="Welcome back! Here's what's happening with your restaurant."
        headerActions={headerActions}
      >

        {/* Enhanced Stats Grid with Analytics */}
        <StatsGrid analytics={analytics} />

        {/* Quick Actions and Hourly Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <QuickActions
            onAddMenuItem={handleAddMenuItem}
            onPreviewMenu={handlePreviewMenu}
            onViewAnalytics={handleViewAnalytics}
          />
          <HourlyActivity analytics={analytics} />
        </div>

        {/* Revenue by Dates */}
        <RevenueByDates analytics={analytics} />

        {/* Top Menu Items */}
        <TopMenuItems analytics={analytics} />
      </PageContent>
    </DashboardLayout>
  );
}