'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Upload, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ProfileSettings() {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          {t('settings.profile.title')}
        </CardTitle>
        <CardDescription>{t('settings.profile.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <div className="text-center sm:text-left">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Upload className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t('settings.profile.changePhoto')}</span>
              <span className="sm:hidden">{t('settings.profile.change')}</span>
            </Button>
            <p className="text-sm text-gray-500 mt-1">{t('settings.profile.photoFormat')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('settings.profile.firstName')}</Label>
            <Input id="firstName" defaultValue="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('settings.profile.lastName')}</Label>
            <Input id="lastName" defaultValue="Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('settings.profile.email')}</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
            <Input id="phone" defaultValue="+1 (555) 123-4567" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('settings.profile.saveChanges')}</span>
            <span className="sm:hidden">{t('settings.profile.save')}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
