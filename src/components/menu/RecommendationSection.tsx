'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from './types';
import { Plus, Star, X } from 'lucide-react';

interface RecommendationSectionProps {
  recommendations: MenuItem[];
  onAddToCart: (item: MenuItem, selectedOptions: any, totalPrice: number) => void;
  optionGroups?: any[];
}

export function RecommendationSection({ 
  recommendations, 
  onAddToCart, 
  optionGroups = [] 
}: RecommendationSectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const displayRecommendations = showAll ? recommendations : recommendations.slice(0, 3);
  const hasMore = recommendations.length > 3;

  const handleAddRecommendation = (item: MenuItem) => {
    // Add directly to cart if no options, otherwise show options modal
    onAddToCart(item, {}, item.price);
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            You might also like
          </h3>
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-700"
          >
            {showAll ? 'Show Less' : `Show All (${recommendations.length})`}
          </Button>
        )}
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {displayRecommendations.map((item) => (
          <Card 
            key={item.id} 
            className="flex-shrink-0 w-64 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
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
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            View {recommendations.length - 3} more recommendations
          </Button>
        </div>
      )}
    </div>
  );
}
