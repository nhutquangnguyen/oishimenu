'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { themes } from '../menu/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { QRCodeComponent } from '@/components/ui/qr-code';
import QRCode from 'qrcode';
import { 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Share2, 
  QrCode,
  Settings,
  Palette,
  Globe,
  Lock,
  Download
} from 'lucide-react';

export function PublicMenuPreview() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isMenuPublic, setIsMenuPublic] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('blue');
  const [menuData, setMenuData] = useState<{
    categories: any[];
    restaurant: any;
    theme: string;
    isPublic: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    const loadMenuData = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;

      try {
        setLoading(true);
        const menuDoc = await getDoc(doc(db, 'menus', currentRestaurant.id));
        
        if (menuDoc.exists()) {
          const data = menuDoc.data();
          setMenuData({
            categories: data.categories || [],
            restaurant: data.restaurant,
            theme: data.theme || 'blue',
            isPublic: data.isPublic || false
          });
          setSelectedTheme(data.theme || 'blue');
          setIsMenuPublic(data.isPublic || false);
        } else {
          setError('No menu data found for this restaurant');
        }
      } catch (error) {
        console.error('Error loading menu data:', error);
        setError('Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [user?.uid, currentRestaurant?.id]);

  const getDeviceSize = () => {
    switch (previewDevice) {
      case 'mobile': return 'w-80';
      case 'tablet': return 'w-96';
      case 'desktop': return 'w-full max-w-4xl';
      default: return 'w-80';
    }
  };

  const handleDownloadQR = async () => {
    if (!currentRestaurant?.id) return;

    try {
      const menuUrl = `${window.location.origin}/menu/${currentRestaurant.id}`;

      const qrDataUrl = await QRCode.toDataURL(menuUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      const link = document.createElement('a');
      link.download = `${currentRestaurant.name || 'menu'}-qr-code.png`;
      link.href = qrDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    }
  };

  const handleShareMenu = () => {
    if (!currentRestaurant?.id) return;

    const menuUrl = `${window.location.origin}/menu/${currentRestaurant.id}`;
    navigator.clipboard.writeText(menuUrl).then(() => {
      alert('Menu URL copied to clipboard!');
    }).catch(() => {
      alert(`Menu URL: ${menuUrl}`);
    });
  };

  const handlePreviewMenu = () => {
    if (!currentRestaurant?.id) return;
    window.open(`/menu/${currentRestaurant.id}`, '_blank');
  };

  const currentTheme = themes[selectedTheme as keyof typeof themes] || themes.blue;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu preview...</p>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Menu Data</h3>
        <p className="text-gray-600">Please create a menu in the Menu Builder first.</p>
      </div>
    );
  }

  const { categories, restaurant } = menuData;

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Menu Preview
          </CardTitle>
          <CardDescription>
            Preview how your menu will look on different devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Device:</span>
            <div className="flex gap-1">
              <Button
                variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewDevice('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Theme:</span>
            <div className="flex gap-1">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`w-6 h-6 rounded border-2 ${
                    selectedTheme === key 
                      ? 'border-gray-900' 
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: theme.primary }}
                  title={key}
                />
              ))}
            </div>
          </div>

          {/* Public Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Public:</span>
            <Switch
              checked={isMenuPublic}
              onCheckedChange={setIsMenuPublic}
            />
            <span className="text-sm text-gray-600">
              {isMenuPublic ? 'Menu is public' : 'Menu is private'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Menu Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>
            This is how your menu will appear to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className={`${getDeviceSize()} border rounded-lg overflow-hidden shadow-lg`}>
              {/* Menu Header */}
              <div 
                className="p-6 text-white relative overflow-hidden"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <div className="relative z-10">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{restaurant?.logo || '🍽️'}</div>
                    <h1 className="text-2xl font-bold">{restaurant?.name || 'Restaurant Name'}</h1>
                    <p className="text-sm opacity-90">{restaurant?.description || 'Restaurant description'}</p>
                  </div>
                </div>
              </div>

              {/* Menu Content */}
              <div className="p-4 bg-white">
                {categories && categories.length > 0 ? (
                  <div className="space-y-6">
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                          {category.name}
                        </h3>
                        <div className="space-y-2">
                          {category.items?.slice(0, 2).map((item: any) => (
                            <div key={item.id} className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  {item.isFeatured && (
                                    <Badge variant="secondary" className="text-xs">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                {item.allergens && item.allergens.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {item.allergens.slice(0, 2).map((allergen: string) => (
                                      <Badge key={allergen} variant="outline" className="text-xs">
                                        {allergen}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">
                                  ${item.price}
                                </span>
                              </div>
                            </div>
                          ))}
                          {category.items?.length > 2 && (
                            <p className="text-sm text-gray-500 italic">
                              +{category.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="text-gray-600">No menu items yet</p>
                  </div>
                )}

                {/* Preview Footer */}
                <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                  <p className="text-gray-500 text-sm mb-2">
                    We hope you enjoy your meal. 🍽️
                  </p>
                  {/* Show powered by footer based on setting */}
                  {menuData?.showPoweredBy !== false && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
                      <span className="font-medium">Powered by</span>
                      <span className="text-indigo-600 font-bold text-base">OishiMenu</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviewMenu}>
              <Eye className="h-4 w-4 mr-2" />
              Preview Public Menu
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareMenu}>
              <Share2 className="h-4 w-4 mr-2" />
              Copy Menu URL
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Menu QR Code</DialogTitle>
                  <DialogDescription>
                    Scan this QR code to access your public menu, or download it for printing.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    {currentRestaurant?.id && (
                      <QRCodeComponent
                        value={`${window.location.origin}/menu/${currentRestaurant.id}`}
                        size={200}
                        onGenerated={setQrCodeDataUrl}
                      />
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Menu URL: {window.location.origin}/menu/{currentRestaurant?.id}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleDownloadQR}>
                        <Download className="h-4 w-4 mr-2" />
                        Download QR Code
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleShareMenu}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Copy URL
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}