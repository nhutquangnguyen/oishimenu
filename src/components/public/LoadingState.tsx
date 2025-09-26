'use client';

import { Loader2, Utensils } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center animate-pulse">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Preparing your menu...
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-gray-600">Loading delicious options</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          
          <p className="text-sm text-gray-500">
            Just a moment while we fetch the latest menu items
          </p>
        </div>
      </div>
    </div>
  );
}
