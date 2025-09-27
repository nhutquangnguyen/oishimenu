'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from './ProfileSettings';
import { SubscriptionSettings } from './SubscriptionSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';
import { useLanguage } from '@/contexts/LanguageContext';

export function SettingsTabs() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
        <TabsTrigger value="profile" className="text-xs sm:text-sm">
          <span className="hidden sm:inline">{t('settings.tabs.profile')}</span>
          <span className="sm:hidden">{t('settings.tabs.profile')}</span>
        </TabsTrigger>
        <TabsTrigger value="subscription" className="text-xs sm:text-sm">
          <span className="hidden sm:inline">{t('settings.tabs.subscription')}</span>
          <span className="sm:hidden">{t('settings.tabs.plan')}</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="text-xs sm:text-sm">
          <span className="hidden sm:inline">{t('settings.tabs.notifications')}</span>
          <span className="sm:hidden">{t('settings.tabs.notify')}</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="text-xs sm:text-sm">
          <span className="hidden sm:inline">{t('settings.tabs.security')}</span>
          <span className="sm:hidden">{t('settings.tabs.security')}</span>
        </TabsTrigger>
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