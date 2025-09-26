'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

export function LandingPageHero() {
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
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto lg:mx-0">
              {t('hero.subtitle')}
              <br />
              <span className="text-lg font-semibold text-green-600">{t('hero.benefits')}</span>
            </p>
            
            {/* Business Name Input */}
            <div className="max-w-md mx-auto lg:mx-0 mb-8">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder={t('hero.placeholder')}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="text-lg py-6 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                />
                <Button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {t('hero.button')}
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              {t('hero.guarantee')}
            </p>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="Restaurant with digital menu"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
              <div className="text-2xl font-bold text-green-600">+35%</div>
              <div className="text-sm text-gray-600">Revenue Increase</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl">
              <div className="text-2xl font-bold text-blue-600">$2,400</div>
              <div className="text-sm text-gray-600">Extra Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
