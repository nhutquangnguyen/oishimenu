'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-xs"
      >
        EN
      </Button>
      <Button
        variant={language === 'vn' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('vn')}
        className="text-xs"
      >
        VN
      </Button>
    </div>
  );
}
