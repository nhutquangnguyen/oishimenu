'use client';

import { useState, useEffect } from 'react';
import { POSHeader } from './POSHeader';
import { POSMenuItems } from './POSMenuItems';
import { POSOrderCart } from './POSOrderCart';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getMenuItems, getTables } from '@/lib/firestore';

interface POSItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  emoji: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  emoji: string;
}

export function POSInterfaceRefactored() {
  const { user, isDisabled } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [isPaid, setIsPaid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [menuItems, setMenuItems] = useState<POSItem[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load menu items and tables from real data sources
  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;
      
      try {
        setLoading(true);
        
        // Load menu items from Menu Builder for current restaurant
        const menuCategories = await getMenuItems(currentRestaurant.id, user.uid);
        console.log('Loaded menu categories:', menuCategories);
        
        if (menuCategories.length > 0) {
          const allMenuItems: POSItem[] = [];
          menuCategories.forEach((category: any) => {
            console.log('Processing category:', category);
            if (category.items) {
              category.items.forEach((item: any) => {
                allMenuItems.push({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                  category: category.name,
                  emoji: item.emoji || '🍽️'
                });
              });
            }
          });
          console.log('Converted menu items:', allMenuItems);
          setMenuItems(allMenuItems);
        } else {
          console.log('No menu categories found - no menu items available');
          setMenuItems([]);
        }
        
        // Load tables from current restaurant
        if (currentRestaurant?.id) {
          const tablesData = await getTables(currentRestaurant.id);
          console.log('Tables data found for restaurant:', currentRestaurant.id, tablesData);
          setTables(tablesData);
        } else {
          console.log('No current restaurant selected');
          setTables([]);
        }
      } catch (error) {
        console.error('Error loading POS data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user?.uid, currentRestaurant?.id]);

  const addToCart = (item: POSItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const createOrder = async () => {
    if (!user?.uid || !currentRestaurant?.id || cart.length === 0) return;
    
    try {
      setIsCreating(true);
      
      const orderData = {
        restaurantId: currentRestaurant.id,
        userId: user.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          emoji: item.emoji
        })),
        tableId: (() => {
          if (!tableNumber || tableNumber === 'walk-in') return null;
          // Find the table by number to get its ID
          const selectedTableObj = tables.find(table => table.number === tableNumber);
          return selectedTableObj?.id || null;
        })(),
        tableNumber: tableNumber || null, // Keep for backward compatibility
        customerName: customerName || 'Walk-in Customer',
        paymentMethod,
        status: 'completed',
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        tax: cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.08,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'orders'), orderData);
      
      setIsPaid(true);
      setShowSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetOrder = () => {
    setCart([]);
    setTableNumber('');
    setCustomerName('');
    setPaymentMethod('cash');
    setIsPaid(false);
    setShowSuccess(false);
  };

  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      const receiptContent = `
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { border-top: 1px solid #000; padding-top: 10px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${currentRestaurant?.name || 'Restaurant'}</h2>
              <p>Receipt</p>
            </div>
            ${cart.map(item => `
              <div class="item">
                <span>${item.emoji} ${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="total">
              <div class="item">
                <span>Subtotal:</span>
                <span>$${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              <div class="item">
                <span>Tax (8%):</span>
                <span>$${(cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.08).toFixed(2)}</span>
              </div>
              <div class="item">
                <span><strong>Total:</strong></span>
                <span><strong>$${(cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 1.08).toFixed(2)}</strong></span>
              </div>
            </div>
          </body>
        </html>
      `;
      receiptWindow.document.write(receiptContent);
      receiptWindow.document.close();
      receiptWindow.print();
    }
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, POSItem[]>);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading POS system...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <POSHeader isDisabled={isDisabled} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items */}
        <div className="lg:col-span-2">
          <POSMenuItems
            groupedItems={groupedItems}
            onAddToCart={addToCart}
          />
        </div>

        {/* Order Cart */}
        <div>
          <POSOrderCart
            cart={cart}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            customerName={customerName}
            setCustomerName={setCustomerName}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            isPaid={isPaid}
            setIsPaid={setIsPaid}
            isCreating={isCreating}
            showSuccess={showSuccess}
            tables={tables}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onCreateOrder={createOrder}
            onResetOrder={resetOrder}
            onPrintReceipt={printReceipt}
          />
        </div>
      </div>
    </div>
  );
}
