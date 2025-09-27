'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MenuCategory, CartItem, MenuItem } from './types';
import { themes } from '../menu/constants';
import { MenuHeader } from './MenuHeader';
import { RestaurantInfo } from './RestaurantInfo';
import { MenuCategory as MenuCategoryComponent } from './MenuCategory';
import { CartSidebar } from './CartSidebar';
import { FloatingCartBar } from './FloatingCartBar';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { NoMenuState } from './NoMenuState';

export function PublicMenu({ restaurantId }: { restaurantId: string }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuData, setMenuData] = useState<{ categories: MenuCategory[]; isPublic: boolean; theme: string; restaurant?: any; showPoweredBy?: boolean } | null>(null);
  const [optionGroups, setOptionGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get theme from menu data or default to blue
  const [selectedTheme, setSelectedTheme] = useState('blue');
  const [isClient, setIsClient] = useState(false);

  // Set client state after hydration
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Update theme when menu data changes
  React.useEffect(() => {
    if (menuData?.theme) {
      setSelectedTheme(menuData.theme);
    }
  }, [menuData?.theme]);

  // Load menu data from Firestore
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the restaurant ID directly - no authentication required for public menus
        const actualRestaurantId = restaurantId;
        
        
        const menuDoc = await getDoc(doc(db, 'menus', actualRestaurantId));
        
            
        if (menuDoc.exists()) {
              const data = menuDoc.data();
              
              if (data.isPublic === false) {
                setError('This menu is not publicly available.');
                return;
              }
              
              const menuDataToSet = {
                categories: data.categories || [],
                isPublic: data.isPublic || false,
                theme: data.theme || 'blue',
                restaurant: data.restaurant,
                showPoweredBy: data.showPoweredBy !== false // Default to true unless explicitly disabled
              };
              
              // Load option groups
              const optionGroupsData = data.optionGroups || [];
              setOptionGroups(optionGroupsData);
              
              setMenuData(menuDataToSet);
            } else {
              // No menu found - show helpful message
              setError('No menu available yet. The restaurant is setting up their digital menu. Please check back soon!');
            }
      } catch (error) {
        console.error('Error loading menu data:', error);
        setError('Unable to load menu at this time. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadMenuData();
  }, [restaurantId]);

  const addToCart = (item: MenuItem, selectedOptions?: any, totalPrice?: number) => {
    if (!item.isAvailable) return;
    
    const finalPrice = totalPrice || item.price;
    
    setCart(prev => {
      // Create a unique key for this cart item based on item ID and selected options
      const optionsKey = selectedOptions ? JSON.stringify(selectedOptions) : 'no-options';
      const cartItemKey = `${item.id}-${optionsKey}`;
      
      const existingItem = prev.find(cartItem => cartItem.id === cartItemKey);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === cartItemKey
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      const newCartItem = {
        id: cartItemKey,
        item,
        quantity: 1,
        selectedOptions: selectedOptions || {},
        totalPrice: finalPrice
      };
      
      return [...prev, newCartItem];
    });

  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(cartItem => cartItem.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCart(prev =>
      prev.map(cartItem =>
        cartItem.id === cartItemId
          ? { ...cartItem, quantity }
          : cartItem
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => 
      total + (cartItem.totalPrice * cartItem.quantity), 0
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Calculate final total with tax and service fee
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.08; // 8% tax
    const serviceFee = subtotal * 0.03; // 3% service fee
    const finalTotal = subtotal + tax + serviceFee;
    
    // Show checkout confirmation
    const orderSummary = cart.map(cartItem => {
      const optionsText = cartItem.selectedOptions && Object.keys(cartItem.selectedOptions).length > 0 
        ? ` (${Object.entries(cartItem.selectedOptions).map(([groupId, optionIds]) => {
            const optionGroup = optionGroups.find(g => g.id === groupId);
            if (!optionGroup || !Array.isArray(optionIds)) return '';
            const optionNames = optionIds.map(optionId => {
              const option = optionGroup.options.find(o => o.id === optionId);
              return option ? option.name : optionId;
            });
            return `${optionGroup.name}: ${optionNames.join(', ')}`;
          }).join(', ')})`
        : '';
      
      return `${cartItem.quantity}x ${cartItem.item.name}${optionsText} - $${(cartItem.totalPrice * cartItem.quantity).toFixed(2)}`;
    }).join('\n');
    
    const confirmMessage = `Order Summary:\n\n${orderSummary}\n\nSubtotal: $${subtotal.toFixed(2)}\nTax (8%): $${tax.toFixed(2)}\nService Fee (3%): $${serviceFee.toFixed(2)}\nTotal: $${finalTotal.toFixed(2)}\n\nProceed with checkout?`;
    
    if (confirm(confirmMessage)) {
      try {
        // Create order in Firestore
        const orderData = {
          restaurantId: restaurantId,
          userId: 'public-customer', // Public orders don't have a specific user
          tableId: 'public-order', // Public orders don't have a table
          customerName: 'Public Customer',
          items: cart.map(cartItem => ({
            id: cartItem.item.id,
            name: cartItem.item.name,
            price: cartItem.totalPrice, // Use total price including options
            quantity: cartItem.quantity,
            specialInstructions: cartItem.selectedOptions ? 
              Object.entries(cartItem.selectedOptions).map(([groupId, optionIds]) => {
                const optionGroup = optionGroups.find(g => g.id === groupId);
                if (!optionGroup || !Array.isArray(optionIds)) return '';
                const optionNames = optionIds.map(optionId => {
                  const option = optionGroup.options.find(o => o.id === optionId);
                  return option ? option.name : optionId;
                });
                return `${optionGroup.name}: ${optionNames.join(', ')}`;
              }).join(', ') : null,
            category: cartItem.item.categoryId || 'Unknown'
          })),
          status: 'pending' as const,
          total: finalTotal,
          tip: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          notes: null,
          paymentMethod: 'card' as const,
          isPaid: false
        };
        
        await addDoc(collection(db, 'orders'), orderData);
        
        alert('Order placed successfully! Thank you for your order. 🎉');
        
        // Clear the cart after successful checkout
        setCart([]);
        setIsCartOpen(false);
        
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to place order. Please try again.');
      }
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // No menu data
  if (!menuData) {
    return <NoMenuState />;
  }

  const themeColor = isClient 
    ? (() => {
        // Use menuData.theme if available, otherwise use selectedTheme
        const themeKey = menuData?.theme || selectedTheme;
        const theme = themes[themeKey as keyof typeof themes];
        return theme ? theme.primary : themes.blue.primary;
      })()
    : themes.blue.primary;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      {/* Header */}
      {menuData.restaurant && (
        <MenuHeader
          restaurant={menuData.restaurant}
          themeColor={themeColor}
        />
      )}

      {/* Restaurant Info */}
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {menuData.restaurant && (
          <RestaurantInfo restaurant={menuData.restaurant} />
        )}

        {/* Menu Categories */}
        <div className="space-y-8">
          {(menuData.categories || []).map((category) => (
            <MenuCategoryComponent
              key={category.id}
              category={category}
              onAddToCart={addToCart}
              themeColor={themeColor}
              optionGroups={optionGroups}
              allMenuItems={menuData.categories?.flatMap(cat => cat.items) || []}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center py-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-3">
            We hope you enjoy your meal. 🍽️
          </p>
          {/* Show powered by footer if not disabled */}
          {menuData.showPoweredBy !== false && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4">
              <span className="font-medium">Powered by</span>
              <a
                href="https://oishimenu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-bold text-base transition-colors duration-200 hover:scale-105 transform"
              >
                OishiMenu
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Bar */}
      <FloatingCartBar
        cart={cart}
        totalPrice={getTotalPrice()}
        totalItems={getTotalItems()}
        onOpenCart={() => setIsCartOpen(true)}
        themeColor={themeColor}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        totalPrice={getTotalPrice()}
        totalItems={getTotalItems()}
        optionGroups={optionGroups}
      />

    </div>
  );
}