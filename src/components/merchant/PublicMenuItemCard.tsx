'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Heart } from 'lucide-react';

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

interface PublicMenuItemCardProps {
  item: MenuItem;
  cartQuantity: number;
  onAddToCart: (itemId: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  onToggleFavorite: (itemId: string) => void;
}

export function PublicMenuItemCard({
  item,
  cartQuantity,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite
}: PublicMenuItemCardProps) {
  return (
    <Card 
      className={`bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
        !item.isAvailable ? 'opacity-60' : ''
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">{item.image}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {item.category}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onToggleFavorite(item.id)}
              className={item.isFavorite ? "text-red-500" : "text-gray-400"}
            >
              <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Badge 
              variant={item.isAvailable ? "default" : "secondary"}
              className={item.isAvailable ? 
                "bg-green-100 text-green-800" : 
                "bg-red-100 text-red-800"
              }
            >
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              {item.rating}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {item.prepTime}min
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900">
            ${item.price}
          </div>
        </div>
        
        {item.isAvailable && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRemoveFromCart(item.id)}
                disabled={cartQuantity === 0}
                className="w-8 h-8 p-0"
              >
                -
              </Button>
              <span className="w-8 text-center">{cartQuantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddToCart(item.id)}
                className="w-8 h-8 p-0"
              >
                +
              </Button>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              onClick={() => onAddToCart(item.id)}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
