'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuOptionGroup } from './types';
import { MenuItem } from '../public/types';
import { UnifiedAddToCartModal } from './UnifiedAddToCartModal';
import { Plus, Star, AlertTriangle } from 'lucide-react';

interface PublicMenuItemProps {
  item: MenuItem;
  optionGroups: MenuOptionGroup[];
  onAddToCart: (item: MenuItem, selectedOptions: any, totalPrice: number, quantity?: number, recommendations?: Array<{item: MenuItem, quantity: number}>) => void;
  allMenuItems?: MenuItem[];
}

export function PublicMenuItem({ item, optionGroups, onAddToCart, allMenuItems = [] }: PublicMenuItemProps) {
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    // Always show the unified modal for consistent UX
    setShowModal(true);
  };

  const handleUnifiedAddToCart = (item: MenuItem, selectedOptions: any, totalPrice: number, quantity: number = 1, recommendations: Array<{item: MenuItem, quantity: number}> = []) => {
    // Add main item to cart with specified quantity
    for (let i = 0; i < quantity; i++) {
      onAddToCart(item, selectedOptions, totalPrice);
    }

    // Add recommended items to cart with their quantities
    recommendations.forEach(rec => {
      for (let i = 0; i < rec.quantity; i++) {
        onAddToCart(rec.item, {}, rec.item.price);
      }
    });

    setShowModal(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
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
                  <Badge variant="destructive" className="text-xs">
                    Unavailable
                  </Badge>
                )}
              </div>
              
              {item.description && (
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              )}

              {/* Show quick info about options/recommendations */}
              {(item.optionGroups?.length > 0 || item.recommendations?.length > 0) && item.isAvailable && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {item.optionGroups?.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Customizable
                      </Badge>
                    )}
                    {item.recommendations?.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        <Star className="w-2 h-2 mr-1" />
                        Recommendations
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="flex items-center space-x-1 mb-3">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-600">
                    Contains: {item.allergens.join(', ')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-green-600">
                  ${item.price.toFixed(2)}
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={!item.isAvailable}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unified Add to Cart Modal */}
      <UnifiedAddToCartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={item}
        optionGroups={optionGroups}
        allMenuItems={allMenuItems}
        onAddToCart={handleUnifiedAddToCart}
      />
    </>
  );
}
