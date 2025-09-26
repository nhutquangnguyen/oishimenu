'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Edit, Trash2 } from 'lucide-react';

export function SubscriptionSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Subscription & Billing
        </CardTitle>
        <CardDescription>Manage your subscription plan and billing information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-blue-900">Professional Plan</h3>
            <p className="text-sm text-blue-700">$29/month • Next billing: Jan 15, 2024</p>
          </div>
          <Badge variant="secondary">Active</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Starter</CardTitle>
              <CardDescription>Perfect for small cafes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$9<span className="text-sm font-normal">/month</span></div>
              <ul className="text-sm text-gray-600 mt-4 space-y-2">
                <li>• Up to 50 menu items</li>
                <li>• Basic analytics</li>
                <li>• Email support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-500 border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Professional</CardTitle>
              <CardDescription>Most popular choice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$29<span className="text-sm font-normal">/month</span></div>
              <ul className="text-sm text-gray-600 mt-4 space-y-2">
                <li>• Unlimited menu items</li>
                <li>• Advanced analytics</li>
                <li>• Priority support</li>
                <li>• Custom branding</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Enterprise</CardTitle>
              <CardDescription>For large restaurants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$99<span className="text-sm font-normal">/month</span></div>
              <ul className="text-sm text-gray-600 mt-4 space-y-2">
                <li>• Everything in Pro</li>
                <li>• Multi-location support</li>
                <li>• API access</li>
                <li>• Dedicated support</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Payment Method</h3>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment
          </Button>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Cancel Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
