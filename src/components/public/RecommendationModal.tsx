'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Star } from 'lucide-react';
import { MenuItem } from './types';
import { MenuOptionGroup } from '../menu/types';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedItems: MenuItem[];
  onAddToCart: (item: MenuItem, selectedOptions?: any, totalPrice?: number) => void;
  optionGroups: MenuOptionGroup[];
}

export function RecommendationModal({ 
  isOpen, 
  onClose, 
  recommendedItems, 
  onAddToCart,
  optionGroups 
}: RecommendationModalProps) {
  if (!isOpen) return null;

  const handleAddToCart = (item: MenuItem) => {
    // Check if item has options
    const itemOptionGroups = optionGroups.filter(group => 
      item.optionGroups?.includes(group.id)
    );
    
    if (itemOptionGroups.length > 0) {
      // Item has options, we'll need to show the options selector
      // For now, add with default options
      onAddToCart(item, {}, item.price);
    } else {
      // No options, add directly
      onAddToCart(item, {}, item.price);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Recommended for You</h2>
                <p className="text-blue-100 text-sm">Items that go well with your order</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Recommended Items */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {recommendedItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recommendations available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendedItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
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
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="text-xs text-gray-500">
                              Allergens: {item.allergens.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              These items are recommended based on your current order
            </p>
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-600"
            >
              Continue to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
