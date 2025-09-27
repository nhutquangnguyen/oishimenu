'use client';

import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LandingPageSocialProof() {
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
            {t('socialProof.badge')}
          </div>

          {/* Featured Testimonial */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 hover:shadow-3xl transition-all duration-300">
              <Quote className="w-12 h-12 text-green-500 mx-auto mb-6" />
              <blockquote className="text-2xl sm:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
                {t('socialProof.testimonial')}
              </blockquote>
              <div className="flex items-center justify-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <cite className="text-lg text-gray-600 font-medium">
                {t('socialProof.author')}
              </cite>
            </div>
          </div>

          {/* Restaurant logos with modern styling */}
          <p className="text-xl text-gray-600 mb-8">
            {t('socialProof.trustedBy')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
            <div className="text-2xl font-bold text-gray-500 hover:text-gray-700 transition-colors duration-300">Café Luna</div>
            <div className="text-2xl font-bold text-gray-500 hover:text-gray-700 transition-colors duration-300">Bistro 42</div>
            <div className="text-2xl font-bold text-gray-500 hover:text-gray-700 transition-colors duration-300">The Corner</div>
            <div className="text-2xl font-bold text-gray-500 hover:text-gray-700 transition-colors duration-300">Riverside</div>
            <div className="text-2xl font-bold text-gray-500 hover:text-gray-700 transition-colors duration-300">Downtown</div>
          </div>
        </div>
      </div>
    </section>
  );
}
