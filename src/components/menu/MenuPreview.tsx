'use client';

import React, { useRef } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Smartphone,
  Tablet,
  Monitor,
  Settings,
  Share2,
  Download,
  Globe,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { MenuCategory } from './types';
import { themes } from './constants';

interface MenuPreviewProps {
  categories: MenuCategory[];
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  setPreviewDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  isMenuPublic: boolean;
  setIsMenuPublic: (isPublic: boolean) => void;
  isAutoSaveEnabled: boolean;
  setIsAutoSaveEnabled: (enabled: boolean) => void;
  isClient: boolean;
  onCustomize: () => void;
  onShare: () => void;
  onDownloadQR: () => void;
  onCopyURL: () => void;
  onShareSocial: () => void;
  onEmbedWebsite: () => void;
  logo?: string;
  onLogoChange: (logo: string | undefined) => void;
}

export function MenuPreview({
  categories,
  previewDevice,
  setPreviewDevice,
  selectedTheme,
  setSelectedTheme,
  isMenuPublic,
  setIsMenuPublic,
  isAutoSaveEnabled,
  setIsAutoSaveEnabled,
  isClient,
  onCustomize,
  onShare,
  onDownloadQR,
  onCopyURL,
  onShareSocial,
  onEmbedWebsite,
  logo,
  onLogoChange
}: MenuPreviewProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        onLogoChange(logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDeviceSize = () => {
    switch (previewDevice) {
      case 'mobile': return 'w-80';
      case 'tablet': return 'w-96';
      case 'desktop': return 'w-full max-w-4xl';
      default: return 'w-80';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Menu Preview</CardTitle>
            <CardDescription>See how your menu looks to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Device Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Preview Device</label>
              <div className="flex space-x-2">
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="w-4 h-4 mr-2" />
                  Tablet
                </Button>
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </Button>
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Theme Color</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key)}
                    className={`relative h-10 rounded-lg border-2 transition-all ${
                      selectedTheme === key 
                        ? 'border-gray-900 ring-2 ring-gray-300' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: theme.primary }}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                  >
                    {selectedTheme === key && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Restaurant Logo</Label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {logo ? (
                    <div className="relative">
                      <img
                        src={logo}
                        alt="Restaurant Logo"
                        className="w-16 h-16 object-contain border border-gray-200 rounded-lg bg-white p-2"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-1 -right-1 w-5 h-5 p-0"
                        onClick={() => onLogoChange(undefined)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Button
                    onClick={() => logoInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {logo ? 'Replace Logo' : 'Upload Logo'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG or JPG, max 2MB
                  </p>
                </div>
              </div>
              <Input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            {/* Auto-save Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto-save</label>
                <p className="text-xs text-gray-500">Automatically save changes every 2 seconds</p>
              </div>
              <Switch
                checked={isAutoSaveEnabled}
                onCheckedChange={setIsAutoSaveEnabled}
              />
            </div>

            {/* Public Status */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Make Menu Public</label>
                <p className="text-xs text-gray-500">Allow customers to view your menu</p>
              </div>
              <Switch
                checked={isMenuPublic}
                onCheckedChange={setIsMenuPublic}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={onCustomize}>
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button variant="outline" className="flex-1" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Preview */}
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              {isMenuPublic ? 'Your menu is live and accessible to customers' : 'Your menu is private'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className={`${getDeviceSize()} border rounded-lg overflow-hidden bg-white shadow-lg max-h-96 overflow-y-auto`}>
                {/* Menu Header */}
                <div 
                  className="p-4 text-white relative overflow-hidden"
                  style={{ 
                    backgroundColor: isClient 
                      ? (() => {
                          const theme = themes[selectedTheme as keyof typeof themes];
                          if (!theme) return themes.blue.primary;
                          return theme.primary;
                        })()
                      : themes.blue.primary // Always use blue for SSR
                  }}
                >
                  <div className="relative z-10">
                    <div className="text-center">
                      {logo ? (
                        <div className="mb-3">
                          <img
                            src={logo}
                            alt="Restaurant Logo"
                            className="w-16 h-16 mx-auto object-contain bg-white/10 backdrop-blur-sm rounded-lg p-2"
                          />
                        </div>
                      ) : (
                        <div className="text-4xl mb-2">🍝</div>
                      )}
                      <h1 className="text-2xl font-bold">Bella Vista Restaurant</h1>
                      <p className="text-sm opacity-90">Authentic Italian cuisine in the heart of the city</p>
                    </div>
                  </div>
                </div>

                {/* Menu Categories */}
                <div className="p-3 space-y-4">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <h2 className="text-lg font-semibold mb-2 text-gray-900">
                        {category.name}
                      </h2>
                      <div className="space-y-3">
                        {category.items.map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                  {item.isFeatured && (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                      Featured
                                    </Badge>
                                  )}
                                  {!item.isAvailable && (
                                    <Badge variant="destructive" className="text-xs">
                                      Unavailable
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                {item.allergens && item.allergens.length > 0 && (
                                  <p className="text-xs text-red-600">
                                    Contains: {item.allergens.join(', ')}
                                  </p>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <span className="font-bold text-gray-900">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Menu Footer */}
                <div className="p-4 bg-gray-50 text-center">
                  <p className="text-sm text-gray-500">
                    Scan QR code to order • Table service available
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
