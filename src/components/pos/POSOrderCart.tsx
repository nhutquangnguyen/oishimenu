'use client';

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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  emoji: string;
}

interface POSOrderCartProps {
  cart: CartItem[];
  tableNumber: string;
  setTableNumber: (table: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  paymentMethod: 'cash' | 'card' | 'digital';
  setPaymentMethod: (method: 'cash' | 'card' | 'digital') => void;
  isPaid: boolean;
  setIsPaid: (paid: boolean) => void;
  isCreating: boolean;
  showSuccess: boolean;
  tables: any[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onCreateOrder: () => void;
  onResetOrder: () => void;
  onPrintReceipt: () => void;
}

export function POSOrderCart({
  cart,
  tableNumber,
  setTableNumber,
  customerName,
  setCustomerName,
  paymentMethod,
  setPaymentMethod,
  isPaid,
  setIsPaid,
  isCreating,
  showSuccess,
  tables,
  onUpdateQuantity,
  onRemoveFromCart,
  onCreateOrder,
  onResetOrder,
  onPrintReceipt
}: POSOrderCartProps) {
  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getTotal() * 0.08; // 8% tax
  };

  const getFinalTotal = () => {
    return getTotal() + getTax();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Order Cart
          {cart.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {cart.length} items
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Review and complete the order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Details */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="table">Table Selection</Label>
            <Select value={tableNumber} onValueChange={setTableNumber}>
              <SelectTrigger>
                <SelectValue placeholder="Select table">
                  {tableNumber && tableNumber !== 'walk-in' ? (() => {
                    const selectedTable = tables.find(table => table.number === tableNumber);
                    return selectedTable ? `${selectedTable.area} - Table ${selectedTable.number}` : `Table ${tableNumber}`;
                  })() : tableNumber === 'walk-in' ? 'Walk-in' : 'Select table'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk-in">Walk-in</SelectItem>
                {(() => {
                  // Group tables by area for better organization
                  const tablesByArea = tables.reduce((acc, table) => {
                    if (!acc[table.area]) {
                      acc[table.area] = [];
                    }
                    acc[table.area].push(table);
                    return acc;
                  }, {} as Record<string, typeof tables>);

                  return Object.entries(tablesByArea)
                    .sort(([a], [b]) => a.localeCompare(b)) // Sort areas alphabetically
                    .map(([areaName, areaTables]) => (
                    <div key={areaName}>
                      {areaTables
                        .sort((a, b) => parseInt(a.number) - parseInt(b.number)) // Sort tables numerically
                        .map((table, index) => {
                        console.log('Rendering table:', table, 'with key:', table.id || `${areaName}-table-${index}`);
                        return (
                          <SelectItem key={table.id || `${areaName}-table-${index}`} value={table.number}>
                            <div className="flex items-center">
                              <span className="text-gray-500 text-xs mr-2">{areaName}</span>
                              <span>Table {table.number}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </div>
                  ));
                })()}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="customer">Customer Name</Label>
            <Input
              id="customer"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No items in cart</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item, index) => {
              console.log('Rendering cart item:', item, 'with key:', item.id || `item-${index}`);
              return (
              <div key={item.id || `item-${index}`} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Payment Method */}
        {cart.length > 0 && (
          <div>
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'digital') => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Card
                  </div>
                </SelectItem>
                <SelectItem value="digital">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Digital Wallet
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Order Total */}
        {cart.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (8%):</span>
              <span>${getTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${getFinalTotal().toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {cart.length > 0 && (
          <div className="space-y-2">
            <Button
              onClick={onCreateOrder}
              disabled={isCreating || isPaid}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Order...
                </>
              ) : isPaid ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Order Completed
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4 mr-2" />
                  Create Order
                </>
              )}
            </Button>
            
            {isPaid && (
              <div className="flex space-x-2">
                <Button
                  onClick={onPrintReceipt}
                  variant="outline"
                  className="flex-1"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button
                  onClick={onResetOrder}
                  variant="outline"
                  className="flex-1"
                >
                  New Order
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">Order created successfully!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
