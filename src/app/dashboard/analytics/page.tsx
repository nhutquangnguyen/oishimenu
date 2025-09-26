'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
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

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your restaurant's performance with detailed insights and reports.</p>
        </div>
        <AnalyticsDashboard data={analytics} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
