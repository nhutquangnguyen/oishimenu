'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function LandingPageNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Menu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">OishiMenu</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">{t('nav.features')}</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">{t('nav.howItWorks')}</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">{t('nav.pricing')}</Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-gray-900">{t('nav.testimonials')}</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">{t('nav.logIn')}</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">{t('nav.getAccess')}</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
