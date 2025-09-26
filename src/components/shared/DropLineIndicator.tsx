'use client';

import React from 'react';

interface DropLineIndicatorProps {
  isActive: boolean;
}

export function DropLineIndicator({ isActive }: DropLineIndicatorProps) {
  if (!isActive) return null;

  return (
    <div className="relative h-2 my-1">
      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-500 rounded-full transform -translate-y-1/2 shadow-sm">
        <div className="absolute left-0 top-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
        <div className="absolute right-0 top-1/2 w-2 h-2 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
      </div>
    </div>
  );
}