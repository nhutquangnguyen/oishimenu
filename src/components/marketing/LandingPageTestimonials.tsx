'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LandingPageTestimonials() {
  const { t } = useLanguage();
  
  const testimonials = [
    {
      name: "Maria Rodriguez",
      restaurant: "Bella Vista Restaurant",
      rating: 5,
      text: t('testimonials.maria')
    },
    {
      name: "James Chen",
      restaurant: "Golden Dragon",
      rating: 5,
      text: t('testimonials.james')
    },
    {
      name: "Sarah Johnson",
      restaurant: "The Garden Bistro",
      rating: 5,
      text: t('testimonials.sarah')
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('testimonials.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.restaurant}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
