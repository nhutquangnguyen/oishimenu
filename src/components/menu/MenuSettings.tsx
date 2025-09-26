'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Download,
  Share2,
  Globe
} from 'lucide-react';
import { getMenuUrl, getQRCodeUrl } from '@/lib/env';

interface MenuSettingsProps {
  restaurantId?: string;
  onDownloadQR: () => void;
  onCopyURL: () => void;
  onShareSocial: () => void;
  onEmbedWebsite: () => void;
}

export function MenuSettings({ 
  restaurantId,
  onDownloadQR, 
  onCopyURL, 
  onShareSocial, 
  onEmbedWebsite 
}: MenuSettingsProps) {
  return (
    <>
      {/* Menu Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Settings</CardTitle>
          <CardDescription>Configure your public menu appearance and behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Appearance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show prices</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show allergens</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show descriptions</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Online ordering</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Table service</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Takeout orders</span>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Access</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Public access</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password protected</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require login</span>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code and Sharing */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Menu</CardTitle>
          <CardDescription>Generate QR codes and share links for your digital menu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-200 inline-block">
                <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                  <img 
                    src={getQRCodeUrl(getMenuUrl(restaurantId), 128)}
                    alt="Menu QR Code"
                    className="w-32 h-32 rounded"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">QR Code for Menu</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={onDownloadQR}>
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Menu URL</label>
                <div className="flex">
                  <input
                    type="text"
                    value={getMenuUrl(restaurantId)}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                  />
                  <Button size="sm" className="rounded-l-none" onClick={onCopyURL}>
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={onShareSocial}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on Social Media
                </Button>
                <Button variant="outline" className="w-full" onClick={onEmbedWebsite}>
                  <Globe className="w-4 h-4 mr-2" />
                  Embed on Website
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
