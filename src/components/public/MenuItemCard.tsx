'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Star,
  AlertTriangle,
  Heart,
  Zap
} from 'lucide-react';
import { MenuItem } from './types';
import { MenuOptionGroup } from '../menu/types';
import { PublicMenuItem } from '../menu/PublicMenuItem';
import { useState } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, selectedOptions?: any, totalPrice?: number) => void;
  themeColor: string;
  optionGroups?: MenuOptionGroup[];
  allMenuItems?: MenuItem[];
}

export function MenuItemCard({ item, onAddToCart, themeColor, optionGroups = [], allMenuItems = [] }: MenuItemCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (item: MenuItem, selectedOptions?: any, totalPrice?: number) => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
    onAddToCart(item, selectedOptions, totalPrice);
    setIsAdding(false);
  };

  return (
    <PublicMenuItem
      item={item}
      optionGroups={optionGroups}
      onAddToCart={handleAddToCart}
      allMenuItems={allMenuItems}
    />
  );
}
