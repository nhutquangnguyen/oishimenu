'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DragPreviewProps {
  isActive: boolean;
  position?: 'top' | 'bottom' | 'inside';
  itemName?: string;
  containerName?: string;
}

export function DragPreview({
  isActive,
  position = 'inside',
  itemName,
  containerName
}: DragPreviewProps) {
  if (!isActive) return null;

  const getMessage = () => {
    if (position === 'inside') {
      return `Moving ${itemName || 'item'} to ${containerName || 'container'}`;
    }
    return `Drop ${position === 'top' ? 'above' : 'below'}`;
  };

  return (
    <div className={cn(
      'absolute left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium z-50 shadow-lg',
      position === 'top' && '-top-3',
      position === 'bottom' && '-bottom-3',
      position === 'inside' && 'top-1/2 -translate-y-1/2'
    )}>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>{getMessage()}</span>
      </div>
    </div>
  );
}