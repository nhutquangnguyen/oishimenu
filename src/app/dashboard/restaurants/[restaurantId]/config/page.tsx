'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RestaurantConfigForm } from '@/components/restaurant/RestaurantConfigForm';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RestaurantConfigPage() {
  const { restaurants, loading } = useRestaurant();
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  
  const restaurant = restaurants.find(r => r.id === restaurantId);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading restaurant...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!restaurant) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Restaurant Not Found</h3>
              <p className="text-gray-600 mb-6">
                The restaurant you're looking for doesn't exist or you don't have access to it.
              </p>
              <Link href="/dashboard/restaurants">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Restaurants
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/restaurants">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Building2 className="w-8 h-8 mr-3" />
                  {restaurant.name} Configuration
                </h1>
                <p className="text-gray-600 mt-2">
                  Configure settings, information, and preferences for this restaurant location.
                </p>
              </div>
            </div>
          </div>
        </div>

        <RestaurantConfigForm restaurant={restaurant} />
      </div>
    </DashboardLayout>
  );
}
