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
    // Store business name and redirect to signup with free starter package
    if (businessName.trim()) {
      localStorage.setItem('businessName', businessName);
    }
    localStorage.setItem('selectedPackage', 'starter');
    localStorage.setItem('billingType', 'monthly');
    localStorage.setItem('isAnnual', 'false');

    const params = new URLSearchParams({
      package: 'starter',
      billing: 'monthly',
      annual: 'false'
    });

    window.location.href = `/auth/signup?${params.toString()}`;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Modern animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            {/* Modern badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {t('socialProof.trustedByBadge')}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Modern CTA Form */}
            <div className="max-w-2xl mx-auto lg:mx-0 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Input
                  type="text"
                  placeholder={t('hero.placeholder')}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="flex-1 bg-white/90 backdrop-blur-sm border-0 text-lg py-6 px-6 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-300 placeholder:text-gray-500 h-[60px]"
                />
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 whitespace-nowrap font-semibold hover:scale-105 h-[60px]"
                >
                  {t('hero.button')}
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 flex items-center justify-center lg:justify-start">
              <span className="w-4 h-4 mr-2">✓</span>
              {t('hero.guarantee')}
            </p>
          </div>
          
          {/* Modern Hero Visual */}
          <div className="relative mt-12 lg:mt-0 px-8 py-8">
            <div className="relative w-full h-80 sm:h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="Restaurant upselling with digital menu"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* Modern floating cards - positioned outside the image container */}
            <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">💰</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{t('hero.salesBoost')}</div>
                  <div className="text-xs text-gray-600">{t('hero.salesBoostLabel')}</div>
                </div>
              </div>
            </div>

            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚡</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{t('hero.setupTime')}</div>
                  <div className="text-xs text-gray-600">{t('hero.setupTimeLabel')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
