'use client';

import { Utensils, Clock, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NoMenuState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center">
            <Utensils className="w-10 h-10 text-orange-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full animate-bounce"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Menu Coming Soon!
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Our chef is working hard to prepare an amazing menu for you. 
          Check back soon for delicious options!
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <ChefHat className="w-4 h-4" />
            <span>Chef is preparing the menu</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Check back in a few hours</span>
          </div>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/'}
          className="mt-8 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
