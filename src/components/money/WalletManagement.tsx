'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  DollarSign,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  TrendingUp,
  ArrowRightLeft,
  Eye,
  PiggyBank
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getWallet, updateWalletBalance } from '@/lib/firestore';
import { Wallet } from './types';

export function WalletManagement() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();

  const [cashWallet, setCashWallet] = useState<Wallet | null>(null);
  const [bankWallet, setBankWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [updateType, setUpdateType] = useState<'add' | 'subtract'>('add');
  const [walletType, setWalletType] = useState<'cash' | 'bank'>('cash');

  // Form states
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferFrom, setTransferFrom] = useState<'cash' | 'bank'>('cash');
  const [transferTo, setTransferTo] = useState<'cash' | 'bank'>('bank');
  const [transferReason, setTransferReason] = useState('');

  useEffect(() => {
    loadWalletData();
  }, [user?.uid, currentRestaurant?.id]);

  const loadWalletData = async () => {
    if (!user?.uid || !currentRestaurant?.id) return;

    try {
      setLoading(true);
      const [cashData, bankData] = await Promise.all([
        getWallet(currentRestaurant.id, 'cash'),
        getWallet(currentRestaurant.id, 'bank')
      ]);

      setCashWallet(cashData);
      setBankWallet(bankData);
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
      resetUpdateForm();
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !currentRestaurant?.id || !transferAmount) return;

    try {
      const amount = parseFloat(transferAmount);

      // Deduct from source wallet
      await updateWalletBalance(currentRestaurant.id, transferFrom, -amount);
      // Add to destination wallet
      await updateWalletBalance(currentRestaurant.id, transferTo, amount);

      await loadWalletData();
      setIsTransferDialogOpen(false);
      resetTransferForm();
    } catch (error) {
      console.error('Error transferring money:', error);
    }
  };

  const resetUpdateForm = () => {
    setAmount('');
    setReason('');
  };

  const resetTransferForm = () => {
    setTransferAmount('');
    setTransferReason('');
  };

  const openUpdateDialog = (type: 'add' | 'subtract', wallet: 'cash' | 'bank') => {
    setUpdateType(type);
    setWalletType(wallet);
    setIsUpdateDialogOpen(true);
  };

  const openTransferDialog = () => {
    setTransferFrom('cash');
    setTransferTo('bank');
    setIsTransferDialogOpen(true);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wallet Management</h2>
          <p className="text-gray-600">Manage your restaurant's cash and bank account balances</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={openTransferDialog} variant="outline">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Transfer Money
          </Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Balance</CardTitle>
            <PiggyBank className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-blue-700 mt-1">
              Combined cash and bank balance
            </p>
          </CardContent>
        </Card>

        {/* Cash Wallet */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(cashWallet?.balance || 0).toFixed(2)}</div>
            <div className="text-xs text-gray-500 mb-3">
              Last updated: {cashWallet?.lastUpdated ? new Date(cashWallet.lastUpdated).toLocaleString() : 'Never'}
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUpdateDialog('add', 'cash')}
                className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUpdateDialog('subtract', 'cash')}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Minus className="w-3 h-3 mr-1" />
                Deduct
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bank Wallet */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(bankWallet?.balance || 0).toFixed(2)}</div>
            <div className="text-xs text-gray-500 mb-3">
              Last updated: {bankWallet?.lastUpdated ? new Date(bankWallet.lastUpdated).toLocaleString() : 'Never'}
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUpdateDialog('add', 'bank')}
                className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUpdateDialog('subtract', 'bank')}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Minus className="w-3 h-3 mr-1" />
                Deduct
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common wallet management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => openUpdateDialog('add', 'cash')}
            >
              <Plus className="h-6 w-6 text-green-600" />
              <span className="text-sm">Add Cash</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => openUpdateDialog('add', 'bank')}
            >
              <Plus className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Add to Bank</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={openTransferDialog}
            >
              <ArrowRightLeft className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Transfer</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
            >
              <Eye className="h-6 w-6 text-gray-600" />
              <span className="text-sm">View History</span>
            </Button>
          </div>
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
              <Label htmlFor="amount">Amount ($)</Label>
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
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Initial deposit, Cash sale, Expense payment, Manual adjustment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                {updateType === 'add' ? 'Add' : 'Deduct'} ${amount || '0.00'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateDialogOpen(false);
                  resetUpdateForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transfer Money Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Money Between Wallets</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transferFrom">From</Label>
                <Select value={transferFrom} onValueChange={(value: 'cash' | 'bank') => setTransferFrom(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash (${(cashWallet?.balance || 0).toFixed(2)})</SelectItem>
                    <SelectItem value="bank">Bank (${(bankWallet?.balance || 0).toFixed(2)})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transferTo">To</Label>
                <Select value={transferTo} onValueChange={(value: 'cash' | 'bank') => setTransferTo(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash" disabled={transferFrom === 'cash'}>Cash</SelectItem>
                    <SelectItem value="bank" disabled={transferFrom === 'bank'}>Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="transferAmount">Amount ($)</Label>
              <Input
                id="transferAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="transferReason">Reason (optional)</Label>
              <Input
                id="transferReason"
                placeholder="e.g., Bank deposit, Cash withdrawal"
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1" disabled={transferFrom === transferTo}>
                Transfer ${transferAmount || '0.00'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsTransferDialogOpen(false);
                  resetTransferForm();
                }}
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