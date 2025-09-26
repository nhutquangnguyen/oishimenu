'use client';

import { LandingPageNavigation } from '@/components/marketing/LandingPageNavigation';
import { LandingPageHero } from '@/components/marketing/LandingPageHero';
import { LandingPageRevenue } from '@/components/marketing/LandingPageRevenue';
import { LandingPageFeatures } from '@/components/marketing/LandingPageFeatures';
import { LandingPageHowItWorks } from '@/components/marketing/LandingPageHowItWorks';
import { LandingPageTestimonials } from '@/components/marketing/LandingPageTestimonials';
import { LandingPageCTA } from '@/components/marketing/LandingPageCTA';

export default function HomeRefactored() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNavigation />
      <LandingPageHero />
      <LandingPageRevenue />
      <LandingPageFeatures />
      <LandingPageHowItWorks />
      <LandingPageTestimonials />
      <LandingPageCTA />
    </div>
  );
}
