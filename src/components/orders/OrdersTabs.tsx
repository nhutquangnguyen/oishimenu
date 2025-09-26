'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActiveOrdersList } from './ActiveOrdersList';
import { AllOrdersList } from './AllOrdersList';
import { Clock, BarChart3 } from 'lucide-react';

export function OrdersTabs() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active" className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Active Orders</span>
        </TabsTrigger>
        <TabsTrigger value="all" className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" />
          <span>All Orders</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-6">
        <ActiveOrdersList />
      </TabsContent>

      <TabsContent value="all" className="mt-6">
        <AllOrdersList />
      </TabsContent>
    </Tabs>
  );
}
