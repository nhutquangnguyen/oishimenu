'use client';

import { Building2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface MenuBuilderHeaderProps {
  selectedRestaurantId: string;
  onPreviewMenu: () => void;
}

export function MenuBuilderHeader({
  selectedRestaurantId,
  onPreviewMenu
}: MenuBuilderHeaderProps) {
  const { user } = useAuth();

  return (
    <>

      {/* Global Actions */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={onPreviewMenu}
            disabled={!selectedRestaurantId}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            🚀 Preview Public Menu
          </Button>
          {selectedRestaurantId && (
            <div className="text-sm text-green-600 font-medium flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Preview Ready
            </div>
          )}
        </div>
      </div>
    </>
  );
}
