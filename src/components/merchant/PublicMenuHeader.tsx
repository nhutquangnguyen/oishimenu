'use client';

import { Store, Star, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicMenuHeaderProps {
  merchant: {
    id: string;
    name: string;
    shortName: string;
    description: string;
    location: string;
    phone: string;
    rating: number;
    deliveryTime: string;
    logo: string;
  } | null;
}

export function PublicMenuHeader({ merchant }: PublicMenuHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">{merchant?.logo}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{merchant?.name}</h1>
                <p className="text-sm text-gray-500">Online Menu</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                onClick={() => window.location.href = 'https://oishimenu.com'}
              >
                Back to Main Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{merchant?.rating}</span>
                <span className="text-gray-500">(4.8)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{merchant?.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{merchant?.location}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Call Restaurant
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
