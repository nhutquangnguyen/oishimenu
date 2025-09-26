'use client';

import { useRestaurant } from '@/contexts/RestaurantContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Settings, MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function RestaurantHeader() {
  const { currentRestaurant, restaurants, setCurrentRestaurant } = useRestaurant();

  if (!currentRestaurant) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏪</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">No Restaurant Selected</h3>
                <p className="text-sm text-gray-600">Create or select a restaurant to get started</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {restaurants.length > 0 ? (
                <Select 
                  value={currentRestaurant?.id || "select"} 
                  onValueChange={(restaurantId) => {
                    const restaurant = restaurants.find(r => r.id === restaurantId);
                    if (restaurant) {
                      setCurrentRestaurant(restaurant);
                    }
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select a restaurant">
                      <span className="text-gray-500">Select a restaurant</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select a restaurant</SelectItem>
                    {restaurants.map((restaurant) => (
                      <SelectItem key={restaurant.id} value={restaurant.id}>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{restaurant.logo}</span>
                          <div>
                            <div className="font-medium">{restaurant.name}</div>
                            {restaurant.address && (
                              <div className="text-xs text-gray-500 truncate max-w-32">
                                {restaurant.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
              <Link href="/dashboard/restaurants">
                <Button variant="outline" size="sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  {restaurants.length > 0 ? 'Manage' : 'Create'}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{currentRestaurant.logo}</div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{currentRestaurant.name}</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{currentRestaurant.description || 'Restaurant management'}</p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                {currentRestaurant.address && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-32">{currentRestaurant.address}</span>
                  </div>
                )}
                {currentRestaurant.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{currentRestaurant.phone}</span>
                  </div>
                )}
                {currentRestaurant.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-24">{currentRestaurant.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right text-sm text-gray-500">
              {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center space-x-2">
              <Select 
                value={currentRestaurant.id} 
                onValueChange={(restaurantId) => {
                  const restaurant = restaurants.find(r => r.id === restaurantId);
                  if (restaurant) {
                    setCurrentRestaurant(restaurant);
                  }
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{currentRestaurant.logo}</span>
                      <span className="truncate">{currentRestaurant.name}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{restaurant.logo}</span>
                        <div>
                          <div className="font-medium">{restaurant.name}</div>
                          {restaurant.address && (
                            <div className="text-xs text-gray-500 truncate max-w-32">
                              {restaurant.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link href="/dashboard/restaurants">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
