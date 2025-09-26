'use client';

import { LandingPageNavigation } from '@/components/marketing/LandingPageNavigation';
import { LandingPageHero } from '@/components/marketing/LandingPageHero';
import { LandingPageRevenue } from '@/components/marketing/LandingPageRevenue';
import { LandingPageFeatures } from '@/components/marketing/LandingPageFeatures';
import { LandingPageBenefits } from '@/components/marketing/LandingPageBenefits';
import { LandingPageHowItWorks } from '@/components/marketing/LandingPageHowItWorks';
import { LandingPageTestimonials } from '@/components/marketing/LandingPageTestimonials';
import { LandingPageCTA } from '@/components/marketing/LandingPageCTA';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <LandingPageNavigation />
      <LandingPageHero />
      <LandingPageRevenue />
      <LandingPageFeatures />
      <LandingPageBenefits />
      <LandingPageHowItWorks />
      <LandingPageTestimonials />
      <LandingPageCTA />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
