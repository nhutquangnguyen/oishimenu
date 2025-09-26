'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Upload, Save } from 'lucide-react';

export function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Profile Information
        </CardTitle>
        <CardDescription>Update your personal information and contact details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <div>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue="Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" defaultValue="+1 (555) 123-4567" />
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
