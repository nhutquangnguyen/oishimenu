'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedOrdersList } from './UnifiedOrdersList';
import { CreateOrderPOS } from './CreateOrderPOS';
import { ShoppingCart, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function OrdersTabs() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Order</span>
          <span className="sm:hidden">Create</span>
        </TabsTrigger>
        <TabsTrigger value="orders" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Orders</span>
          <span className="sm:hidden">Orders</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="mt-6">
        <CreateOrderPOS onOrderCreated={() => setActiveTab('orders')} />
      </TabsContent>

      <TabsContent value="orders" className="mt-6">
        <UnifiedOrdersList />
      </TabsContent>
    </Tabs>
  );
}
