'use client';

import { LandingPageNavigation } from '@/components/marketing/LandingPageNavigation';
import { LandingPageHero } from '@/components/marketing/LandingPageHero';
import { LandingPageSocialProof } from '@/components/marketing/LandingPageSocialProof';
import { LandingPageHowItWorks } from '@/components/marketing/LandingPageHowItWorks';
import { LandingPageValueProps } from '@/components/marketing/LandingPageValueProps';
import { LandingPagePricing } from '@/components/marketing/LandingPagePricing';
import { LandingPageCTA } from '@/components/marketing/LandingPageCTA';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <LandingPageNavigation />
      <LandingPageHero />
      <LandingPageHowItWorks />
      <LandingPageSocialProof />
      <LandingPageValueProps />
      <LandingPagePricing />
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
