'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle2,
  Plus,
  DollarSign,
  ShoppingCart,
  Search,
  Minus
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  updateOrderItemCompletion,
  updateOrderItemCompletedQuantity,
  addItemToOrder,
  removeItemFromOrder,
  updateOrderItemQuantity,
  getMenuItems,
  FirestoreOrderItem
} from '@/lib/firestore';
import { OrderItemCard } from './OrderItemCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji?: string;
  description?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  category: string;
  isCompleted?: boolean;
  completedQuantity?: number;
}

interface OrderItemManagerProps {
  orderId: string;
  items: OrderItem[];
  onItemsUpdated: () => void;
  isEditable?: boolean;
}

export function OrderItemManager({ orderId, items, onItemsUpdated, isEditable = true }: OrderItemManagerProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load menu items
  useEffect(() => {
    const loadMenuItems = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;

      try {
        const menuCategories = await getMenuItems(currentRestaurant.id, user.uid);
        console.log('Loaded menu categories:', menuCategories);

        if (menuCategories && menuCategories.length > 0) {
          const allItems: MenuItem[] = [];
          menuCategories.forEach((category: any) => {
            console.log('Processing category:', category);
            if (category.items) {
              category.items.forEach((item: any) => {
                allItems.push({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  category: category.name,
                  emoji: item.emoji || '🍽️',
                  description: item.description
                });
              });
            }
          });
          console.log('Converted menu items:', allItems);
          setMenuItems(allItems);
        }
      } catch (error) {
        console.error('Failed to load menu items:', error);
      }
    };

    loadMenuItems();
  }, [user?.uid, currentRestaurant?.id]);

  const toggleItemCompletion = async (itemId: string, currentStatus: boolean) => {
    if (!isEditable) return;

    setIsLoading(true);
    try {
      await updateOrderItemCompletion(orderId, itemId, !currentStatus);
      onItemsUpdated();
    } catch (error) {
      console.error('Failed to update item completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!isEditable) return;

    setIsLoading(true);
    try {
      await updateOrderItemQuantity(orderId, itemId, newQuantity);
      onItemsUpdated();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!isEditable) return;

    setIsLoading(true);
    try {
      await removeItemFromOrder(orderId, itemId);
      onItemsUpdated();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async () => {
    if (!selectedMenuItem) return;

    setIsLoading(true);
    try {
      const item: FirestoreOrderItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: selectedMenuItem.name,
        price: selectedMenuItem.price,
        quantity: quantity,
        category: selectedMenuItem.category,
        specialInstructions: specialInstructions || null,
        isCompleted: false,
        completedQuantity: 0
      };

      await addItemToOrder(orderId, item);
      onItemsUpdated();

      // Reset form
      setSelectedMenuItem(null);
      setQuantity(1);
      setSpecialInstructions('');
      setSearchTerm('');
      setIsAddingItem(false);
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompletedQuantity = async (itemId: string, completedQuantity: number) => {
    if (!isEditable) return;

    setIsLoading(true);
    try {
      await updateOrderItemCompletedQuantity(orderId, itemId, completedQuantity);
      onItemsUpdated();
    } catch (error) {
      console.error('Failed to update completed quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completedItems = items.filter(item => item.isCompleted).length;
  const totalItems = items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-medium text-sm sm:text-base">
              {t('orders.items.itemsCompleted', { completed: completedItems, total: totalItems })}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 sm:w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 min-w-[3rem]">{Math.round(progressPercentage)}%</span>
          </div>
        </div>

        {isEditable && (
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                {t('orders.items.addItem')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add Item from Menu</span>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Menu Items Section - POS Style */}
                <div className="lg:col-span-4">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle>Menu Items</CardTitle>
                      <CardDescription>Select items to add to the order</CardDescription>

                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search menu items..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {menuItems.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">🍽️</div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Menu Items</h3>
                          <p className="text-gray-500 mb-4">No menu items are available.</p>
                        </div>
                      ) : (
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                          {Object.entries(
                            menuItems.reduce((acc, item) => {
                              if (!acc[item.category]) acc[item.category] = [];
                              acc[item.category].push(item);
                              return acc;
                            }, {} as Record<string, MenuItem[]>)
                          )
                            .filter(([category, items]) =>
                              items.some(item =>
                                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                category.toLowerCase().includes(searchTerm.toLowerCase())
                              )
                            )
                            .map(([category, items]) => (
                              <div key={category}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                  {items
                                    .filter(item =>
                                      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      category.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((item) => (
                                      <button
                                        key={item.id}
                                        onClick={() => setSelectedMenuItem(item)}
                                        className={`p-4 border rounded-lg text-left transition-colors min-h-[120px] flex flex-col justify-between ${
                                          selectedMenuItem?.id === item.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                      >
                                        <div className="flex flex-col h-full">
                                          <div className="flex items-center justify-center mb-2">
                                            {item.emoji && <span className="text-3xl">{item.emoji}</span>}
                                          </div>
                                          <div className="text-center flex-1">
                                            <div className="font-medium text-sm mb-1 line-clamp-2">{item.name}</div>
                                            <div className="text-xs text-gray-500 mb-2">{item.category}</div>
                                            <div className="font-bold text-green-600 text-base">${item.price.toFixed(2)}</div>
                                          </div>
                                          <div className="flex justify-center mt-2">
                                            <Plus className="w-4 h-4 text-gray-400" />
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Selected Item & Order Summary */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Selected Item</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      {selectedMenuItem ? (
                        <div className="space-y-3">
                          {/* Item Details */}
                          <div className="p-3 border rounded-lg bg-blue-50">
                            <div className="flex items-center space-x-2 mb-2">
                              {selectedMenuItem.emoji && (
                                <span className="text-xl">{selectedMenuItem.emoji}</span>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">{selectedMenuItem.name}</h3>
                                <p className="text-xs text-gray-600">{selectedMenuItem.category}</p>
                                <p className="text-base font-bold text-green-600">
                                  ${selectedMenuItem.price.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {selectedMenuItem.description && (
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{selectedMenuItem.description}</p>
                            )}

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">Qty:</span>
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                  disabled={quantity <= 1}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="w-2 h-2" />
                                </Button>
                                <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setQuantity(quantity + 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="w-2 h-2" />
                                </Button>
                              </div>
                            </div>

                            {/* Special Instructions */}
                            <div>
                              <Label htmlFor="instructions" className="text-xs">Special Instructions</Label>
                              <Input
                                id="instructions"
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                placeholder="Optional notes..."
                                className="mt-1 h-8 text-xs"
                              />
                            </div>

                            {/* Total */}
                            <div className="pt-2 border-t mt-2">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm">Total:</span>
                                <span className="text-lg font-bold text-green-600">
                                  ${(selectedMenuItem.price * quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Select an item from the menu</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 mt-3">
                    <Button
                      onClick={addItem}
                      disabled={isLoading || !selectedMenuItem}
                      className="w-full bg-blue-600 hover:bg-blue-700 h-9"
                      size="sm"
                    >
                      {isLoading ? 'Adding...' : 'Add to Order'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingItem(false);
                        setSelectedMenuItem(null);
                        setQuantity(1);
                        setSpecialInstructions('');
                        setSearchTerm('');
                      }}
                      className="w-full h-8"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <OrderItemCard
            key={item.id}
            item={item}
            isEditable={isEditable}
            isLoading={isLoading}
            onToggleCompletion={toggleItemCompletion}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onUpdateCompletedQuantity={updateCompletedQuantity}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No items in this order</p>
          <p className="text-sm">Items will appear here once added</p>
        </div>
      )}
    </div>
  );
}