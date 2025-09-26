'use client';

import { useState } from 'react';
import { PublicMenuItem } from '@/components/menu/PublicMenuItem';
import { MenuItem } from '@/components/public/types';
import { MenuOptionGroup } from '@/components/menu/types';

export default function TestOptionsRecommendationsPage() {
  const [cart, setCart] = useState<{[key: string]: number}>({});

  // Demo menu items with recommendations and options
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomato sauce, and basil',
      price: 18.99,
      isAvailable: true,
      isFeatured: true,
      image: '🍕',
      categoryId: 'pizza',
      order: 1,
      optionGroups: ['size', 'toppings'], // This item has options
      recommendations: ['2', '3', '5'] // Recommends other items
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing',
      price: 12.99,
      isAvailable: true,
      isFeatured: false,
      image: '🥗',
      categoryId: 'salad',
      order: 2,
      recommendations: ['1', '6'] // Recommends pizza and dessert
    },
    {
      id: '3',
      name: 'Garlic Bread',
      description: 'Fresh baked bread with garlic butter',
      price: 8.99,
      isAvailable: true,
      isFeatured: false,
      image: '🍞',
      categoryId: 'appetizer',
      order: 3,
      recommendations: ['1', '2'] // Recommends pizza and salad
    },
    {
      id: '4',
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni with mozzarella cheese',
      price: 21.99,
      isAvailable: true,
      isFeatured: false,
      image: '🍕',
      categoryId: 'pizza',
      order: 4,
      optionGroups: ['size', 'toppings'], // This item also has options
      recommendations: ['2', '3'] // Recommends salad and garlic bread
    },
    {
      id: '5',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      price: 9.99,
      isAvailable: true,
      isFeatured: false,
      image: '🍰',
      categoryId: 'dessert',
      order: 5,
      recommendations: ['1', '2'] // Recommends pizza and salad
    },
    {
      id: '6',
      name: 'Craft Beer',
      description: 'Local brewery selection',
      price: 6.99,
      isAvailable: true,
      isFeatured: false,
      image: '🍺',
      categoryId: 'beverage',
      order: 6,
      recommendations: ['1', '4'] // Recommends both pizzas
    }
  ];

  // Demo option groups
  const optionGroups: MenuOptionGroup[] = [
    {
      id: 'size',
      name: 'Size',
      description: 'Choose your size',
      type: 'single',
      isRequired: true,
      options: [
        { id: 'small', name: 'Small', price: 0, isAvailable: true, isDefault: true },
        { id: 'medium', name: 'Medium', price: 3.00, isAvailable: true, isDefault: false },
        { id: 'large', name: 'Large', price: 6.00, isAvailable: true, isDefault: false }
      ],
      restaurantId: 'demo'
    },
    {
      id: 'toppings',
      name: 'Extra Toppings',
      description: 'Add extra toppings',
      type: 'multiple',
      isRequired: false,
      minSelections: 0,
      maxSelections: 3,
      options: [
        { id: 'extra-cheese', name: 'Extra Cheese', price: 2.00, isAvailable: true, isDefault: false },
        { id: 'mushrooms', name: 'Mushrooms', price: 1.50, isAvailable: true, isDefault: false },
        { id: 'pepperoni', name: 'Pepperoni', price: 2.50, isAvailable: true, isDefault: false },
        { id: 'olives', name: 'Olives', price: 1.00, isAvailable: true, isDefault: false }
      ],
      restaurantId: 'demo'
    }
  ];

  const handleAddToCart = (item: MenuItem, selectedOptions: any, totalPrice: number) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    console.log('Added to cart:', { item: item.name, selectedOptions, totalPrice });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍽️ Options Modal Recommendations Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on dishes with options (like the pizzas) to see recommendations in the options modal.
            The recommendations should appear between the options and the quantity section.
          </p>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => (
            <PublicMenuItem
              key={item.id}
              item={item}
              optionGroups={optionGroups}
              onAddToCart={handleAddToCart}
              allMenuItems={menuItems}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">1. Test Items with Options</h3>
              <p className="text-gray-600 mb-4">
                Click on "Margherita Pizza" or "Pepperoni Pizza" - these have size and topping options.
                You should see recommendations appear in the options modal.
              </p>
              
              <h3 className="text-lg font-semibold text-green-600 mb-2">2. Test Items without Options</h3>
              <p className="text-gray-600">
                Click on "Caesar Salad" or "Garlic Bread" - these don't have options.
                You should see recommendations appear directly below the item.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">3. Expected Behavior</h3>
              <p className="text-gray-600 mb-4">
                In the options modal, recommendations should appear between the options and quantity sections.
                You can select multiple recommendations and add them all to cart at once.
              </p>
              
              <h3 className="text-lg font-semibold text-orange-600 mb-2">4. Debug Info</h3>
              <p className="text-gray-600">
                Check the browser console for debug logs showing recommendation data.
                The debug section in the modal will show recommendation counts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
