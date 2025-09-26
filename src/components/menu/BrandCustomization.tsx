'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Palette,
  Type,
  Image as ImageIcon,
  X,
  Eye,
  Download
} from 'lucide-react';

interface BrandAssets {
  logo?: string;
  backgroundImage?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: 'small' | 'medium' | 'large';
  };
}

interface BrandCustomizationProps {
  brandAssets: BrandAssets;
  onUpdateBrandAssets: (assets: BrandAssets) => void;
  onPreview: () => void;
}

// Popular Google Fonts for restaurants
const GOOGLE_FONTS = [
  { name: 'Inter', category: 'Modern & Clean' },
  { name: 'Playfair Display', category: 'Elegant' },
  { name: 'Poppins', category: 'Friendly' },
  { name: 'Lora', category: 'Classic' },
  { name: 'Montserrat', category: 'Modern' },
  { name: 'Open Sans', category: 'Universal' },
  { name: 'Roboto', category: 'Clean' },
  { name: 'Dancing Script', category: 'Handwritten' },
  { name: 'Crimson Text', category: 'Traditional' },
  { name: 'Nunito', category: 'Rounded' },
  { name: 'Source Sans Pro', category: 'Professional' },
  { name: 'Merriweather', category: 'Readable' }
];

// Preset color palettes for restaurants
const COLOR_PRESETS = [
  {
    name: 'Elegant Gold',
    colors: { primary: '#D4AF37', secondary: '#2C3E50', accent: '#E67E22', text: '#2C3E50', background: '#FDFCF8' }
  },
  {
    name: 'Modern Blue',
    colors: { primary: '#3498DB', secondary: '#2C3E50', accent: '#E74C3C', text: '#2C3E50', background: '#F8F9FA' }
  },
  {
    name: 'Rustic Brown',
    colors: { primary: '#8B4513', secondary: '#DEB887', accent: '#CD853F', text: '#4A4A4A', background: '#FFF8DC' }
  },
  {
    name: 'Fresh Green',
    colors: { primary: '#27AE60', secondary: '#2C3E50', accent: '#F39C12', text: '#2C3E50', background: '#F0FFF0' }
  },
  {
    name: 'Classic Red',
    colors: { primary: '#E74C3C', secondary: '#2C3E50', accent: '#F39C12', text: '#2C3E50', background: '#FFFAFA' }
  }
];

export function BrandCustomization({ brandAssets, onUpdateBrandAssets, onPreview }: BrandCustomizationProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        onUpdateBrandAssets({
          ...brandAssets,
          logo: logoUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const backgroundUrl = e.target?.result as string;
        onUpdateBrandAssets({
          ...brandAssets,
          backgroundImage: backgroundUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (colorType: keyof BrandAssets['colors'], color: string) => {
    onUpdateBrandAssets({
      ...brandAssets,
      colors: {
        ...brandAssets.colors,
        [colorType]: color
      }
    });
  };

  const handleTypographyChange = (key: keyof BrandAssets['typography'], value: string) => {
    onUpdateBrandAssets({
      ...brandAssets,
      typography: {
        ...brandAssets.typography,
        [key]: value
      }
    });
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    onUpdateBrandAssets({
      ...brandAssets,
      colors: preset.colors
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Brand Customization</h2>
          <p className="text-gray-600">Customize your menu's visual identity to match your restaurant's brand.</p>
        </div>
        <Button onClick={onPreview} variant="outline" className="flex items-center space-x-2">
          <Eye className="w-4 h-4" />
          <span>Preview Changes</span>
        </Button>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">📸 Assets</TabsTrigger>
          <TabsTrigger value="colors">🎨 Colors</TabsTrigger>
          <TabsTrigger value="typography">📝 Typography</TabsTrigger>
          <TabsTrigger value="presets">⚡ Presets</TabsTrigger>
        </TabsList>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Restaurant Logo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {brandAssets.logo ? (
                    <div className="relative">
                      <img
                        src={brandAssets.logo}
                        alt="Restaurant Logo"
                        className="w-24 h-24 object-contain border border-gray-200 rounded-lg bg-white p-2"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => onUpdateBrandAssets({ ...brandAssets, logo: undefined })}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Button
                    onClick={() => logoInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {brandAssets.logo ? 'Replace Logo' : 'Upload Logo'}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Recommended: PNG or JPG, max 2MB, square format works best
                  </p>
                </div>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Background Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Background Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {brandAssets.backgroundImage ? (
                    <div className="relative">
                      <img
                        src={brandAssets.backgroundImage}
                        alt="Background"
                        className="w-32 h-20 object-cover border border-gray-200 rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => onUpdateBrandAssets({ ...brandAssets, backgroundImage: undefined })}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Button
                    onClick={() => backgroundInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {brandAssets.backgroundImage ? 'Replace Background' : 'Upload Background'}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Hero section background. Recommended: High-resolution image, landscape format
                  </p>
                </div>
              </div>
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="hidden"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Color Palette</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(brandAssets.colors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium capitalize">
                      {key} Color
                    </Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof BrandAssets['colors'], e.target.value)}
                        className="w-16 h-10 p-1 border rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof BrandAssets['colors'], e.target.value)}
                        className="flex-1 font-mono text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Type className="w-5 h-5" />
                <span>Typography</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <Select
                    value={brandAssets.typography.headingFont}
                    onValueChange={(value) => handleTypographyChange('headingFont', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select heading font" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOOGLE_FONTS.map((font) => (
                        <SelectItem key={font.name} value={font.name}>
                          <div className="flex items-center justify-between w-full">
                            <span style={{ fontFamily: font.name }}>{font.name}</span>
                            <Badge variant="secondary" className="text-xs">{font.category}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Select
                    value={brandAssets.typography.bodyFont}
                    onValueChange={(value) => handleTypographyChange('bodyFont', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select body font" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOOGLE_FONTS.map((font) => (
                        <SelectItem key={font.name} value={font.name}>
                          <div className="flex items-center justify-between w-full">
                            <span style={{ fontFamily: font.name }}>{font.name}</span>
                            <Badge variant="secondary" className="text-xs">{font.category}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={brandAssets.typography.fontSize}
                  onValueChange={(value) => handleTypographyChange('fontSize', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small - Compact and efficient</SelectItem>
                    <SelectItem value="medium">Medium - Balanced readability</SelectItem>
                    <SelectItem value="large">Large - Easy to read</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Preview */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview</h3>
                <div className="space-y-2">
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: brandAssets.typography.headingFont,
                      color: brandAssets.colors.primary
                    }}
                  >
                    Restaurant Name
                  </h2>
                  <p
                    className={`${brandAssets.typography.fontSize === 'large' ? 'text-lg' : brandAssets.typography.fontSize === 'small' ? 'text-sm' : 'text-base'}`}
                    style={{
                      fontFamily: brandAssets.typography.bodyFont,
                      color: brandAssets.colors.text
                    }}
                  >
                    This is how your menu text will appear to customers. The combination of fonts should be easy to read and match your restaurant's personality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Presets Tab */}
        <TabsContent value="presets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Color Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COLOR_PRESETS.map((preset) => (
                  <div
                    key={preset.name}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => applyColorPreset(preset)}
                  >
                    <div className="space-y-3">
                      <h3 className="font-semibold text-center">{preset.name}</h3>
                      <div className="flex space-x-1">
                        {Object.values(preset.colors).map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded flex-1"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Apply Preset
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}