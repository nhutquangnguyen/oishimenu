'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Search } from 'lucide-react';

export function TransactionHistory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-gray-600">View all financial transactions and movements</p>
        </div>
        <Button variant="outline">
          <Search className="w-4 h-4 mr-2" />
          Search Transactions
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction History Coming Soon</h3>
          <p className="text-gray-500 mb-4">
            View detailed transaction history with filtering, search, and export capabilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}