'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Calendar, Shield } from 'lucide-react';

interface UserDetail {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastSignIn?: string;
  emailVerified: boolean;
  disabled: boolean;
}

interface AdminUserInfoProps {
  userDetail: UserDetail;
}

export function AdminUserInfo({ userDetail }: AdminUserInfoProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{userDetail.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Display Name</p>
            <p className="font-medium">{userDetail.displayName || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">User ID</p>
            <p className="font-mono text-sm">{userDetail.uid}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Joined</p>
            <p className="font-medium">{new Date(userDetail.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Sign In</p>
            <p className="font-medium">
              {userDetail.lastSignIn ? new Date(userDetail.lastSignIn).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Email Verified</p>
            <p className="font-medium">{userDetail.emailVerified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Status</p>
            <p className="font-medium">{userDetail.disabled ? 'Disabled' : 'Active'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
