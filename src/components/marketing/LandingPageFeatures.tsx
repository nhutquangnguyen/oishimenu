'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Smartphone, Palette, BarChart3, Upload, QrCode, Globe, Shield, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

export function LandingPageFeatures() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Smartphone,
      title: t('features.smartRecommendations'),
      description: t('features.smartRecommendationsDesc')
    },
    {
      icon: Palette,
      title: t('features.promotionalDishes'),
      description: t('features.promotionalDishesDesc')
    },
    {
      icon: BarChart3,
      title: t('features.upsellingEngine'),
      description: t('features.upsellingEngineDesc')
    },
    {
      icon: Upload,
      title: t('features.bundleDeals'),
      description: t('features.bundleDealsDesc')
    }
  ];

  return (
    <section id="features" className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              {t('features.noWebsiteTitle')}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              {t('features.noWebsiteDesc')}
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">{t('features.website')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">{t('features.ordering')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">{t('features.mobile')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">{t('features.growth')}</span>
              </div>
            </div>
          </div>
          
          <div className="relative order-1 md:order-2 mb-8 md:mb-0">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t('features.yourWebsite')}</h4>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{t('features.completeOrdering')}</p>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-700">
                    <strong>{t('features.livePreview')}:</strong> {t('features.preview')}
                  </p>
                </div>
              </div>
            </div>
            {/* Feature showcase image - Hidden on mobile to prevent overflow */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="Restaurant website preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
