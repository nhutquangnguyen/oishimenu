'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export function LandingPagePricing() {
  const { t } = useLanguage();
  const [businessName, setBusinessName] = useState('');
  const [isAnnual, setIsAnnual] = useState(true);

  const handleGetStarted = () => {
    if (businessName.trim()) {
      localStorage.setItem('businessName', businessName);
      window.location.href = '/auth/signup';
    }
  };

  const handleSelectPackage = (packageType: 'starter' | 'standard' | 'growth', billingType: 'monthly' | 'annually') => {
    // Store selected package and billing info
    localStorage.setItem('selectedPackage', packageType);
    localStorage.setItem('billingType', billingType);
    localStorage.setItem('isAnnual', isAnnual.toString());

    // Store business name if provided
    if (businessName.trim()) {
      localStorage.setItem('businessName', businessName);
    }

    // Redirect to signup with package info
    const params = new URLSearchParams({
      package: packageType,
      billing: billingType,
      annual: isAnnual.toString()
    });

    window.location.href = `/auth/signup?${params.toString()}`;
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
            {t('pricing.badge')}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12">
            {t('pricing.subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
              {t('pricing.monthly')}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
              {t('pricing.annually')}
            </span>
            {isAnnual && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {t('pricing.save2months')}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Starter Plan - Silver Theme */}
          <Card className="group p-8 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 border-2 border-slate-400/50 hover:border-slate-300 transition-all duration-500 rounded-3xl hover:-translate-y-2 shadow-2xl hover:shadow-slate-500/25">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">{t('pricing.starterTitle')}</h3>
              <div className="text-4xl font-bold text-slate-200 mb-2">
                {isAnnual ? t('pricing.starterPriceAnnual') : t('pricing.starterPrice')}
              </div>
              <p className="text-slate-300 mb-8">
                {isAnnual ? t('pricing.starterPeriodAnnual') : t('pricing.starterPeriod')}
              </p>

              <Button
                onClick={() => handleSelectPackage('starter', isAnnual ? 'annually' : 'monthly')}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white text-lg py-6 rounded-xl border-2 border-slate-400 hover:border-slate-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl mb-8"
              >
                {t('pricing.starterButton')}
              </Button>

              <p className="text-slate-200 text-sm mb-8 leading-relaxed">
                {t('pricing.starterDesc')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-200 text-sm text-left">{t('pricing.starterFeature1')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-200 text-sm text-left">{t('pricing.starterFeature1Upgrade')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-200 text-sm text-left">{t('pricing.starterFeature2')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-200 text-sm text-left">{t('pricing.starterFeature3')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-200 text-sm text-left">{t('pricing.starterFeature4')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-200 text-sm text-left">{t('pricing.starterFeature5')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-200 text-sm text-left">{t('pricing.starterFeature6')}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Standard Plan - Gold Theme */}
          <Card className="group p-8 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-600 border-2 border-amber-400 relative hover:scale-105 transition-all duration-500 rounded-3xl shadow-2xl hover:shadow-amber-500/40">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-amber-100 text-amber-900 px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg border-2 border-amber-300">
                <Star className="w-4 h-4" />
                <span>Most Popular</span>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">{t('pricing.standardTitle')}</h3>
              <div className="text-4xl font-bold text-white mb-2">
                {isAnnual ? t('pricing.standardPriceAnnual') : t('pricing.standardPrice')}
              </div>
              <p className="text-amber-100 mb-8">
                {isAnnual ? t('pricing.standardPeriodAnnual') : t('pricing.standardPeriod')}
              </p>

              <Button
                onClick={() => handleSelectPackage('standard', isAnnual ? 'annually' : 'monthly')}
                className="w-full bg-white hover:bg-amber-50 text-amber-700 text-lg py-6 rounded-xl border-2 border-amber-200 hover:border-amber-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl mb-8"
              >
                {t('pricing.standardButton')}
              </Button>

              <p className="text-white text-sm mb-8 leading-relaxed">
                {t('pricing.standardDesc')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-white text-sm text-left">{t('pricing.standardFeature1')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-white text-sm text-left">{t('pricing.standardFeature2')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-white text-sm text-left">{t('pricing.standardFeature3')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-white text-sm text-left">{t('pricing.standardFeature4')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-white text-sm text-left">{t('pricing.standardFeature5')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-white text-sm text-left">{t('pricing.standardFeature6')}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Growth Plan - Platinum/Diamond Theme */}
          <Card className="group p-8 bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 border-2 border-purple-400/70 hover:border-purple-300 transition-all duration-500 rounded-3xl hover:-translate-y-2 shadow-2xl hover:shadow-purple-500/40 relative overflow-hidden">
            {/* Luxury shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>

            <div className="text-center relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">{t('pricing.growthTitle')}</h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent mb-2">
                {isAnnual ? t('pricing.growthPriceAnnual') : t('pricing.growthPrice')}
              </div>
              <p className="text-purple-200 mb-8">
                {isAnnual ? t('pricing.growthPeriodAnnual') : t('pricing.growthPeriod')}
              </p>

              <Button
                onClick={() => handleSelectPackage('growth', isAnnual ? 'annually' : 'monthly')}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-lg py-6 rounded-xl border-2 border-purple-400 hover:border-purple-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl mb-8"
              >
                {t('pricing.growthButton')}
              </Button>

              <p className="text-purple-100 text-sm mb-8 leading-relaxed">
                {t('pricing.growthDesc')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-purple-100 text-sm text-left">{t('pricing.growthFeature1')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-purple-100 text-sm text-left">{t('pricing.growthFeature2')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-purple-100 text-sm text-left">{t('pricing.growthFeature3')}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-purple-100 text-sm text-left">{t('pricing.growthFeature4')}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Simple CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-300 mb-8">
            {t('pricing.ctaText')}
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <input
                type="text"
                placeholder={t('pricing.placeholder')}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="flex-1 bg-white/90 backdrop-blur-sm border-0 text-lg py-6 px-6 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-300 placeholder:text-gray-500 h-[60px]"
              />
              <Button
                onClick={() => handleSelectPackage('starter', 'monthly')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 whitespace-nowrap font-semibold hover:scale-105 h-[60px]"
              >
                {t('pricing.ctaButton')}
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-300 flex items-center justify-center">
            <span className="w-4 h-4 mr-2">✓</span>
            {t('pricing.guarantee')}
          </p>
        </div>
      </div>
    </section>
  );
}