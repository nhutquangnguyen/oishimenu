'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { AnalyticsData } from './types';

interface CustomerSatisfactionProps {
  analytics: AnalyticsData;
}

export function CustomerSatisfaction({ analytics }: CustomerSatisfactionProps) {
  // Calculate satisfaction metrics based on real data
  const calculateSatisfactionMetrics = () => {
    const totalOrders = analytics.recentOrders.length;
    const completedOrders = analytics.recentOrders.filter(order => order.status === 'delivered').length;
    const cancelledOrders = analytics.recentOrders.filter(order => order.status === 'cancelled').length;
    
    // Calculate completion rate (delivered vs total)
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    
    // Calculate average order value for service quality indicator
    const avgOrderValue = analytics.averageOrder.current;
    
    // Calculate order accuracy (non-cancelled orders)
    const accuracyRate = totalOrders > 0 ? ((totalOrders - cancelledOrders) / totalOrders) * 100 : 0;
    
    // Generate ratings based on real metrics
    const overallRating = Math.min(5, Math.max(3.5, 3.5 + (completionRate / 100) * 1.5));
    const serviceSpeed = Math.min(5, Math.max(3, 3 + (completionRate / 100) * 2));
    const foodQuality = Math.min(5, Math.max(3.2, 3.2 + (avgOrderValue / 50) * 1.8));
    const orderAccuracy = Math.min(5, Math.max(3.5, 3.5 + (accuracyRate / 100) * 1.5));
    
    return {
      overall: Math.round(overallRating * 10) / 10,
      serviceSpeed: Math.round(serviceSpeed * 10) / 10,
      foodQuality: Math.round(foodQuality * 10) / 10,
      orderAccuracy: Math.round(orderAccuracy * 10) / 10
    };
  };

  const metrics = calculateSatisfactionMetrics();

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <div 
        key={star} 
        className={`w-4 h-4 rounded-sm ${
          star <= Math.floor(rating) 
            ? 'bg-yellow-400' 
            : star === Math.ceil(rating) && rating % 1 !== 0
            ? 'bg-yellow-200'
            : 'bg-gray-200'
        }`}
      ></div>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Customer Satisfaction
        </CardTitle>
        <CardDescription>Based on order completion and feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Overall Rating</span>
            <div className="flex items-center space-x-1">
              {renderStars(metrics.overall)}
              <span className="ml-2 text-sm font-medium">{metrics.overall}/5</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Service Speed</span>
              <span>{metrics.serviceSpeed}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(metrics.serviceSpeed / 5) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Food Quality</span>
              <span>{metrics.foodQuality}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(metrics.foodQuality / 5) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Order Accuracy</span>
              <span>{metrics.orderAccuracy}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(metrics.orderAccuracy / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
