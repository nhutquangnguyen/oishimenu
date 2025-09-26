'use client';

import { useState } from 'react';
import { PublicMenuItem } from '@/components/menu/PublicMenuItem';
import { PublicMenuCart } from '@/components/merchant/PublicMenuCart';
import { MenuItem } from '@/components/public/types';
import { MenuOptionGroup } from '@/components/menu/types';

export default function TestRecommendationsPage() {
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [showCart, setShowCart] = useState(false);

  // Demo menu items with recommendations
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
      recommendations: ['2', '3', '5'] // Recommends Pepperoni Pizza, Caesar Salad, and Garlic Bread
    },
    {
      id: '2',
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni with mozzarella cheese',
      price: 21.99,
      isAvailable: true,
      isFeatured: false,
      image: '🍕',
      categoryId: 'pizza',
      order: 2,
      recommendations: ['1', '4'] // Recommends Margherita Pizza and Chicken Wings
    },
    {
      id: '3',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing',
      price: 12.99,
      isAvailable: true,
      isFeatured: false,
      image: '🥗',
      categoryId: 'salad',
      order: 3,
      recommendations: ['1', '6'] // Recommends Margherita Pizza and Tiramisu
    },
    {
      id: '4',
      name: 'Chicken Wings',
      description: 'Crispy wings with your choice of sauce',
      price: 16.99,
      isAvailable: true,
      isFeatured: false,
      image: '🍗',
      categoryId: 'appetizer',
      order: 4,
      recommendations: ['2', '7'] // Recommends Pepperoni Pizza and Beer
    },
    {
      id: '5',
      name: 'Garlic Bread',
      description: 'Fresh baked bread with garlic butter',
      price: 8.99,
      isAvailable: true,
      isFeatured: false,
      image: '🍞',
      categoryId: 'appetizer',
      order: 5,
      recommendations: ['1', '2'] // Recommends both pizzas
    },
    {
      id: '6',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      price: 9.99,
      isAvailable: true,
      isFeatured: false,
      image: '🍰',
      categoryId: 'dessert',
      order: 6,
      recommendations: ['3', '1'] // Recommends Caesar Salad and Margherita Pizza
    },
    {
      id: '7',
      name: 'Craft Beer',
      description: 'Local brewery selection',
      price: 6.99,
      isAvailable: true,
      isFeatured: false,
      image: '🍺',
      categoryId: 'beverage',
      order: 7,
      recommendations: ['4', '2'] // Recommends Chicken Wings and Pepperoni Pizza
    }
  ];

  const optionGroups: MenuOptionGroup[] = [];

  const handleAddToCart = (item: MenuItem, selectedOptions: any, totalPrice: number) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      });
    } else {
      setCart(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[itemId];
      return newCart;
    });
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout...');
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍽️ Dish Recommendation System Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any dish to see recommendations appear directly below! 
            You can select multiple recommended items and add them all to cart at once.
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

        {/* Cart */}
        <div className="fixed bottom-4 right-4">
          <PublicMenuCart
            cart={cart}
            menuItems={menuItems}
            showCart={showCart}
            setShowCart={setShowCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onCheckout={handleCheckout}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How the Recommendation System Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">1. Direct Recommendations</h3>
              <p className="text-gray-600 mb-4">
                When you click on any dish, recommendations appear immediately below it.
                You can select multiple recommended items and add them all to cart at once.
              </p>
              
              <h3 className="text-lg font-semibold text-green-600 mb-2">2. Options Modal Recommendations</h3>
              <p className="text-gray-600">
                For dishes with customization options, recommendations also appear in the options modal.
                This allows customers to select options and recommendations in one place.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">3. Admin Configuration</h3>
              <p className="text-gray-600 mb-4">
                Restaurant owners can set recommendations for each menu item through the menu builder.
                This allows for strategic upselling and better customer experience.
              </p>
              
              <h3 className="text-lg font-semibold text-orange-600 mb-2">4. Smart Pairing</h3>
              <p className="text-gray-600">
                The system considers the entire cart context, not just individual items,
                to provide the most relevant recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
