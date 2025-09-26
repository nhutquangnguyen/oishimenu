'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Store, 
  ArrowRight, 
  Building2,
  MapPin,
  Star,
  Users
} from 'lucide-react';

interface Merchant {
  id: string;
  name: string;
  shortName: string;
  description: string;
  location: string;
  rating: number;
  orders: number;
  logo?: string;
}

export default function MerchantSelectPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);
  const router = useRouter();

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockMerchants: Merchant[] = [
      {
        id: 'pizza-palace',
        name: 'Pizza Palace',
        shortName: 'pizza-palace',
        description: 'Authentic Italian pizza with fresh ingredients',
        location: 'New York, NY',
        rating: 4.8,
        orders: 1250,
        logo: '🍕'
      },
      {
        id: 'burger-king',
        name: 'Burger King',
        shortName: 'burger-king',
        description: 'Flame-grilled burgers and crispy fries',
        location: 'Los Angeles, CA',
        rating: 4.6,
        orders: 2100,
        logo: '🍔'
      },
      {
        id: 'sushi-master',
        name: 'Sushi Master',
        shortName: 'sushi-master',
        description: 'Fresh sushi and Japanese cuisine',
        location: 'San Francisco, CA',
        rating: 4.9,
        orders: 890,
        logo: '🍣'
      },
      {
        id: 'coffee-corner',
        name: 'Coffee Corner',
        shortName: 'coffee-corner',
        description: 'Artisan coffee and pastries',
        location: 'Seattle, WA',
        rating: 4.7,
        orders: 1560,
        logo: '☕'
      }
    ];
    
    setMerchants(mockMerchants);
    setFilteredMerchants(mockMerchants);
  }, []);

  // Filter merchants based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMerchants(merchants);
    } else {
      const filtered = merchants.filter(merchant =>
        merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMerchants(filtered);
    }
  }, [searchTerm, merchants]);

  const handleMerchantSelect = (merchant: Merchant) => {
    // Redirect to merchant dashboard
    window.location.href = `https://merchant.oishimenu.com/${merchant.shortName}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OishiMenu
              </span>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = 'https://oishimenu.com'}
            >
              Back to Main Site
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Restaurant
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose your restaurant to access your dashboard and manage your menu
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg py-6 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Merchants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMerchants.map((merchant) => (
            <Card 
              key={merchant.id}
              className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 cursor-pointer group"
              onClick={() => handleMerchantSelect(merchant)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">{merchant.logo}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{merchant.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {merchant.shortName}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Star className="w-3 h-3 mr-1" />
                    {merchant.rating}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  {merchant.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {merchant.location}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    {merchant.orders.toLocaleString()} orders
                  </div>
                  
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    Access Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredMerchants.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or contact support if you can't find your restaurant.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
