'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus } from 'lucide-react';

export function IncomeManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Income Management</h2>
          <p className="text-gray-600">Track and manage all revenue sources</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Record Income
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Income Tracking Coming Soon</h3>
          <p className="text-gray-500 mb-4">
            Record income from orders, catering, and other sources. Track revenue by category and analyze trends.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}