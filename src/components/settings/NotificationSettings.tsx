'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Save } from 'lucide-react';

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </CardTitle>
        <CardDescription>Configure how you receive notifications about your restaurant.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">New Orders</h3>
              <p className="text-sm text-gray-500">Get notified when customers place orders</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Order Updates</h3>
              <p className="text-sm text-gray-500">Notifications for order status changes</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Daily Reports</h3>
              <p className="text-sm text-gray-500">Daily summary of sales and analytics</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Low Stock Alerts</h3>
              <p className="text-sm text-gray-500">Get notified when menu items are running low</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing Updates</h3>
              <p className="text-sm text-gray-500">Tips and updates about new features</p>
            </div>
            <Switch />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Notification Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-gray-500">Browser push notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Alerts</h4>
                <p className="text-sm text-gray-500">Text messages for urgent updates</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
