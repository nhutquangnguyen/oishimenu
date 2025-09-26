'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Eye,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {
  onAddMenuItem: () => void;
  onPreviewMenu: () => void;
  onViewAnalytics: () => void;
}

export function QuickActions({ 
  onAddMenuItem, 
  onPreviewMenu, 
  onViewAnalytics 
}: QuickActionsProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks to get you started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full justify-start" onClick={onAddMenuItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/pos')}>
          <CreditCard className="mr-2 h-4 w-4" />
          Open POS System
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onPreviewMenu}>
          <Eye className="mr-2 h-4 w-4" />
          Preview Public Menu
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onViewAnalytics}>
          <BarChart3 className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </CardContent>
    </Card>
  );
}
