'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LandingPageCTA() {
  const [businessName, setBusinessName] = useState('');
  const { t } = useLanguage();

  const handleGetStarted = () => {
    if (businessName.trim()) {
      // Store business name in localStorage and redirect to signup
      localStorage.setItem('businessName', businessName);
      window.location.href = '/auth/signup';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          {t('cta.subtitle')}
          <br />
          <strong>{t('cta.averageRevenue')}</strong>
        </p>
        
        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={t('cta.placeholder')}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="text-lg py-6 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
            />
            <Button 
              onClick={handleGetStarted}
              className="bg-white text-indigo-600 hover:bg-gray-50 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('cta.button')}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-indigo-100">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{t('cta.free')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{t('cta.noCommissions')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{t('cta.setup')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
