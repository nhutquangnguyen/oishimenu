'use client';

import { Card } from "@/components/ui/card";
import { Clock, DollarSign, TrendingUp, Users, Zap, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LandingPageBenefits() {
  const { t } = useLanguage();
  
  const benefits = [
    {
      icon: Clock,
      title: t('benefits.setup'),
      description: t('benefits.setupDesc'),
      highlight: t('benefits.setupHighlight')
    },
    {
      icon: DollarSign,
      title: t('benefits.zeroCommissions'),
      description: t('benefits.zeroCommissionsDesc'),
      highlight: t('benefits.zeroCommissionsHighlight')
    },
    {
      icon: TrendingUp,
      title: t('benefits.revenueIncrease'),
      description: t('benefits.revenueIncreaseDesc'),
      highlight: t('benefits.revenueIncreaseHighlight')
    },
    {
      icon: Users,
      title: t('benefits.happyRestaurants'),
      description: t('benefits.happyRestaurantsDesc'),
      highlight: t('benefits.happyRestaurantsHighlight')
    },
    {
      icon: Zap,
      title: t('benefits.aiUpselling'),
      description: t('benefits.aiUpsellingDesc'),
      highlight: t('benefits.aiUpsellingHighlight')
    },
    {
      icon: Shield,
      title: t('benefits.noRisk'),
      description: t('benefits.noRiskDesc'),
      highlight: t('benefits.noRiskHighlight')
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('benefits.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('benefits.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 mb-3">{benefit.description}</p>
                    <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                      {benefit.highlight}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('benefits.readyTitle')}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {t('benefits.readyDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-3xl font-bold text-green-600">{t('benefits.averageRevenue')}</div>
              <div className="text-gray-600">{t('benefits.averageRevenueDesc')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
