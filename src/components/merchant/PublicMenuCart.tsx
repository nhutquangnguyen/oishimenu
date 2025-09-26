'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckoutRecommendations } from '../menu/CheckoutRecommendations';
import { ShoppingCart, CheckCircle } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  rating: number;
  prepTime: number;
  isFavorite?: boolean;
}

interface PublicMenuCartProps {
  cart: {[key: string]: number};
  menuItems: MenuItem[];
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onCheckout: () => void;
  onAddToCart?: (item: MenuItem, selectedOptions: any, totalPrice: number) => void;
}

export function PublicMenuCart({
  cart,
  menuItems,
  showCart,
  setShowCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
  onAddToCart
}: PublicMenuCartProps) {
  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(i => i.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  if (!showCart) {
    return (
      <Button 
        variant="outline"
        onClick={() => setShowCart(true)}
        className="relative"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Cart
        {getCartItemCount() > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
            {getCartItemCount()}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCart(false)}
            >
              ×
            </Button>
          </div>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          {Object.keys(cart).length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(cart).map(([itemId, quantity]) => {
                const item = menuItems.find(i => i.id === itemId);
                if (!item) return null;
                
                return (
                  <div key={itemId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-sm">{item.image}</span>
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price} × {quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemoveFromCart(itemId)}
                        className="w-6 h-6 p-0"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(itemId, quantity + 1)}
                        className="w-6 h-6 p-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {/* Checkout Recommendations */}
              {onAddToCart && (
                <CheckoutRecommendations
                  cartItems={Object.entries(cart).map(([itemId, quantity]) => {
                    const item = menuItems.find(i => i.id === itemId);
                    return item ? { ...item, quantity } : null;
                  }).filter(Boolean) as MenuItem[]}
                  allMenuItems={menuItems}
                  onAddToCart={onAddToCart}
                />
              )}
            </div>
          )}
        </div>
        
        {Object.keys(cart).length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold">${getCartTotal().toFixed(2)}</span>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              onClick={onCheckout}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
