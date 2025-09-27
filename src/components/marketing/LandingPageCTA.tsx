'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowRight, TrendingUp, Users, Clock, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LandingPageCTA() {
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
    <section className="relative py-24 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 overflow-hidden">
      {/* Dynamic animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-emerald-500/15 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-green-500/15 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/4 w-72 h-72 bg-teal-500/15 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Urgency Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 text-yellow-300 text-sm font-medium animate-pulse">
            <Zap className="w-4 h-4 mr-2" />
            {t('cta.urgency')}
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            {t('cta.subtitle')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Users className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">{t('cta.stats1')}</div>
            <p className="text-green-100">{t('cta.stats1Label')}</p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">{t('cta.stats2')}</div>
            <p className="text-green-100">{t('cta.stats2Label')}</p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Clock className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">{t('cta.stats3')}</div>
            <p className="text-green-100">{t('cta.stats3Label')}</p>
          </div>
        </div>

        {/* Main CTA Form */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                type="text"
                placeholder={t('cta.placeholder')}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="flex-1 bg-white border-0 text-lg py-6 px-6 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300 placeholder:text-gray-500 shadow-lg h-[60px]"
              />
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 whitespace-nowrap font-semibold hover:scale-105 h-[60px]"
              >
                {t('cta.button')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 text-white">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{t('cta.benefit1')}</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{t('cta.benefit2')}</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{t('cta.benefit3')}</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{t('cta.benefit4')}</span>
              </div>
            </div>

            <p className="text-green-100 text-center text-sm">
              {t('cta.guarantee')}
            </p>
          </div>
        </div>

        {/* Final Trust Signal */}
        <div className="text-center">
          <p className="text-green-200 text-lg">
            {t('cta.trustSignal')}
          </p>
        </div>
      </div>
    </section>
  );
}
