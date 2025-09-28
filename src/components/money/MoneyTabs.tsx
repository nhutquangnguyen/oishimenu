'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Wallet, TrendingUp, TrendingDown, BarChart3, Receipt } from 'lucide-react';
import { MoneyDashboard } from './MoneyDashboard';
import { WalletManagement } from './WalletManagement';
import { IncomeManagement } from './IncomeManagement';
import { ExpenseManagement } from './ExpenseManagement';
import { FinancialReports } from './FinancialReports';
import { TransactionHistory } from './TransactionHistory';

export function MoneyTabs() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Money Management</h1>
        <p className="text-gray-600">Manage your restaurant's finances, track income and expenses</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center space-x-2">
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Wallets</span>
          </TabsTrigger>
          <TabsTrigger value="income" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Income</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4" />
            <span className="hidden sm:inline">Expenses</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center space-x-2">
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <MoneyDashboard />
        </TabsContent>

        <TabsContent value="wallet" className="mt-6">
          <WalletManagement />
        </TabsContent>

        <TabsContent value="income" className="mt-6">
          <IncomeManagement />
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <ExpenseManagement />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}