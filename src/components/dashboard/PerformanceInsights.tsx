'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from './types';

interface PerformanceInsightsProps {
  analytics: AnalyticsData;
}

export function PerformanceInsights({ analytics }: PerformanceInsightsProps) {
  return (
    <Card data-insights>
      <CardHeader>
        <CardTitle>Performance Insights</CardTitle>
        <CardDescription>Key insights and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analytics.insights.length > 0 ? (
            analytics.insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'positive' ? 'bg-green-50 border-green-500' :
                insight.type === 'negative' ? 'bg-red-50 border-red-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-gray-500">
              <p>No specific insights available at this time.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
