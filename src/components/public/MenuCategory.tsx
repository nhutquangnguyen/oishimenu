'use client';

import { MenuCategory as MenuCategoryType, MenuItem } from './types';
import { MenuItemCard } from './MenuItemCard';
import { Utensils, Sparkles } from 'lucide-react';

interface MenuCategoryProps {
  category: MenuCategoryType;
  onAddToCart: (item: MenuItem, selectedOptions?: any, totalPrice?: number) => void;
  themeColor: string;
  optionGroups?: any[];
  allMenuItems?: MenuItem[];
}

export function MenuCategory({ category, onAddToCart, themeColor, optionGroups = [], allMenuItems = [] }: MenuCategoryProps) {
  const featuredItems = category.items.filter(item => item.isFeatured);
  const regularItems = category.items.filter(item => !item.isFeatured);

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Utensils className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {category.name}
          </h2>
          <p className="text-gray-600 text-sm">
            {category.items.length} delicious options
          </p>
        </div>
      </div>

      {/* Featured Items Section */}
      {featuredItems.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Featured Items</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {featuredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                themeColor={themeColor}
                optionGroups={optionGroups}
                allMenuItems={allMenuItems}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Items */}
      {regularItems.length > 0 && (
        <div>
          {featuredItems.length > 0 && (
            <h3 className="text-lg font-semibold text-gray-900 mb-4">More Options</h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {regularItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              themeColor={themeColor}
              optionGroups={optionGroups}
              allMenuItems={allMenuItems}
            />
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
