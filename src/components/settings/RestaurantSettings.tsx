'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Save } from 'lucide-react';

export function RestaurantSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Restaurant Information
        </CardTitle>
        <CardDescription>Manage your restaurant details and business information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Restaurant Name</Label>
            <Input id="restaurantName" defaultValue="Bella Vista Restaurant" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine Type</Label>
            <Select defaultValue="italian">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue="123 Main Street, City, State 12345" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" defaultValue="+1 (555) 123-4567" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            defaultValue="Authentic Italian cuisine in the heart of the city. We serve fresh pasta, wood-fired pizza, and traditional Italian dishes made with love."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="openingHours">Opening Hours</Label>
            <Input id="openingHours" defaultValue="11:00 AM - 10:00 PM" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Seating Capacity</Label>
            <Input id="capacity" type="number" defaultValue="50" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
