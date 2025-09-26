export interface AnalyticsData {
  userId: string;
  revenue: { current: number; change: number };
  orders: { current: number; change: number };
  averageOrder: { current: number; change: number };
  completionRate: { current: number; change: number };
  topItems: Array<{ name: string; count: number; revenue: number }>;
  recentOrders: Array<{ 
    id: string; 
    tableId: string; 
    customerName?: string; 
    total: number; 
    status: string; 
    createdAt: Date 
  }>;
  insights: Array<{
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
  }>;
  lastUpdated: Date;
}
