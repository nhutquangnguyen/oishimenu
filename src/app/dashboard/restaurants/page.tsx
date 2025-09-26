'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RestaurantSelector } from '@/components/restaurant/RestaurantSelector';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Plus, Settings } from 'lucide-react';

export default function RestaurantsPage() {
  const { restaurants, loading } = useRestaurant();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading restaurants...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building2 className="w-8 h-8 mr-3" />
                Restaurant Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage multiple restaurant locations, each with their own menu, tables, and data.
              </p>
            </div>
          </div>
        </div>

        {restaurants.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Restaurants Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first restaurant location to start managing menus, tables, and orders.
              </p>
              <RestaurantSelector />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Restaurants</h2>
                <p className="text-gray-600">Select a restaurant to manage its data</p>
              </div>
              <div className="text-sm text-gray-500">
                {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <RestaurantSelector />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
