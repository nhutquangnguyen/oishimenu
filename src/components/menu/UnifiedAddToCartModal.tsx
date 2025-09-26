'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Minus, Star, AlertTriangle } from 'lucide-react';
import { MenuItem } from '../public/types';
import { MenuOptionGroup } from './types';

interface UnifiedAddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  optionGroups: MenuOptionGroup[];
  allMenuItems: MenuItem[];
  onAddToCart: (item: MenuItem, selectedOptions: any, totalPrice: number, quantity: number, recommendations: Array<{item: MenuItem, quantity: number}>) => void;
}

export function UnifiedAddToCartModal({
  isOpen,
  onClose,
  item,
  optionGroups,
  allMenuItems,
  onAddToCart
}: UnifiedAddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{[groupId: string]: string[]}>({});
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [recommendationQuantities, setRecommendationQuantities] = useState<{[key: string]: number}>({});

  // Reset state when modal opens or item changes
  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setSelectedOptions({});
      setSelectedRecommendations([]);
      setRecommendationQuantities({});
    }
  }, [isOpen, item?.id]);

  // Get item's option groups
  const itemOptionGroups = useMemo(() => {
    if (!item) return [];
    return optionGroups.filter(group =>
      item.optionGroups?.includes(group.id)
    );
  }, [optionGroups, item?.optionGroups]);

  // Get recommended items
  const recommendedItems = useMemo(() => {
    if (!item?.recommendations || !allMenuItems.length) return [];
    return allMenuItems.filter(menuItem =>
      item.recommendations?.includes(menuItem.id) &&
      menuItem.isAvailable
    );
  }, [item?.recommendations, allMenuItems]);

  // Calculate total price including main item + options + recommendations
  const totalPrice = useMemo(() => {
    if (!item) return 0;

    // Main item price
    let mainItemPrice = item.price;

    // Add option prices to main item
    Object.entries(selectedOptions).forEach(([groupId, optionIds]) => {
      const group = optionGroups.find(g => g.id === groupId);
      if (group) {
        optionIds.forEach(optionId => {
          const option = group.options.find(o => o.id === optionId);
          if (option && option.price) {
            mainItemPrice += option.price;
          }
        });
      }
    });

    // Calculate total for main item with quantity
    let totalPrice = mainItemPrice * quantity;

    // Add recommendation prices
    selectedRecommendations.forEach(recId => {
      const recItem = allMenuItems.find(m => m.id === recId);
      if (recItem) {
        const recQuantity = recommendationQuantities[recId] || 1;
        totalPrice += recItem.price * recQuantity;
      }
    });

    return totalPrice;
  }, [item, selectedOptions, optionGroups, quantity, selectedRecommendations, recommendationQuantities, allMenuItems]);

  const handleOptionChange = (groupId: string, optionId: string, isChecked: boolean) => {
    setSelectedOptions(prev => {
      const group = optionGroups.find(g => g.id === groupId);
      if (!group) return prev;

      const currentOptions = prev[groupId] || [];

      if (group.type === 'single') {
        // Single selection - replace
        return { ...prev, [groupId]: isChecked ? [optionId] : [] };
      } else {
        // Multiple selection - add/remove
        if (isChecked) {
          return { ...prev, [groupId]: [...currentOptions, optionId] };
        } else {
          return { ...prev, [groupId]: currentOptions.filter(id => id !== optionId) };
        }
      }
    });
  };

  const toggleRecommendation = (itemId: string) => {
    setSelectedRecommendations(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );

    // Initialize quantity to 1 when adding recommendation
    if (!selectedRecommendations.includes(itemId)) {
      setRecommendationQuantities(prev => ({
        ...prev,
        [itemId]: 1
      }));
    } else {
      // Remove quantity when removing recommendation
      setRecommendationQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[itemId];
        return newQuantities;
      });
    }
  };

  const updateRecommendationQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove from recommendations if quantity is 0
      setSelectedRecommendations(prev => prev.filter(id => id !== itemId));
      setRecommendationQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[itemId];
        return newQuantities;
      });
    } else {
      setRecommendationQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  const handleAddToCart = () => {
    if (!item) return;

    // Prepare recommendations data
    const recommendationsData = selectedRecommendations.map(recId => {
      const recItem = allMenuItems.find(m => m.id === recId);
      return {
        item: recItem!,
        quantity: recommendationQuantities[recId] || 1
      };
    }).filter(rec => rec.item);

    onAddToCart(item, selectedOptions, totalPrice, quantity, recommendationsData);
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{item.name}</span>
            {item.isFeatured && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-x-hidden">
          {/* Item Description */}
          {item.description && (
            <p className="text-gray-600">{item.description}</p>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">
                Contains: {item.allergens.join(', ')}
              </span>
            </div>
          )}

          {/* Options */}
          {itemOptionGroups.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Customize Your Order</h3>
              {itemOptionGroups.map(group => (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{group.name}</h4>
                    {group.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>

                  {group.type === 'single' ? (
                    <RadioGroup
                      value={selectedOptions[group.id]?.[0] || ''}
                      onValueChange={(value) => handleOptionChange(group.id, value, true)}
                    >
                      {group.options.map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`${group.id}-${option.id}`} />
                          <Label
                            htmlFor={`${group.id}-${option.id}`}
                            className="flex-1 flex items-center justify-between cursor-pointer"
                          >
                            <span>{option.name}</span>
                            {option.price && option.price > 0 && (
                              <span className="text-green-600 font-medium">+${option.price.toFixed(2)}</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {group.options.map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${group.id}-${option.id}`}
                            checked={selectedOptions[group.id]?.includes(option.id) || false}
                            onCheckedChange={(checked) =>
                              handleOptionChange(group.id, option.id, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`${group.id}-${option.id}`}
                            className="flex-1 flex items-center justify-between cursor-pointer"
                          >
                            <span>{option.name}</span>
                            {option.price && option.price > 0 && (
                              <span className="text-green-600 font-medium">+${option.price.toFixed(2)}</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {recommendedItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <Star className="w-5 h-5 text-blue-600" />
                <span>You might also like</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select additional items to complete your order
              </p>

              {/* Horizontal Scrolling Recommendations */}
              <div className="w-full">
                <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {recommendedItems.map((recItem) => (
                    <div
                      key={recItem.id}
                      className="flex-shrink-0 w-64 min-w-[16rem] p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors bg-white"
                    >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={`recommendation-${recItem.id}`}
                        checked={selectedRecommendations.includes(recItem.id)}
                        onCheckedChange={() => toggleRecommendation(recItem.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Label
                            htmlFor={`recommendation-${recItem.id}`}
                            className="font-medium text-gray-900 cursor-pointer text-sm"
                          >
                            {recItem.name}
                          </Label>
                          <span className="text-sm font-medium text-green-600">
                            ${recItem.price.toFixed(2)}
                          </span>
                        </div>
                        {recItem.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">{recItem.description}</p>
                        )}

                        {/* Recommendation Quantity Controls */}
                        {selectedRecommendations.includes(recItem.id) && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRecommendationQuantity(recItem.id, (recommendationQuantities[recItem.id] || 1) - 1)}
                              className="w-6 h-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">
                              {recommendationQuantities[recItem.id] || 1}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRecommendationQuantity(recItem.id, (recommendationQuantities[recItem.id] || 1) + 1)}
                              className="w-6 h-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <span className="text-xs text-gray-500 ml-1">
                              ${((recItem.price * (recommendationQuantities[recItem.id] || 1)).toFixed(2))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quantity</h3>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center text-xl font-semibold">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Total & Add to Cart */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between text-xl font-semibold">
              <span>Total</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Cart
              {quantity > 1 && ` (${quantity} items)`}
              {selectedRecommendations.length > 0 && ` + ${Object.values(recommendationQuantities).reduce((sum, qty) => sum + qty, 0)} extras`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}