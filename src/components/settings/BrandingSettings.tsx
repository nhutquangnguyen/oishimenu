'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Upload, Save } from 'lucide-react';

export function BrandingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Branding & Appearance
        </CardTitle>
        <CardDescription>Customize your restaurant's visual identity and menu appearance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Logo</h3>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
              BV
            </div>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Color Scheme</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                <Input defaultValue="#2563eb" className="w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-600 rounded border"></div>
                <Input defaultValue="#6b7280" className="w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded border"></div>
                <Input defaultValue="#16a34a" className="w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Background</Label>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded border"></div>
                <Input defaultValue="#ffffff" className="w-24" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Menu Theme</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer border-2 border-blue-500">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg mx-auto mb-2"></div>
                  <h4 className="font-medium">Modern</h4>
                  <p className="text-sm text-gray-500">Clean and contemporary</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg mx-auto mb-2"></div>
                  <h4 className="font-medium">Classic</h4>
                  <p className="text-sm text-gray-500">Traditional and elegant</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-lg mx-auto mb-2"></div>
                  <h4 className="font-medium">Rustic</h4>
                  <p className="text-sm text-gray-500">Warm and cozy</p>
                </div>
              </CardContent>
            </Card>
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
