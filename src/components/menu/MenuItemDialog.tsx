'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, DollarSign, Star } from 'lucide-react';
import { MenuItem, MenuOptionGroup } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface MenuItemDialogProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  optionGroups?: MenuOptionGroup[];
  allMenuItems?: MenuItem[];
  categories?: any[];
}


export function MenuItemDialog({ item, isOpen, onClose, onSave, optionGroups = [], allMenuItems = [], categories = [] }: MenuItemDialogProps) {
  const { t } = useLanguage(); // Translation hook

  const [formData, setFormData] = useState<MenuItem>(item);
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>(item.recommendations || []);

  useEffect(() => {
    setFormData(item);
    setSelectedRecommendations(item.recommendations || []);
  }, [item]);

  const handleSave = () => {
    const updatedItem = {
      ...formData,
      recommendations: selectedRecommendations
    };
    onSave(updatedItem);
  };


  const toggleRecommendation = (itemId: string) => {
    setSelectedRecommendations(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('menuBuilder.editItem.title')}</DialogTitle>
          <DialogDescription>
            {t('menuBuilder.editItem.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t('menuBuilder.editItem.itemName')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('menuBuilder.editItem.itemNamePlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="description">{t('menuBuilder.editItem.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('menuBuilder.editItem.descriptionPlaceholder')}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">{t('menuBuilder.editItem.price')}</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="pl-10"
                    placeholder={t('menuBuilder.editItem.pricePlaceholder')}
                  />
                </div>
              </div>
            </div>
          </div>



          {/* Status Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('menuBuilder.editItem.availability')}</Label>
                <p className="text-sm text-gray-500">{t('menuBuilder.editItem.availabilityDescription')}</p>
              </div>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('menuBuilder.editItem.featuredItem')}</Label>
                <p className="text-sm text-gray-500">{t('menuBuilder.editItem.featuredDescription')}</p>
              </div>
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
            </div>
          </div>

          {/* Image Upload (placeholder) */}
          <div>
            <Label>{t('menuBuilder.editItem.itemImage')}</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-500">
                <Star className="w-8 h-8 mx-auto mb-2" />
                <p>{t('menuBuilder.editItem.imageUploadSoon')}</p>
                <p className="text-sm">{t('menuBuilder.editItem.imageUploadInstructions')}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <Label className="text-base font-medium">{t('menuBuilder.editItem.recommendedItems')}</Label>
            <p className="text-sm text-gray-500 mb-4">
              {item.name === 'New Item'
                ? t('menuBuilder.editItem.recommendationsNewItem')
                : t('menuBuilder.editItem.recommendationsDescription', { itemName: item.name })
              }
            </p>
            
            
            {item.name === 'New Item' ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">{t('menuBuilder.editItem.saveFirstTitle')}</p>
                <p className="text-sm">{t('menuBuilder.editItem.saveFirstDescription')}</p>
              </div>
            ) : (() => {
              const realItems = allMenuItems.filter(menuItem => 
                menuItem.id !== item.id && 
                menuItem.name.trim() !== '' &&
                menuItem.name !== 'New Item'
              );
              return realItems.length === 0;
            })() ? (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>{t('menuBuilder.editItem.noItemsAvailable')}</p>
                <p className="text-sm text-gray-400 mt-2">{t('menuBuilder.editItem.createItemsFirst')}</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-4">
                {(() => {
                  const filteredItems = allMenuItems.filter(menuItem => 
                    menuItem.id !== item.id && 
                    menuItem.name.trim() !== '' &&
                    menuItem.name !== 'New Item'
                  );
                  return filteredItems;
                })().map(menuItem => (
                    <div
                      key={menuItem.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={`recommendation-${menuItem.id}`}
                        checked={selectedRecommendations.includes(menuItem.id)}
                        onCheckedChange={() => toggleRecommendation(menuItem.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Label 
                            htmlFor={`recommendation-${menuItem.id}`}
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            {menuItem.name}
                          </Label>
                          {menuItem.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              {t('menuBuilder.editItem.featured')}
                            </Badge>
                          )}
                          {!menuItem.isAvailable && (
                            <Badge variant="secondary" className="text-xs">
                              {t('menuBuilder.editItem.unavailable')}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{menuItem.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            ${menuItem.price.toFixed(2)}
                          </span>
                          {menuItem.allergens && menuItem.allergens.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {t('menuBuilder.editItem.allergens')}: {menuItem.allergens.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            
            {selectedRecommendations.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">
                    {t('menuBuilder.editItem.selectedRecommendations', { count: selectedRecommendations.length })}
                  </p>
                </div>
                <div className="space-y-2">
                  {selectedRecommendations.map(recId => {
                    const recItem = allMenuItems.find(item => item.id === recId);
                    return recItem ? (
                      <div key={recId} className="flex items-center justify-between bg-white rounded border border-blue-200 p-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={true}
                            disabled
                            className="pointer-events-none"
                          />
                          <span className="text-sm font-medium text-gray-900">{recItem.name}</span>
                          <span className="text-xs text-gray-500">${recItem.price.toFixed(2)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRecommendation(recId)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('menuBuilder.editItem.saveChanges')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
