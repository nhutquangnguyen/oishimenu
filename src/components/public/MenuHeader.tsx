'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { RestaurantInfo } from './types';

interface MenuHeaderProps {
  restaurant: RestaurantInfo;
  themeColor: string;
}

export function MenuHeader({ 
  restaurant, 
  themeColor
}: MenuHeaderProps) {
  return (
    <div 
      className="relative overflow-hidden"
      style={{ 
        backgroundColor: themeColor
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
      </div>
      
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {restaurant.logo && (restaurant.logo.startsWith('data:') || restaurant.logo.startsWith('http')) ? (
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-16 h-16 object-contain bg-white/10 backdrop-blur-sm rounded-lg p-2 drop-shadow-lg"
                />
              ) : (
                <div className="text-6xl drop-shadow-lg">{restaurant.logo || "🏪"}</div>
              )}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2 drop-shadow-md">
                {restaurant.name}
              </h1>
              <p className="text-white/90 text-lg mb-3">{restaurant.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span className="text-white/70">(127 reviews)</span>
                </div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <span className="text-white/70">Italian • $$</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
