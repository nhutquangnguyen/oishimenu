'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Save, 
  Check, 
  Trash2, 
  Globe
} from 'lucide-react';

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security & Privacy
        </CardTitle>
        <CardDescription>Manage your account security and privacy settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
          </div>
          <Button variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Authenticator App</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Button variant="outline">
              <Check className="w-4 h-4 mr-2" />
              Enable
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Active Sessions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Current Session</h4>
                <p className="text-sm text-gray-500">Chrome on macOS • San Francisco, CA</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Mobile App</h4>
                <p className="text-sm text-gray-500">iPhone • Last active 2 hours ago</p>
              </div>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Revoke
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Data & Privacy</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Data Export</h4>
                <p className="text-sm text-gray-500">Download your restaurant data</p>
              </div>
              <Button variant="outline" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-gray-500">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Security Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
