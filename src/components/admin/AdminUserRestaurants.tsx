'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  createdAt: string;
}

interface AdminUserRestaurantsProps {
  restaurants: Restaurant[];
}

export function AdminUserRestaurants({ restaurants }: AdminUserRestaurantsProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Restaurants ({restaurants.length})
        </CardTitle>
        <CardDescription>
          Restaurants owned by this user
        </CardDescription>
      </CardHeader>
      <CardContent>
        {restaurants.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No restaurants found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                  <Badge variant="outline">Active</Badge>
                </div>
                {restaurant.description && (
                  <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                )}
                <div className="space-y-1 text-sm text-gray-500">
                  {restaurant.address && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {restaurant.address}
                    </div>
                  )}
                  {restaurant.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {restaurant.phone}
                    </div>
                  )}
                  <div className="text-xs">
                    Created: {new Date(restaurant.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
