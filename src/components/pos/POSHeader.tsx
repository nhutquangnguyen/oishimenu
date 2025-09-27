'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface POSHeaderProps {
  isDisabled: boolean;
}

export function POSHeader({ isDisabled }: POSHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('pos.title')}</h1>
      <p className="text-gray-600">{t('pos.description')}</p>
      
      {isDisabled && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t('pos.accountDisabled')}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{t('pos.accountDisabledMessage')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
