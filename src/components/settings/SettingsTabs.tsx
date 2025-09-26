'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from './ProfileSettings';
import { SubscriptionSettings } from './SubscriptionSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      {/* Profile Settings */}
      <TabsContent value="profile" className="space-y-6">
        <ProfileSettings />
      </TabsContent>

      {/* Subscription Settings */}
      <TabsContent value="subscription" className="space-y-6">
        <SubscriptionSettings />
      </TabsContent>

      {/* Notifications Settings */}
      <TabsContent value="notifications" className="space-y-6">
        <NotificationSettings />
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security" className="space-y-6">
        <SecuritySettings />
      </TabsContent>
    </Tabs>
  );
}