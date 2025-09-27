'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageContent } from '@/components/shared/PageContent';
import { RestaurantSelector } from '@/components/restaurant/RestaurantSelector';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Plus, Settings, ArrowRight } from 'lucide-react';

export default function RestaurantsPage() {
  const { restaurants, loading, createRestaurant } = useRestaurant();
  const [pendingRestaurantName, setPendingRestaurantName] = useState('');
  const [isCreatingFromSignup, setIsCreatingFromSignup] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
  });
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  // Check for pending restaurant name from signup
  useEffect(() => {
    const savedName = localStorage.getItem('pendingRestaurantName');
    if (savedName && restaurants.length === 0) {
      setPendingRestaurantName(savedName);
      setIsCreatingFromSignup(true);
      setNewRestaurant(prev => ({ ...prev, name: savedName }));
    }
  }, [restaurants]);

  const handleCreateRestaurant = async () => {
    if (!newRestaurant.name.trim()) return;

    try {
      setCreating(true);
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

      // Clear pending restaurant name
      if (pendingRestaurantName) {
        localStorage.removeItem('pendingRestaurantName');
      }

      // Redirect to template selection
      router.push('/dashboard/onboarding/templates');
    } catch (error) {
      console.error('Error creating restaurant:', error);
    } finally {
      setCreating(false);
    }
  };

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
      <PageContent
        title={isCreatingFromSignup ? "Create Your Restaurant" : "Restaurant Management"}
        description={isCreatingFromSignup ? "Complete your setup by creating your restaurant profile" : "Manage multiple restaurant locations, each with their own menu, tables, and data."}
      >

        {restaurants.length === 0 ? (
          isCreatingFromSignup ? (
            /* New User Creation Form */
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Welcome! Let's create your restaurant
                </CardTitle>
                <CardDescription>
                  We'll help you set up your restaurant profile and then choose a menu template to get started quickly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    id="name"
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your restaurant name"
                    className="font-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRestaurant.description}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your restaurant"
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
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleCreateRestaurant}
                    disabled={!newRestaurant.name.trim() || creating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {creating ? 'Creating...' : 'Create Restaurant & Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
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
          )
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
      </PageContent>
    </DashboardLayout>
  );
}
