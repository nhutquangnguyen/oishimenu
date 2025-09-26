'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface UserDetail {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastSignIn?: string;
  emailVerified: boolean;
  disabled: boolean;
}

interface AdminUserHeaderProps {
  userDetail: UserDetail;
}

export function AdminUserHeader({ userDetail }: AdminUserHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 mb-4">
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </Link>
        <div className="flex items-center space-x-3">
          <User className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{userDetail.displayName || 'No Name'}</h1>
            <p className="text-gray-600">{userDetail.email}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Badge variant={userDetail.disabled ? "destructive" : "default"}>
          {userDetail.disabled ? 'Disabled' : 'Active'}
        </Badge>
        {userDetail.emailVerified ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        ) : (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Unverified
          </Badge>
        )}
      </div>
    </div>
  );
}
