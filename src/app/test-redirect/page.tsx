'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestRedirectPage() {
  const [email, setEmail] = useState('test@example.com');

  const handleRedirect = () => {
    window.location.href = `/account-disabled?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Disabled User Redirect</CardTitle>
          <CardDescription>
            Test the redirect to the beautiful disabled user page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email Address</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="mt-1"
            />
          </div>
          <Button onClick={handleRedirect} className="w-full">
            Test Redirect to Disabled User Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
