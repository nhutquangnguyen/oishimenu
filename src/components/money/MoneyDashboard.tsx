'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  Banknote,
  Calculator,
  Target,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getWallet } from '@/lib/firestore';
import { Wallet } from './types';

export function MoneyDashboard() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();

  const [cashWallet, setCashWallet] = useState<Wallet | null>(null);
  const [bankWallet, setBankWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - in real app, this would come from transactions
  const mockFinancialData = {
    todayIncome: 1250.75,
    todayExpenses: 430.25,
    weeklyIncome: 8675.50,
    weeklyExpenses: 3210.80,
    monthlyIncome: 32450.25,
    monthlyExpenses: 18950.60,
    todayOrders: 45,
    weeklyOrders: 312,
    averageOrderValue: 27.85
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.uid, currentRestaurant?.id]);

  const loadDashboardData = async () => {
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
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading financial data...</div>
          <div className="text-sm text-gray-500">Please wait</div>
        </div>
      </div>
    );
  }

  const totalBalance = (cashWallet?.balance || 0) + (bankWallet?.balance || 0);
  const todayProfit = mockFinancialData.todayIncome - mockFinancialData.todayExpenses;
  const weeklyProfit = mockFinancialData.weeklyIncome - mockFinancialData.weeklyExpenses;
  const monthlyProfit = mockFinancialData.monthlyIncome - mockFinancialData.monthlyExpenses;

  return (
    <div className="space-y-6">
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Balance</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-blue-700">
              Cash: ${(cashWallet?.balance || 0).toFixed(2)} | Bank: ${(bankWallet?.balance || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${todayProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Income: ${mockFinancialData.todayIncome.toFixed(2)} | Expenses: ${mockFinancialData.todayExpenses.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Profit</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${weeklyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${weeklyProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockFinancialData.weeklyOrders} orders this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${monthlyProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg order: ${mockFinancialData.averageOrderValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Banknote className="h-5 w-5" />
              <span>Cash Wallet</span>
            </CardTitle>
            <CardDescription>Physical cash on hand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">${(cashWallet?.balance || 0).toFixed(2)}</div>
            <div className="text-sm text-gray-600 mb-4">
              Last updated: {cashWallet?.lastUpdated ? new Date(cashWallet.lastUpdated).toLocaleString() : 'Never'}
            </div>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Add Cash
              </Button>
              <Button size="sm" variant="outline">
                Record Expense
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Bank Account</span>
            </CardTitle>
            <CardDescription>Business bank account balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">${(bankWallet?.balance || 0).toFixed(2)}</div>
            <div className="text-sm text-gray-600 mb-4">
              Last updated: {bankWallet?.lastUpdated ? new Date(bankWallet.lastUpdated).toLocaleString() : 'Never'}
            </div>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Add Deposit
              </Button>
              <Button size="sm" variant="outline">
                Record Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Income Overview</span>
            </CardTitle>
            <CardDescription>Revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Today</span>
                <span className="font-semibold text-green-600">${mockFinancialData.todayIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold text-green-600">${mockFinancialData.weeklyIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold text-green-600">${mockFinancialData.monthlyIncome.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span>Expense Overview</span>
            </CardTitle>
            <CardDescription>Cost breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Today</span>
                <span className="font-semibold text-red-600">${mockFinancialData.todayExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold text-red-600">${mockFinancialData.weeklyExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold text-red-600">${mockFinancialData.monthlyExpenses.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span>Alerts & Reminders</span>
            </CardTitle>
            <CardDescription>Important notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Info</Badge>
                <span className="text-sm">Low cash balance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Reminder</Badge>
                <span className="text-sm">Monthly expenses report due</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Success</Badge>
                <span className="text-sm">Profit target achieved</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common financial management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="text-sm">Record Income</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <TrendingDown className="h-6 w-6 text-red-600" />
              <span className="text-sm">Record Expense</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Calculator className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Target className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Set Budget</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}