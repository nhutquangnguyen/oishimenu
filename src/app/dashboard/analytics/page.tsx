'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getAnalytics, calculateAnalytics, saveAnalytics, generateDemoOrders } from '@/lib/firestore';
import { AnalyticsData } from '@/components/dashboard/types';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  
  // Load real analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;
      
      try {
        setLoading(true);
        
        // First, try to get cached analytics
        let analyticsData = await getAnalytics(currentRestaurant.id);
        
        // If no cached analytics, show empty state instead of generating demo data
        if (!analyticsData) {
          // Set empty analytics for new restaurants
          analyticsData = {
            userId: user.uid,
            revenue: { current: 0, change: 0 },
            orders: { current: 0, change: 0 },
            averageOrder: { current: 0, change: 0 },
            completionRate: { current: 0, change: 0 },
            topItems: [],
            recentOrders: [],
            insights: [
              "📊 Welcome to your analytics dashboard!",
              "🍽️ Add menu items and start receiving orders to see data here",
              "📈 Analytics will automatically update as you get orders"
            ],
            lastUpdated: new Date()
          };
        }
        
        // Convert Firestore Timestamps to JavaScript Dates for the component
        const convertedAnalytics = {
          ...analyticsData,
          recentOrders: analyticsData.recentOrders.map(order => ({
            ...order,
            createdAt: order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt
          })),
          lastUpdated: analyticsData.lastUpdated?.toDate ? analyticsData.lastUpdated.toDate() : analyticsData.lastUpdated
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

  return (
    <DashboardLayout>
      <PageContent
        title="Analytics"
        description="Track your restaurant's performance with detailed insights and reports."
      >
        <AnalyticsDashboard data={analytics} loading={loading} />
      </PageContent>
    </DashboardLayout>
  );
}
