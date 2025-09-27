'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, QrCode, Globe, Shield, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import Image from "next/image";

export function LandingPageHowItWorks() {
  const { t } = useLanguage();
  const [businessName, setBusinessName] = useState('');

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
  
  const steps = [
    {
      icon: Upload,
      title: t('howItWorks.step1'),
      description: t('howItWorks.step1Desc')
    },
    {
      icon: QrCode,
      title: t('howItWorks.step2'),
      description: t('howItWorks.step2Desc')
    },
    {
      icon: Globe,
      title: t('howItWorks.step3'),
      description: t('howItWorks.step3Desc')
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
            {t('howItWorks.badge')}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="group p-8 text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-2 rounded-3xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
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
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {t('howItWorks.readyTitle')}
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              {t('howItWorks.readyDesc')}
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <input
                  type="text"
                  placeholder={t('hero.placeholder')}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="flex-1 bg-white/90 backdrop-blur-sm border-0 text-lg py-6 px-6 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-300 placeholder:text-gray-500 h-[60px]"
                />
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 font-semibold hover:scale-105 h-[60px]"
                >
                  {t('howItWorks.ctaButton')}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="flex items-center space-x-3 text-lg text-gray-600">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span>{t('howItWorks.freeForever')}</span>
              </div>
              <div className="flex items-center space-x-3 text-lg text-gray-600">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span>{t('howItWorks.fiveMinuteSetup')}</span>
              </div>
              <div className="flex items-center space-x-3 text-lg text-gray-600">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span>{t('howItWorks.noCoding')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
