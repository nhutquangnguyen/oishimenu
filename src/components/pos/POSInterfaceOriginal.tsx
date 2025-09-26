'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign,
  User,
  Table,
  Receipt,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { addDoc, collection, Timestamp, getDoc, doc } from 'firebase/firestore';
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


export function POSInterface() {
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

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getTotal() * 0.08; // 8% tax
  };

  const getFinalTotal = () => {
    return getTotal() + getTax();
  };

  const createOrder = async () => {
    if (!user?.uid || cart.length === 0 || !tableNumber) return;

    // Check if user is disabled
    if (isDisabled) {
      alert('Your account has been disabled. Please contact support.');
      return;
    }

    setIsCreating(true);
    try {
      const orderData = {
        tableId: tableNumber,
        customerName: customerName || null,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          specialInstructions: null,
          category: item.category
        })),
        status: 'pending' as const,
        total: getTotal(),
        tip: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        notes: null,
        paymentMethod,
        isPaid,
        userId: user.uid,
        restaurantId: currentRestaurant?.id || ''
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      setShowSuccess(true);
      setCart([]);
      setTableNumber('');
      setCustomerName('');
      setIsPaid(false);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsCreating(false);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
        <p className="text-gray-600">Create orders manually for walk-in customers or phone orders</p>
        
        {isDisabled && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Account Disabled
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Your account has been disabled. You cannot create orders. Please contact support for assistance.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items */}
        <div className="lg:col-span-2">
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
                            onClick={() => addToCart(item)}
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
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="table">Table Number *</Label>
                <Select value={tableNumber} onValueChange={setTableNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="text-2xl mb-2">🪑</div>
                        <p className="text-sm">No tables configured</p>
                        <p className="text-xs text-gray-400 mt-1">Go to Tables tab to add tables</p>
                      </div>
                    ) : (
                      tables.map((area) => 
                        area.tables?.map((table: any) => (
                          <SelectItem key={table.id} value={table.id}>
                            {table.name} ({area.name})
                          </SelectItem>
                        ))
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                  id="customer"
                  placeholder="Walk-in Customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="payment">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'digital') => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="digital">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isPaid">Payment Completed</Label>
              </div>
            </CardContent>
          </Card>

          {/* Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No items in cart</p>
                  <p className="text-sm">Add items from the menu to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{item.emoji}</span>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Total */}
          {cart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  onClick={createOrder}
                  disabled={!tableNumber || isCreating || isDisabled}
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <Receipt className="w-4 h-4 mr-2" />
                      Create Order
                    </>
                  )}
                </Button>

                {showSuccess && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Order created successfully!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
