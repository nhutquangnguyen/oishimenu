'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Edit2,
  Trash2,
  DollarSign,
  Star,
  AlertTriangle
} from 'lucide-react';
import { DragDropItem } from '@/components/shared';
import { MenuItem } from './types';

interface MenuItemCardProps {
  item: MenuItem;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string, categoryId: string) => void;
  onToggleAvailability: (itemId: string, categoryId: string) => void;
  onToggleFeatured: (itemId: string, categoryId: string) => void;
}

export function MenuItemCard({
  item,
  onEditItem,
  onDeleteItem,
  onToggleAvailability,
  onToggleFeatured
}: MenuItemCardProps) {

  return (
    <DragDropItem id={item.id} itemPrefix="item-">
      <Card className={`hover:shadow-md transition-all duration-200 group ${!item.isAvailable ? 'opacity-60' : ''}`}>
        <CardContent className="p-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                {item.isFeatured && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs py-0 px-1">
                    <Star className="w-2 h-2 mr-0.5" />
                    Featured
                  </Badge>
                )}
                {!item.isAvailable && (
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 text-xs py-0 px-1">
                    Unavailable
                  </Badge>
                )}
              </div>

              {item.description && (
                <p className="text-xs text-gray-600 mb-1 line-clamp-1">{item.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-green-600">
                  <DollarSign className="w-3 h-3" />
                  <span className="text-sm font-semibold">{item.price.toFixed(2)}</span>
                </div>

                {item.image && (
                  <div className="w-8 h-8 rounded overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-1">
                <Switch
                  checked={item.isAvailable}
                  onCheckedChange={() => onToggleAvailability(item.id, item.categoryId)}
                  size="sm"
                />
              </div>

              <div className="flex items-center space-x-1">
                <Switch
                  checked={item.isFeatured}
                  onCheckedChange={() => onToggleFeatured(item.id, item.categoryId)}
                  size="sm"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem(item);
                }}
                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                title="Edit item"
              >
                <Edit2 className="h-3 w-3" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id, item.categoryId);
                }}
                className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                title="Delete item"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DragDropItem>
  );
}
