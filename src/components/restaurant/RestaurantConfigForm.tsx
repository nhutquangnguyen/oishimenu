'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  CreditCard,
  Settings,
  Save,
  Check,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Restaurant } from '@/types/restaurant';
import { RestaurantDeleteDialog } from './RestaurantDeleteDialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface RestaurantConfigFormProps {
  restaurant: Restaurant;
}

export function RestaurantConfigForm({ restaurant }: RestaurantConfigFormProps) {
  const { t } = useLanguage();
  const { updateRestaurant, deleteRestaurant, restaurants } = useRestaurant();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    name: restaurant.name || '',
    description: restaurant.description || '',
    address: restaurant.address || '',
    phone: restaurant.phone || '',
    email: restaurant.email || '',
    website: restaurant.website || '',
    openingHours: restaurant.openingHours || '',
    currency: restaurant.currency || 'USD',
    timezone: restaurant.timezone || 'UTC',
    isActive: restaurant.isActive ?? true,
    acceptOnlineOrders: restaurant.acceptOnlineOrders ?? true,
    acceptReservations: restaurant.acceptReservations ?? false,
    deliveryRadius: restaurant.deliveryRadius || 5,
    minimumOrderAmount: restaurant.minimumOrderAmount || 0,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateRestaurant(restaurant.id, formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error updating restaurant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Basic details about your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Restaurant Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter restaurant name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@restaurant.com"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your restaurant"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Location and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://restaurant.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Business Settings
          </CardTitle>
          <CardDescription>
            Configure how your restaurant operates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="VND">VND - Vietnamese Dong</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="openingHours">Opening Hours</Label>
            <Input
              id="openingHours"
              value={formData.openingHours}
              onChange={(e) => handleInputChange('openingHours', e.target.value)}
              placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Order Settings
          </CardTitle>
          <CardDescription>
            Configure online ordering preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="acceptOnlineOrders">Accept Online Orders</Label>
              <p className="text-sm text-gray-600">Allow customers to place orders online</p>
            </div>
            <Switch
              id="acceptOnlineOrders"
              checked={formData.acceptOnlineOrders}
              onCheckedChange={(checked) => handleInputChange('acceptOnlineOrders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="acceptReservations">Accept Reservations</Label>
              <p className="text-sm text-gray-600">Allow customers to make table reservations</p>
            </div>
            <Switch
              id="acceptReservations"
              checked={formData.acceptReservations}
              onCheckedChange={(checked) => handleInputChange('acceptReservations', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deliveryRadius">Delivery Radius (miles)</Label>
              <Input
                id="deliveryRadius"
                type="number"
                value={formData.deliveryRadius}
                onChange={(e) => handleInputChange('deliveryRadius', parseInt(e.target.value) || 0)}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="minimumOrderAmount">Minimum Order Amount</Label>
              <Input
                id="minimumOrderAmount"
                type="number"
                value={formData.minimumOrderAmount}
                onChange={(e) => handleInputChange('minimumOrderAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Status
          </CardTitle>
          <CardDescription>
            Control restaurant visibility and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive">Restaurant Active</Label>
              <p className="text-sm text-gray-600">Make this restaurant visible to customers</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Badge variant={formData.isActive ? "default" : "secondary"}>
                {formData.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone - Only show if user has multiple restaurants */}
      {restaurants.length > 1 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-900">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {t('restaurant.dangerZone.title')}
            </CardTitle>
            <CardDescription>
              {t('restaurant.dangerZone.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h4 className="font-medium text-red-900">{t('restaurant.dangerZone.deleteTitle')}</h4>
                <p className="text-sm text-red-700">
                  {t('restaurant.dangerZone.deleteDescription')}
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('restaurant.dangerZone.deleteButton')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : isSaved ? (
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </div>
          ) : (
            <div className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </div>
          )}
        </Button>
      </div>

      {/* Delete Restaurant Dialog */}
      <RestaurantDeleteDialog
        restaurant={restaurant}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={deleteRestaurant}
      />
    </div>
  );
}
