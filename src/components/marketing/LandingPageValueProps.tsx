'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Zap, DollarSign, Palette, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function LandingPageValueProps() {
  const { t } = useLanguage();

  const valueProps = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      emoji: "💡",
      title: t('valueProps.feature1'),
      description: t('valueProps.feature1Desc')
    },
    {
      icon: <Zap className="w-8 h-8" />,
      emoji: "⚡",
      title: t('valueProps.feature2'),
      description: t('valueProps.feature2Desc')
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      emoji: "💰",
      title: t('valueProps.feature3'),
      description: t('valueProps.feature3Desc')
    },
    {
      icon: <Palette className="w-8 h-8" />,
      emoji: "🎨",
      title: t('valueProps.feature4'),
      description: t('valueProps.feature4Desc')
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      emoji: "📊",
      title: t('valueProps.feature5'),
      description: t('valueProps.feature5Desc')
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-6">
            {t('valueProps.badge')}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('valueProps.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('valueProps.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {valueProps.slice(0, 3).map((prop, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white hover:-translate-y-3 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">{prop.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">{prop.title}</h3>
                <p className="text-gray-600 leading-relaxed">{prop.description}</p>

                {/* Hover effect decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Second row - centered with enhanced styling */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {valueProps.slice(3).map((prop, index) => (
            <Card key={index + 3} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white hover:-translate-y-3 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">{prop.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">{prop.title}</h3>
                <p className="text-gray-600 leading-relaxed">{prop.description}</p>

                {/* Hover effect decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}