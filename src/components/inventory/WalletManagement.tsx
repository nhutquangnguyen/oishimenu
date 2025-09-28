'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, Minus, CreditCard, Banknote, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getWallet, updateWalletBalance, getInventoryTransactions } from '@/lib/firestore';
import { Wallet, InventoryTransaction } from './types';

export function WalletManagement() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();

  const [cashWallet, setCashWallet] = useState<Wallet | null>(null);
  const [bankWallet, setBankWallet] = useState<Wallet | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateType, setUpdateType] = useState<'add' | 'subtract'>('add');
  const [walletType, setWalletType] = useState<'cash' | 'bank'>('cash');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadWalletData();
  }, [user?.uid, currentRestaurant?.id]);

  const loadWalletData = async () => {
    if (!user?.uid || !currentRestaurant?.id) return;

    try {
      setLoading(true);
      const [cashData, bankData, transactionsData] = await Promise.all([
        getWallet(currentRestaurant.id, 'cash'),
        getWallet(currentRestaurant.id, 'bank'),
        getInventoryTransactions(currentRestaurant.id, 20)
      ]);

      setCashWallet(cashData);
      setBankWallet(bankData);

      // Filter transactions that have cost information
      const walletTransactions = transactionsData.filter(t => t.totalCost !== undefined);
      setRecentTransactions(walletTransactions);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !currentRestaurant?.id || !amount) return;

    try {
      const updateAmount = updateType === 'subtract' ? -parseFloat(amount) : parseFloat(amount);
      await updateWalletBalance(currentRestaurant.id, walletType, updateAmount);

      await loadWalletData();
      setIsUpdateDialogOpen(false);
      setAmount('');
      setReason('');
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const openUpdateDialog = (type: 'add' | 'subtract', wallet: 'cash' | 'bank') => {
    setUpdateType(type);
    setWalletType(wallet);
    setIsUpdateDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading wallet data...</div>
          <div className="text-sm text-gray-500">Please wait</div>
        </div>
      </div>
    );
  }

  const totalBalance = (cashWallet?.balance || 0) + (bankWallet?.balance || 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Wallet Management</h2>
        <p className="text-gray-600">Manage your restaurant's cash and bank account balances</p>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Combined cash and bank balance
            </p>
          </CardContent>
        </Card>

        {/* Cash Wallet */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(cashWallet?.balance || 0).toFixed(2)}</div>
            <div className="flex space-x-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUpdateDialog('add', 'cash')}
                className="text-green-600 hover:text-green-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUpdateDialog('subtract', 'cash')}
                className="text-red-600 hover:text-red-700"
              >
                <Minus className="w-3 h-3 mr-1" />
                Deduct
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bank Wallet */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(bankWallet?.balance || 0).toFixed(2)}</div>
            <div className="flex space-x-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUpdateDialog('add', 'bank')}
                className="text-green-600 hover:text-green-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUpdateDialog('subtract', 'bank')}
                className="text-red-600 hover:text-red-700"
              >
                <Minus className="w-3 h-3 mr-1" />
                Deduct
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Transactions</span>
          </CardTitle>
          <CardDescription>Recent inventory-related financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No financial transactions yet
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{transaction.ingredientName}</div>
                    <div className="text-sm text-gray-600">
                      {transaction.type} • {transaction.quantity} {transaction.unit}
                      {transaction.reason && ` • ${transaction.reason}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.createdAt.toLocaleDateString()} • {transaction.createdAt.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge variant={transaction.walletType === 'cash' ? 'default' : 'secondary'}>
                        {transaction.walletType}
                      </Badge>
                      <div className={`font-medium ${
                        transaction.type === 'purchase' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {transaction.type === 'purchase' ? '-' : ''}${transaction.totalCost?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Balance Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {updateType === 'add' ? 'Add Money to' : 'Deduct Money from'} {walletType === 'cash' ? 'Cash' : 'Bank'} Wallet
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBalance} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                placeholder="e.g., Initial deposit, Manual adjustment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                {updateType === 'add' ? 'Add' : 'Deduct'} ${amount || '0.00'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}