'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  CreditCard,
  User,
  MapPin,
  CheckCircle2,
  Search,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMenuItems, getTables, createOrder } from '@/lib/firestore';

// Extended table types
const TABLE_TYPES = [
  { value: 'dine-in', label: 'Dine In', icon: MapPin, description: 'Regular table service' },
  { value: 'takeaway', label: 'Takeaway', icon: ShoppingCart, description: 'Customer pickup' },
  { value: 'grab', label: 'Grab', icon: Smartphone, description: 'Grab delivery' },
  { value: 'shopee', label: 'Shopee Food', icon: Smartphone, description: 'Shopee Food delivery' },
  { value: 'foodpanda', label: 'FoodPanda', icon: Smartphone, description: 'FoodPanda delivery' },
  { value: 'gojek', label: 'GoJek', icon: Smartphone, description: 'GoJek delivery' },
  { value: 'custom', label: 'Other', icon: User, description: 'Custom delivery/pickup' }
];

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
  specialInstructions?: string;
}

interface CreateOrderPOSProps {
  onOrderCreated?: () => void;
}

export function CreateOrderPOS({ onOrderCreated }: CreateOrderPOSProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();

  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableType, setTableType] = useState<string>('dine-in');
  const [tableId, setTableId] = useState<string>('');
  const [customTableId, setCustomTableId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [isPaid, setIsPaid] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Data
  const [menuItems, setMenuItems] = useState<POSItem[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load menu items and tables
  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;

      try {
        setLoading(true);

        // Load menu items
        const menuCategories = await getMenuItems(currentRestaurant.id, user.uid);
        if (menuCategories && menuCategories.length > 0) {
          const allMenuItems: POSItem[] = [];
          menuCategories.forEach((category: any) => {
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
          setMenuItems(allMenuItems);
        }

        // Load tables for dine-in
        if (currentRestaurant?.id) {
          const tablesData = await getTables(currentRestaurant.id);
          setTables(tablesData || []);
        }
      } catch (error) {
        console.error('Error loading POS data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.uid, currentRestaurant?.id]);

  // Cart functions
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

  const updateSpecialInstructions = (itemId: string, instructions: string) => {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, specialInstructions: instructions } : item
    ));
  };

  // Order creation
  const handleCreateOrder = async () => {
    if (!user?.uid || !currentRestaurant?.id || cart.length === 0) return;

    const finalTableId = tableType === 'dine-in' ? tableId :
                        tableType === 'custom' ? customTableId :
                        tableType;

    if (!finalTableId) {
      alert('Please select or enter a table/order identifier');
      return;
    }

    try {
      setIsCreating(true);

      const orderData = {
        restaurantId: currentRestaurant.id,
        userId: user.uid,
        tableId: finalTableId,
        tableType: tableType,
        customerName: customerName || 'Walk-in Customer',
        customerPhone: customerPhone || null,
        items: cart.map(item => ({
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          specialInstructions: item.specialInstructions || null,
          isCompleted: false,
          completedQuantity: 0
        })),
        status: 'pending' as const,
        paymentMethod,
        isPaid,
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        tip: 0,
        notes: notes || null
      };

      await createOrder(orderData);

      setShowSuccess(true);

      // Reset form
      setTimeout(() => {
        resetOrder();
        setShowSuccess(false);
        onOrderCreated?.();
      }, 2000);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetOrder = () => {
    setCart([]);
    setTableId('');
    setCustomTableId('');
    setCustomerName('');
    setCustomerPhone('');
    setPaymentMethod('cash');
    setIsPaid(false);
    setNotes('');
  };

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Filter menu items
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group menu items by category
  const groupedMenuItems = filteredMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, POSItem[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading menu items...</div>
          <div className="text-sm text-gray-500">Please wait while we load your menu</div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Order Created Successfully!</h3>
            <p className="text-gray-600">Redirecting to active orders...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Menu Items Section */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Menu Items</span>
            </CardTitle>
            <CardDescription>Select items to add to the order</CardDescription>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-y-auto">
            {menuItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Menu Items</h3>
                <p className="text-gray-500">Create menu items in Menu Builder to start taking orders.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedMenuItems).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => addToCart(item)}
                          className="p-4 border rounded-lg text-left transition-colors min-h-[120px] flex flex-col justify-between hover:bg-gray-50 border-gray-200"
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex items-center justify-center mb-2">
                              <span className="text-3xl">{item.emoji}</span>
                            </div>
                            <div className="text-center flex-1">
                              <div className="font-medium text-sm mb-1 line-clamp-2">{item.name}</div>
                              <div className="text-xs text-gray-500 mb-2">{item.category}</div>
                              <div className="font-bold text-green-600 text-base">${item.price.toFixed(2)}</div>
                            </div>
                            <div className="flex justify-center mt-2">
                              <Plus className="w-4 h-4 text-gray-400" />
                            </div>
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

      {/* Order Summary & Details */}
      <div className="space-y-6">
        {/* Table & Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Table Type */}
            <div>
              <Label>Order Type</Label>
              <Select value={tableType} onValueChange={setTableType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TABLE_TYPES.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Table/Order ID */}
            <div>
              <Label>
                {tableType === 'dine-in' ? 'Table Number' :
                 tableType === 'custom' ? 'Order ID' :
                 `${TABLE_TYPES.find(t => t.value === tableType)?.label} Order`}
              </Label>
              {tableType === 'dine-in' ? (
                <Select value={tableId} onValueChange={setTableId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.id} value={table.number.toString()}>
                        Table {table.number} ({table.seats} seats)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : tableType === 'custom' ? (
                <Input
                  value={customTableId}
                  onChange={(e) => setCustomTableId(e.target.value)}
                  placeholder="Enter order ID"
                />
              ) : (
                <Input
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  placeholder={`Enter ${TABLE_TYPES.find(t => t.value === tableType)?.label} order number`}
                />
              )}
            </div>

            {/* Customer Info */}
            <div>
              <Label>Customer Name</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Optional"
              />
            </div>

            {tableType !== 'dine-in' && (
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="For delivery orders"
                />
              </div>
            )}

            {/* Payment Method */}
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'digital') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Cash</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="digital">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span>Digital Wallet</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPaid"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="isPaid">Payment Received</Label>
            </div>

            {/* Notes */}
            <div>
              <Label>Order Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions or notes"
              />
            </div>
          </CardContent>
        </Card>

        {/* Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No items in cart</p>
                <p className="text-sm">Select items from the menu to start</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Special instructions..."
                        value={item.specialInstructions || ''}
                        onChange={(e) => updateSpecialInstructions(item.id, e.target.value)}
                        className="mt-2 text-xs"
                        size="sm"
                      />
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 mt-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={resetOrder}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleCreateOrder}
                    disabled={isCreating || cart.length === 0}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isCreating ? 'Creating...' : 'Create Order'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}