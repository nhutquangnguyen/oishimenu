'use client';

import { ReactNode } from 'react';

interface PageContentProps {
  children: ReactNode;
  title?: string;
  description?: string;
  headerActions?: ReactNode;
  className?: string;
}

export function PageContent({
  children,
  title,
  description,
  headerActions,
  className = ''
}: PageContentProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {(title || description || headerActions) && (
        <div className="flex flex-col space-y-4 sm:space-y-0">
          {(title || description) && (
            <div className="flex-1 min-w-0 mb-4 sm:mb-0">
              {title && (
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-gray-600 text-sm sm:text-base mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          )}
          {headerActions && (
            <div className="flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}