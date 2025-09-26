'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MenuItem, MenuOptionGroup, MenuOption } from './types';
import { DollarSign, Plus, Minus, Star } from 'lucide-react';
import { SingleChoiceOptions } from './SingleChoiceOptions';

interface ItemOptionsSelectorProps {
  item: MenuItem;
  optionGroups: MenuOptionGroup[];
  onAddToCart: (item: MenuItem, selectedOptions: SelectedOptions, totalPrice: number) => void;
  onClose: () => void;
  allMenuItems?: MenuItem[];
}

interface SelectedOptions {
  [optionGroupId: string]: string[]; // For multiple choice, array of selected option IDs
}

interface OptionSelection {
  groupId: string;
  groupName: string;
  type: 'single' | 'multiple';
  isRequired: boolean;
  minSelections?: number;
  maxSelections?: number;
  options: MenuOption[];
  selected: string[];
}

export function ItemOptionsSelector({ item, optionGroups, onAddToCart, onClose, allMenuItems = [] }: ItemOptionsSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [recommendationQuantities, setRecommendationQuantities] = useState<{[key: string]: number}>({});

  // Get option groups that are linked to this item - memoized to prevent infinite re-renders
  const itemOptionGroups = useMemo(() => 
    optionGroups.filter(group => 
      item.optionGroups?.includes(group.id)
    ), [optionGroups, item.optionGroups]
  );

  // Get recommended items
  const recommendedItems = useMemo(() => {
    if (!item.recommendations || !allMenuItems.length) return [];
    return allMenuItems.filter(menuItem => 
      item.recommendations?.includes(menuItem.id) &&
      menuItem.isAvailable
    );
  }, [item.recommendations, allMenuItems]);

  // Initialize selected options with default values
  useEffect(() => {
    const initialSelections: SelectedOptions = {};
    
    itemOptionGroups.forEach(group => {
      const defaultOptions = group.options.filter(option => option.isDefault);
      if (group.type === 'single') {
        // For single choice, select the first default or first available option
        const defaultOption = defaultOptions[0] || group.options.find(opt => opt.isAvailable);
        if (defaultOption) {
          initialSelections[group.id] = [defaultOption.id];
        }
      } else {
        // For multiple choice, select all default options
        initialSelections[group.id] = defaultOptions.map(opt => opt.id);
      }
    });
    
    setSelectedOptions(initialSelections);
  }, [itemOptionGroups]);

  // Calculate total price whenever selections change
  useEffect(() => {
    let basePrice = item.price;
    let optionsPrice = 0;
    let recommendationsPrice = 0;

    // Calculate options price
    Object.values(selectedOptions).forEach(optionIds => {
      optionIds.forEach(optionId => {
        const option = itemOptionGroups
          .flatMap(group => group.options)
          .find(opt => opt.id === optionId);
        if (option) {
          optionsPrice += option.price;
        }
      });
    });

    // Calculate recommendations price
    selectedRecommendations.forEach(recId => {
      const recItem = allMenuItems.find(m => m.id === recId);
      const recQuantity = recommendationQuantities[recId] || 1;
      if (recItem) {
        recommendationsPrice += recItem.price * recQuantity;
      }
    });

    setTotalPrice((basePrice + optionsPrice) * quantity + recommendationsPrice);
  }, [selectedOptions, quantity, item.price, itemOptionGroups, selectedRecommendations, recommendationQuantities, allMenuItems]);

  const handleOptionChange = (groupId: string, optionId: string, isSelected: boolean) => {
    const group = itemOptionGroups.find(g => g.id === groupId);
    if (!group) return;

    setSelectedOptions(prev => {
      const current = prev[groupId] || [];
      
      if (group.type === 'single') {
        // Single choice - replace selection
        return {
          ...prev,
          [groupId]: isSelected ? [optionId] : []
        };
      } else {
        // Multiple choice - add/remove from selection
        let newSelection;
        if (isSelected) {
          newSelection = [...current, optionId];
        } else {
          newSelection = current.filter(id => id !== optionId);
        }
        
        return {
          ...prev,
          [groupId]: newSelection
        };
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
    // Validate required selections
    const missingRequired = itemOptionGroups.filter(group => {
      if (!group.isRequired) return false;
      const selected = selectedOptions[group.id] || [];
      return selected.length === 0;
    });

    if (missingRequired.length > 0) {
      alert(`Please select options for: ${missingRequired.map(g => g.name).join(', ')}`);
      return;
    }

    // Validate min/max selections for multiple choice groups
    const invalidSelections = itemOptionGroups.filter(group => {
      if (group.type !== 'multiple') return false;
      const selected = selectedOptions[group.id] || [];
      const min = group.minSelections || 0;
      const max = group.maxSelections || Infinity;
      return selected.length < min || selected.length > max;
    });

    if (invalidSelections.length > 0) {
      const invalidGroup = invalidSelections[0];
      const min = invalidGroup.minSelections || 0;
      const max = invalidGroup.maxSelections || Infinity;
      alert(`Please select between ${min} and ${max} options for ${invalidGroup.name}`);
      return;
    }

    // Add main item to cart
    onAddToCart(item, selectedOptions, totalPrice);
    
    // Add selected recommendations to cart with quantities
    selectedRecommendations.forEach(recId => {
      const recItem = allMenuItems.find(m => m.id === recId);
      const recQuantity = recommendationQuantities[recId] || 1;
      if (recItem) {
        // Add the recommended item multiple times based on quantity
        for (let i = 0; i < recQuantity; i++) {
          onAddToCart(recItem, {}, recItem.price);
        }
      }
    });
  };

  const renderOptionGroup = (group: MenuOptionGroup) => {
    const selected = selectedOptions[group.id] || [];
    const availableOptions = group.options.filter(option => option.isAvailable);

    return (
      <div key={group.id} className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {group.name}
            {group.isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {group.type === 'multiple' && group.minSelections && group.maxSelections && (
            <span className="text-xs text-gray-500">
              Choose {group.minSelections}-{group.maxSelections}
            </span>
          )}
        </div>

        {group.description && (
          <p className="text-xs text-gray-600">{group.description}</p>
        )}

        {group.type === 'single' ? (
          <SingleChoiceOptions
            group={group}
            selected={selected}
            onSelectionChange={(groupId, value) => {
              setSelectedOptions(prev => ({
                ...prev,
                [groupId]: [value]
              }));
            }}
          />
        ) : (
          <div className="space-y-2">
            {availableOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${group.id}-${option.id}`}
                  checked={selected.includes(option.id)}
                  onCheckedChange={(checked) => handleOptionChange(group.id, option.id, !!checked)}
                />
                <Label htmlFor={`${group.id}-${option.id}`} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span>{option.name}</span>
                    {option.price > 0 && (
                      <span className="text-sm font-medium text-green-600">
                        +${option.price.toFixed(2)}
                      </span>
                    )}
                    {option.price === 0 && (
                      <span className="text-sm text-gray-500">No extra cost</span>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{item.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          {item.description && (
            <p className="text-gray-600 text-sm">{item.description}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Option Groups */}
          {itemOptionGroups.length > 0 ? (
            <div className="space-y-6">
              {itemOptionGroups.map(renderOptionGroup)}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No options available for this item.
            </div>
          )}

          {/* Recommendations */}
          {recommendedItems.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    You might also like
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Add these items to complete your order
                </p>
                
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {recommendedItems.map((recItem) => (
                    <div
                      key={recItem.id}
                      className="flex-shrink-0 w-64 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
                          
                          {/* Quantity Controls */}
                          {selectedRecommendations.includes(recItem.id) && (
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateRecommendationQuantity(recItem.id, (recommendationQuantities[recItem.id] || 1) - 1)}
                                className="w-6 h-6 p-0"
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {recommendationQuantities[recItem.id] || 1}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateRecommendationQuantity(recItem.id, (recommendationQuantities[recItem.id] || 1) + 1)}
                                className="w-6 h-6 p-0"
                              >
                                +
                              </Button>
                              <span className="text-xs text-gray-500 ml-2">
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
            </>
          )}

          <Separator />

          {/* Quantity and Total */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Quantity</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddToCart} className="flex-1 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
