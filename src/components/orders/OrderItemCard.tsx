'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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

interface OrderItemCardProps {
  item: OrderItem;
  isEditable: boolean;
  isLoading: boolean;
  onToggleCompletion: (itemId: string, currentStatus: boolean) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateCompletedQuantity?: (itemId: string, completedQuantity: number) => void;
}

export function OrderItemCard({
  item,
  isEditable,
  isLoading,
  onToggleCompletion,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateCompletedQuantity
}: OrderItemCardProps) {
  const { t } = useLanguage();

  return (
    <Card className={`transition-all duration-200 ${
      item.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Top Row: Item Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* Completion Toggle */}
              <button
                onClick={() => onToggleCompletion(item.id, item.isCompleted || false)}
                disabled={!isEditable || isLoading}
                className={`p-1 rounded-full transition-colors mt-1 flex-shrink-0 ${
                  !isEditable || isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'
                }`}
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className={`font-medium ${
                    item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </h4>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {item.category}
                  </Badge>
                  {(item.completedQuantity || 0) > 0 && (
                    <Badge className={`text-xs flex-shrink-0 ${
                      item.isCompleted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.isCompleted
                        ? t('orders.items.completed')
                        : `${item.completedQuantity}/${item.quantity} complete`
                      }
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  ${item.price.toFixed(2)} each
                </div>

                {item.specialInstructions && (
                  <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border-l-2 border-orange-200">
                    <strong>Note:</strong> {item.specialInstructions}
                  </div>
                )}
              </div>
            </div>

            {/* Remove Button */}
            {isEditable && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveItem(item.id)}
                disabled={isLoading}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Bottom Row: Quantity and Price */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              {isEditable ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 font-medium">Qty:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isLoading || item.quantity <= 1}
                    className="h-7 w-7 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isLoading}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Quantity: {item.quantity}</span>
              )}
            </div>

            {/* Price Display */}
            <div className="text-right">
              <div className="font-bold text-lg text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              {item.quantity > 1 && (
                <div className="text-xs text-gray-500">
                  {item.quantity} × ${item.price.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Completion Quantity Controls */}
          {isEditable && onUpdateCompletedQuantity && item.quantity > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 font-medium">Completed:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateCompletedQuantity(item.id, Math.max(0, (item.completedQuantity || 0) - 1))}
                  disabled={isLoading || (item.completedQuantity || 0) <= 0}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-12 text-center font-semibold">
                  {item.completedQuantity || 0}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateCompletedQuantity(item.id, Math.min(item.quantity, (item.completedQuantity || 0) + 1))}
                  disabled={isLoading || (item.completedQuantity || 0) >= item.quantity}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                {item.quantity - (item.completedQuantity || 0)} remaining
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}