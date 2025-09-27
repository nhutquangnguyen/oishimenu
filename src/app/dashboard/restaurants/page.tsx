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
import { useLanguage } from '@/contexts/LanguageContext';

export default function RestaurantsPage() {
  const { restaurants, loading, createRestaurant } = useRestaurant();
  const { t } = useLanguage();
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
            <p className="text-gray-600">{t('dashboard.restaurants.loading')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContent
        title={isCreatingFromSignup ? t('dashboard.restaurants.createTitle') : t('dashboard.restaurants.managementTitle')}
        description={isCreatingFromSignup ? t('dashboard.restaurants.createDescription') : t('dashboard.restaurants.managementDescription')}
      >

        {restaurants.length === 0 ? (
          isCreatingFromSignup ? (
            /* New User Creation Form */
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {t('dashboard.restaurants.welcomeTitle')}
                </CardTitle>
                <CardDescription>
                  {t('dashboard.restaurants.welcomeDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('dashboard.restaurants.form.name')} *</Label>
                  <Input
                    id="name"
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('dashboard.restaurants.form.namePlaceholder')}
                    className="font-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="description">{t('dashboard.restaurants.form.description')}</Label>
                  <Textarea
                    id="description"
                    value={newRestaurant.description}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('dashboard.restaurants.form.descriptionPlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="address">{t('dashboard.restaurants.form.address')}</Label>
                  <Input
                    id="address"
                    value={newRestaurant.address}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, address: e.target.value }))}
                    placeholder={t('dashboard.restaurants.form.addressPlaceholder')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">{t('dashboard.restaurants.form.phone')}</Label>
                    <Input
                      id="phone"
                      value={newRestaurant.phone}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder={t('dashboard.restaurants.form.phonePlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('dashboard.restaurants.form.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newRestaurant.email}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, email: e.target.value }))}
                      placeholder={t('dashboard.restaurants.form.emailPlaceholder')}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleCreateRestaurant}
                    disabled={!newRestaurant.name.trim() || creating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {creating ? t('dashboard.restaurants.form.creating') : t('dashboard.restaurants.form.createButton')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('dashboard.restaurants.noRestaurantsTitle')}</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {t('dashboard.restaurants.noRestaurantsDescription')}
                </p>
                <RestaurantSelector />
              </CardContent>
            </Card>
          )
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.restaurants.yourRestaurants')}</h2>
                <p className="text-gray-600">{t('dashboard.restaurants.selectDescription')}</p>
              </div>
              <div className="text-sm text-gray-500">
                {restaurants.length} {restaurants.length !== 1 ? t('dashboard.restaurants.restaurantsPlural') : t('dashboard.restaurants.restaurantSingular')}
              </div>
            </div>

            <RestaurantSelector />
          </div>
        )}
      </PageContent>
    </DashboardLayout>
  );
}
