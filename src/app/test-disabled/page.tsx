'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DisabledAccountNotification } from '@/components/auth/DisabledAccountNotification';

export default function TestDisabledPage() {
  const [showDisabled, setShowDisabled] = useState(false);

  const handleReturnToLogin = () => {
    setShowDisabled(false);
    console.log('Returning to login...');
  };

  if (showDisabled) {
    return (
      <DisabledAccountNotification
        email="test@example.com"
        onReturnToLogin={handleReturnToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Test Disabled User Notification</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to test the disabled user notification page.
        </p>
        <Button onClick={() => setShowDisabled(true)}>
          Show Disabled User Notification
        </Button>
      </div>
    </div>
  );
}
