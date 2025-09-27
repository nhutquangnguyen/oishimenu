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
      <CardContent className="space-y-3">
        <Button className="w-full justify-start text-sm sm:text-base" onClick={onAddMenuItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
        <Button variant="outline" className="w-full justify-start text-sm sm:text-base" onClick={() => router.push('/dashboard/pos')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Open POS System</span>
          <span className="sm:hidden">POS System</span>
        </Button>
        <Button variant="outline" className="w-full justify-start text-sm sm:text-base" onClick={onPreviewMenu}>
          <Eye className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Preview Public Menu</span>
          <span className="sm:hidden">Preview Menu</span>
        </Button>
        <Button variant="outline" className="w-full justify-start text-sm sm:text-base" onClick={onViewAnalytics}>
          <BarChart3 className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </CardContent>
    </Card>
  );
}
