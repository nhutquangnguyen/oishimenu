'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from './types';
import { Plus, Star, X } from 'lucide-react';

interface CheckoutRecommendationsProps {
  cartItems: MenuItem[];
  allMenuItems: MenuItem[];
  onAddToCart: (item: MenuItem, selectedOptions: any, totalPrice: number) => void;
  optionGroups?: any[];
}

export function CheckoutRecommendations({ 
  cartItems, 
  allMenuItems, 
  onAddToCart, 
  optionGroups = [] 
}: CheckoutRecommendationsProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Get all recommendations from cart items
  const allRecommendations = useMemo(() => {
    const recommendationIds = new Set<string>();
    
    cartItems.forEach(item => {
      if (item.recommendations) {
        item.recommendations.forEach(recId => {
          recommendationIds.add(recId);
        });
      }
    });
    
    // Filter out items already in cart
    const cartItemIds = new Set(cartItems.map(item => item.id));
    return allMenuItems.filter(item => 
      recommendationIds.has(item.id) && !cartItemIds.has(item.id)
    );
  }, [cartItems, allMenuItems]);

  if (allRecommendations.length === 0) {
    return null;
  }

  const displayRecommendations = showAll ? allRecommendations : allRecommendations.slice(0, 4);
  const hasMore = allRecommendations.length > 4;

  const handleAddRecommendation = (item: MenuItem) => {
    onAddToCart(item, {}, item.price);
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Complete your order
          </h3>
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-green-600 hover:text-green-700"
          >
            {showAll ? 'Show Less' : `Show All (${allRecommendations.length})`}
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Based on your current order, you might also enjoy these items:
      </p>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {displayRecommendations.map((item) => (
          <Card 
            key={item.id} 
            className="flex-shrink-0 w-56 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-green-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium text-gray-900 line-clamp-1">
                    {item.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {item.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {!item.isAvailable && (
                      <Badge variant="secondary" className="text-xs">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-green-600">
                  ${item.price.toFixed(2)}
                </div>
                
                <Button
                  onClick={() => handleAddRecommendation(item)}
                  disabled={!item.isAvailable}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="text-green-600 border-green-300 hover:bg-green-50"
          >
            View {allRecommendations.length - 4} more recommendations
          </Button>
        </div>
      )}
    </div>
  );
}
