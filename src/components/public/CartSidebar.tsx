'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, Trash2, CreditCard, Clock } from 'lucide-react';
import { CartItem } from './types';
import { MenuOptionGroup } from '../menu/types';

interface CartSidebarProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  totalPrice: number;
  totalItems: number;
  optionGroups?: MenuOptionGroup[];
}

export function CartSidebar({ 
  isOpen, 
  cart, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  totalPrice, 
  totalItems,
  optionGroups = []
}: CartSidebarProps) {
  if (!isOpen) return null;

  const subtotal = totalPrice;
  const tax = totalPrice * 0.08; // 8% tax
  const serviceFee = totalPrice * 0.03; // 3% service fee
  const finalTotal = subtotal + tax + serviceFee;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Your Order</h2>
                <p className="text-blue-100 text-sm">{totalItems} items</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{cartItem.item.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${cartItem.totalPrice.toFixed(2)} each
                      </p>
                      {/* Display selected options */}
                      {cartItem.selectedOptions && Object.keys(cartItem.selectedOptions).length > 0 && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(cartItem.selectedOptions).map(([groupId, optionIds]) => {
                            if (!Array.isArray(optionIds) || optionIds.length === 0) return null;
                            
                            // Find the option group and get option names
                            const optionGroup = optionGroups.find(g => g.id === groupId);
                            if (!optionGroup) return null;
                            
                            const optionDetails = optionIds.map(optionId => {
                              const option = optionGroup.options.find(o => o.id === optionId);
                              if (!option) return optionId;
                              return `${option.name}${option.price > 0 ? ` (+$${option.price.toFixed(2)})` : ''}`;
                            });
                            
                            return (
                              <div key={groupId} className="text-xs text-gray-500">
                                <span className="font-medium">{optionGroup.name}:</span> {optionDetails.join(', ')}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(cartItem.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Badge variant="secondary" className="px-3 py-1">
                        {cartItem.quantity}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${(cartItem.totalPrice * cartItem.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="border-t bg-white p-6 space-y-4">
            {/* Order Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee (3%)</span>
                <span className="font-medium">${serviceFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Estimated preparation time: 15-20 minutes</span>
            </div>

            {/* Checkout Button */}
            <Button 
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
