'use client';

import { Building2, ExternalLink, Trash2, Zap, QrCode, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { QRCodeComponent } from '@/components/ui/qr-code';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface MenuBuilderHeaderProps {
  selectedRestaurantId: string;
  onPreviewMenu: () => void;
  onClearMenu?: () => void;
  onLoadTemplate?: (templateKey: string) => void;
  onDownloadQR?: () => void;
}

export function MenuBuilderHeader({
  selectedRestaurantId,
  onPreviewMenu,
  onClearMenu,
  onLoadTemplate,
  onDownloadQR
}: MenuBuilderHeaderProps) {
  const { user } = useAuth();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const handleCopyURL = () => {
    if (selectedRestaurantId) {
      const menuUrl = `${window.location.origin}/menu/${selectedRestaurantId}`;
      navigator.clipboard.writeText(menuUrl).then(() => {
        alert('Menu URL copied to clipboard!');
      }).catch(() => {
        alert(`Menu URL: ${menuUrl}`);
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Menu Builder</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Create and manage your restaurant menu with drag-and-drop ease.</p>
      </div>

      {/* Preview Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            size="default"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
            onClick={onPreviewMenu}
            disabled={!selectedRestaurantId}
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden sm:inline">🚀 Preview Public Menu</span>
            <span className="sm:hidden">🚀 Preview Menu</span>
          </Button>
          {selectedRestaurantId && (
            <div className="text-xs sm:text-sm text-green-600 font-medium flex items-center justify-center sm:justify-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Preview Ready
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">

          {onLoadTemplate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Zap className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Quick Templates</span>
                  <span className="sm:hidden">Templates</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onLoadTemplate('default')}>
                  🍽️ Restaurant Menu
                  <span className="ml-auto text-xs text-gray-500">General</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLoadTemplate('cafe')}>
                  ☕ Cafe Menu
                  <span className="ml-auto text-xs text-gray-500">Coffee & Pastries</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLoadTemplate('pizza')}>
                  🍕 Pizza Shop
                  <span className="ml-auto text-xs text-gray-500">Pizza & Sides</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {onClearMenu && (
            <Button
              variant="outline"
              className="w-full sm:w-auto text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              onClick={onClearMenu}
            >
              <Trash2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Clear Menu</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* QR Code Section */}
      {selectedRestaurantId && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0">
              <div className="bg-white p-3 rounded-lg border shadow-sm">
                <QRCodeComponent
                  value={`${window.location.origin}/menu/${selectedRestaurantId}`}
                  size={120}
                  onGenerated={setQrCodeDataUrl}
                />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 mb-2">📱 Scan to View Menu</h3>
              <p className="text-sm text-gray-600 mb-3">
                Customers can scan this QR code to instantly access your menu
              </p>
              <div className="bg-white p-2 rounded border text-xs font-mono text-gray-700 break-all mb-3">
                {window.location.origin}/menu/{selectedRestaurantId}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
                <Button variant="outline" size="sm" onClick={handleCopyURL}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
                {onDownloadQR && (
                  <Button variant="outline" size="sm" onClick={onDownloadQR}>
                    <Download className="w-4 h-4 mr-2" />
                    Download QR
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
