'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Plus,
  Settings,
  Check,
  MapPin,
  Phone,
  Mail,
  Cog,
  Trash2
} from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Restaurant } from '@/types/restaurant';
import { RestaurantDeleteDialog } from './RestaurantDeleteDialog';
import Link from 'next/link';

export function RestaurantSelector() {
  const {
    restaurants,
    currentRestaurant,
    setCurrentRestaurant,
    createRestaurant,
    deleteRestaurant,
    loading
  } = useRestaurant();
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [deletingRestaurant, setDeletingRestaurant] = useState<Restaurant | null>(null);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleCreateRestaurant = async () => {
    if (!newRestaurant.name.trim()) return;

    try {
      const restaurantId = await createRestaurant({
        name: newRestaurant.name,
        description: newRestaurant.description,
        address: newRestaurant.address,
        phone: newRestaurant.phone,
        email: newRestaurant.email,
        logo: '🏪',
        theme: 'blue',
        isActive: true,
      });

      setNewRestaurant({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
      });
      setIsCreating(false);

      // Redirect to template selection for new restaurant
      router.push('/dashboard/onboarding/templates');
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Restaurant Display - Compact */}
      {currentRestaurant && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-xl">{currentRestaurant.logo}</div>
                <div>
                  <CardTitle className="text-base">{currentRestaurant.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {currentRestaurant.description || 'Restaurant management'}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                Active
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Restaurant List - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {restaurants.map((restaurant) => (
          <Card 
            key={restaurant.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              currentRestaurant?.id === restaurant.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setCurrentRestaurant(restaurant)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-lg">{restaurant.logo}</div>
                  <div>
                    <CardTitle className="text-sm">{restaurant.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {restaurant.description || 'Restaurant'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {currentRestaurant?.id === restaurant.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                  <Link href={`/dashboard/restaurants/${restaurant.id}/config`}>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Cog className="h-3 w-3" />
                    </Button>
                  </Link>
                  {restaurants.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingRestaurant(restaurant);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 text-xs text-gray-600">
                {restaurant.address && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{restaurant.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Restaurant - Compact */}
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
              <CardContent className="flex flex-col items-center justify-center p-4 h-full min-h-[80px]">
                <Plus className="h-6 w-6 text-gray-400 mb-1" />
                <CardTitle className="text-sm text-gray-600">Add Restaurant</CardTitle>
                <CardDescription className="text-xs text-center">
                  Create new location
                </CardDescription>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Restaurant</DialogTitle>
              <DialogDescription>
                Add a new restaurant location to manage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Downtown Location"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRestaurant.description}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this location"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newRestaurant.address}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main St, City, State"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newRestaurant.phone}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newRestaurant.email}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@restaurant.com"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRestaurant}>
                  Create Restaurant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Restaurant Dialog */}
      {deletingRestaurant && (
        <RestaurantDeleteDialog
          restaurant={deletingRestaurant}
          isOpen={!!deletingRestaurant}
          onClose={() => setDeletingRestaurant(null)}
          onConfirm={deleteRestaurant}
        />
      )}
    </div>
  );
}
