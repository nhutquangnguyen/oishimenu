'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { CartItem } from './types';

interface FloatingCartBarProps {
  cart: CartItem[];
  totalPrice: number;
  totalItems: number;
  onOpenCart: () => void;
  themeColor: string;
}

export function FloatingCartBar({ 
  cart, 
  totalPrice, 
  totalItems, 
  onOpenCart,
  themeColor
}: FloatingCartBarProps) {
  if (totalItems === 0) return null;

  const subtotal = totalPrice;
  const tax = totalPrice * 0.08; // 8% tax
  const serviceFee = totalPrice * 0.03; // 3% service fee
  const finalTotal = subtotal + tax + serviceFee;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-40 transform transition-transform duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Cart Summary */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" style={{ color: themeColor }} />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  {totalItems}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {totalItems} item{totalItems > 1 ? 's' : ''} in cart
                </p>
                <p className="text-xs text-gray-500">
                  Total: ${finalTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* View Cart Button */}
          <Button
            onClick={onOpenCart}
            className="text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ 
              background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
              border: `1px solid ${themeColor}`
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
