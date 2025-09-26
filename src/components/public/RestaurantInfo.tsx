'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Phone, MapPin, Clock, Wifi, CreditCard, Utensils } from 'lucide-react';
import { RestaurantInfo as RestaurantInfoType } from './types';

interface RestaurantInfoProps {
  restaurant: RestaurantInfoType;
}

export function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  return (
    <div className="mb-6 space-y-3">
      {/* Main Info Card */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-white to-gray-50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="p-1.5 bg-blue-500 rounded-lg">
                <Phone className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Call us</p>
                <p className="font-semibold text-gray-900 text-sm">{restaurant.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <div className="p-1.5 bg-green-500 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Visit us</p>
                <p className="font-semibold text-gray-900 text-sm">{restaurant.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="p-1.5 bg-purple-500 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Open hours</p>
                <p className="font-semibold text-gray-900 text-sm">{restaurant.hours}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm border">
          <Wifi className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs font-medium">Free WiFi</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm border">
          <CreditCard className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-medium">Card Payment</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm border">
          <Utensils className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs font-medium">Dine-in</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm border">
          <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">★</span>
          </div>
          <span className="text-xs font-medium">4.8 Rating</span>
        </div>
      </div>
    </div>
  );
}
