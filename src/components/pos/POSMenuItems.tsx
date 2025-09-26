'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface POSItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  emoji: string;
}

interface POSMenuItemsProps {
  groupedItems: Record<string, POSItem[]>;
  onAddToCart: (item: POSItem) => void;
}

export function POSMenuItems({ groupedItems, onAddToCart }: POSMenuItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Items</CardTitle>
        <CardDescription>Click to add items to the order</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Menu Items Available</h3>
            <p className="text-gray-500 mb-4">Create your menu in the Menu Builder to start taking orders.</p>
            <Button onClick={() => window.open('/dashboard/menu', '_blank')}>
              Go to Menu Builder
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onAddToCart(item)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{item.emoji}</span>
                            <span className="font-medium text-sm">{item.name}</span>
                          </div>
                          <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400" />
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
  );
}
