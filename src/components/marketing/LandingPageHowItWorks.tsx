'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Upload, QrCode, Globe, Shield, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

export function LandingPageHowItWorks() {
  const { t } = useLanguage();
  
  const steps = [
    {
      icon: Upload,
      title: t('howItWorks.upload'),
      description: t('howItWorks.uploadDesc')
    },
    {
      icon: QrCode,
      title: t('howItWorks.qrCode'),
      description: t('howItWorks.qrCodeDesc')
    },
    {
      icon: Globe,
      title: t('howItWorks.goLive'),
      description: t('howItWorks.goLiveDesc')
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('howItWorks.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('howItWorks.readyTitle')}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {t('howItWorks.readyDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>{t('howItWorks.free')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{t('howItWorks.setup')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>{t('howItWorks.noCoding')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
