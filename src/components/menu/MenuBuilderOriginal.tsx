'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  GripVertical,
  Building2,
  ExternalLink
} from 'lucide-react';
import { CategoryItem } from './CategoryItem';
import { MenuItemDialog } from './MenuItemDialog';
import { MenuPreview } from './MenuPreview';
import { MenuSettings } from './MenuSettings';
import { useMenuData } from './hooks/useMenuData';
import { MenuCategory, MenuItem } from './types';
import { getMenuUrl, getQRCodeUrl } from '@/lib/env';
import { themes } from './constants';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';

export function MenuBuilder() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  
  // Always sync the restaurant ID with the current restaurant
  useEffect(() => {
    console.log('🏪 MenuBuilder - Restaurant changed:', currentRestaurant?.name, currentRestaurant?.id);

    if (currentRestaurant?.id) {
      const newRestaurantId = currentRestaurant.id;

      // Check if this is actually a different restaurant
      if (selectedRestaurantId !== newRestaurantId) {
        console.log('🔄 MenuBuilder - Switching restaurant from', selectedRestaurantId, 'to', newRestaurantId);
        setSelectedRestaurantId(newRestaurantId);
      }
    } else {
      console.log('❌ MenuBuilder - No restaurant available, clearing menu');
      setSelectedRestaurantId('');
    }
  }, [currentRestaurant?.id, selectedRestaurantId]); // Include selectedRestaurantId to track changes
  
  const {
    categories,
    setCategories,
    isMenuPublic,
    setIsMenuPublic,
    selectedTheme,
    setSelectedTheme,
    hasUnsavedChanges,
    isAutoSaveEnabled,
    setIsAutoSaveEnabled,
    lastSaved,
    isClient,
    saveChanges,
    markAsChanged
  } = useMenuData(selectedRestaurantId);

  // Ensure selectedTheme is always valid
  const safeSelectedTheme = themes[selectedTheme as keyof typeof themes] ? selectedTheme : 'blue';

  const [activeTab, setActiveTab] = useState('builder');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);

  // Handle tab change with confirmation
  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      const shouldProceed = window.confirm(
        'You have unsaved changes. Are you sure you want to switch tabs? Your changes will be auto-saved.'
      );
      if (shouldProceed) {
        saveChanges();
        setActiveTab(newTab);
      }
    } else {
      setActiveTab(newTab);
    }
  };

  // Handle page unload with confirmation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle category reordering
    if (activeId.startsWith('category-') && overId.startsWith('category-')) {
      const activeCategory = categories.find(cat => `category-${cat.id}` === activeId);
      const overCategory = categories.find(cat => `category-${cat.id}` === overId);
      
      if (activeCategory && overCategory) {
        const newCategories = [...categories];
        const activeIndex = newCategories.findIndex(cat => cat.id === activeCategory.id);
        const overIndex = newCategories.findIndex(cat => cat.id === overCategory.id);
        
        newCategories.splice(activeIndex, 1);
        newCategories.splice(overIndex, 0, activeCategory);
        
        setCategories(newCategories);
        markAsChanged();
      }
    }

    // Handle item movement between categories or within categories
    if (activeId.startsWith('item-')) {
      const activeItem = categories.flatMap(cat => cat.items).find(item => `item-${item.id}` === activeId);
      
      if (activeItem) {
        // Check if dropping on a category
        if (overId.startsWith('category-')) {
          const targetCategoryId = overId.replace('category-', '');
          if (activeItem.categoryId !== targetCategoryId) {
            // Move item to different category
            setCategories(categories.map(cat => {
              if (cat.id === activeItem.categoryId) {
                // Remove from source category
                return { ...cat, items: cat.items.filter(item => item.id !== activeItem.id) };
              } else if (cat.id === targetCategoryId) {
                // Add to target category
                const updatedItem = { ...activeItem, categoryId: targetCategoryId };
                return { ...cat, items: [...cat.items, updatedItem] };
              }
              return cat;
            }));
            markAsChanged();
          }
        } else if (overId.startsWith('item-')) {
          // Handle item reordering within same category or between categories
          const overItem = categories.flatMap(cat => cat.items).find(item => `item-${item.id}` === overId);
          
          if (overItem) {
            if (activeItem.categoryId === overItem.categoryId) {
              // Reorder within same category
              const category = categories.find(cat => cat.id === activeItem.categoryId);
              if (category) {
                const newItems = [...category.items];
                const activeIndex = newItems.findIndex(item => item.id === activeItem.id);
                const overIndex = newItems.findIndex(item => item.id === overItem.id);
                
                newItems.splice(activeIndex, 1);
                newItems.splice(overIndex, 0, activeItem);
                
                setCategories(categories.map(cat => 
                  cat.id === category.id 
                    ? { ...cat, items: newItems }
                    : cat
                ));
                markAsChanged();
              }
            } else {
              // Move item to different category
              setCategories(categories.map(cat => {
                if (cat.id === activeItem.categoryId) {
                  // Remove from source category
                  return { ...cat, items: cat.items.filter(item => item.id !== activeItem.id) };
                } else if (cat.id === overItem.categoryId) {
                  // Add to target category
                  const updatedItem = { ...activeItem, categoryId: overItem.categoryId };
                  return { ...cat, items: [...cat.items, updatedItem] };
                }
                return cat;
              }));
              markAsChanged();
            }
          }
        }
      }
    }

    setActiveId(null);
  };

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: MenuCategory = {
        id: Date.now().toString(),
        name: newCategoryName,
        items: [],
        order: categories.length
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setIsAddingCategory(false);
      markAsChanged();
    }
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    markAsChanged();
  };

  const addMenuItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: `${categoryId}-${Date.now()}`,
      name: 'New Item',
      description: 'Item description',
      price: 0,
      categoryId,
      isAvailable: true,
      isFeatured: false,
      order: categories.find(cat => cat.id === categoryId)?.items.length || 0
    };
    
    setSelectedItem(newItem);
    setIsItemDialogOpen(true);
  };

  const saveMenuItem = (item: MenuItem) => {
    setCategories(categories.map(cat => 
      cat.id === item.categoryId
        ? { ...cat, items: [...cat.items.filter(i => i.id !== item.id), item] }
        : cat
    ));
    setIsItemDialogOpen(false);
    setSelectedItem(null);
    markAsChanged();
  };

  const deleteMenuItem = (itemId: string, categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId
        ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
        : cat
    ));
    markAsChanged();
  };

  const toggleItemAvailability = (itemId: string, categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId
        ? { 
            ...cat, 
            items: cat.items.map(item => 
              item.id === itemId 
                ? { ...item, isAvailable: !item.isAvailable }
                : item
            )
          }
        : cat
    ));
    markAsChanged();
  };

  const toggleItemFeatured = (itemId: string, categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId
        ? { 
            ...cat, 
            items: cat.items.map(item => 
              item.id === itemId 
                ? { ...item, isFeatured: !item.isFeatured }
                : item
            )
          }
        : cat
    ));
    markAsChanged();
  };

  // Preview tab button handlers
  const handleCustomize = () => {
    console.log('Opening customization options...');
  };

  const handleShare = () => {
    const menuUrl = `${window.location.origin}/menu/${selectedRestaurantId}`;
    navigator.clipboard.writeText(menuUrl).then(() => {
      alert('Menu URL copied to clipboard!');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = menuUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Menu URL copied to clipboard!');
    });
  };

  const handleDownloadQR = () => {
    const menuUrl = getMenuUrl(selectedRestaurantId);
    const qrCodeUrl = getQRCodeUrl(menuUrl, 200);
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'menu-qr-code.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyURL = () => {
    const menuUrl = `${window.location.origin}/menu/${selectedRestaurantId}`;
    navigator.clipboard.writeText(menuUrl).then(() => {
      alert('Menu URL copied to clipboard!');
    });
  };

  const handleShareSocial = () => {
    const menuUrl = `${window.location.origin}/menu/${selectedRestaurantId}`;
    const text = 'Check out our digital menu!';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(menuUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleEmbedWebsite = () => {
    const embedCode = `<iframe src="${window.location.origin}/menu/${selectedRestaurantId}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode).then(() => {
      alert('Embed code copied to clipboard!');
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Restaurant Selector */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Restaurant Selection</h2>
              <p className="text-sm text-gray-600">Choose which restaurant menu to edit</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-blue-200 bg-white shadow-sm">
              <span className="text-sm font-semibold text-gray-700">
                🏪 Restaurant ID: {selectedRestaurantId || 'Loading...'}
              </span>
            </div>
            {user?.email && (
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-xs text-green-700 font-medium">
                  👤 {user.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Actions */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => window.open(`/menu/${selectedRestaurantId}`, '_blank')}
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
        <div className="flex items-center space-x-3">
          {lastSaved && (
            <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-medium">Auto-saved</span>
              <span className="text-xs text-green-500 ml-2">
                {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          )}
          {hasUnsavedChanges && (
            <div className="text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-medium">Saving changes...</span>
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="builder" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-semibold transition-all duration-200"
          >
            🛠️ Menu Builder
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-semibold transition-all duration-200"
          >
            👁️ Live Preview
          </TabsTrigger>
        </TabsList>

      {/* Menu Builder Tab */}
      <TabsContent value="builder" className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setIsAddingCategory(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            {categories.length} categories • {categories.reduce((acc, cat) => acc + cat.items.length, 0)} items
          </div>
        </div>

        {/* Add Category Form */}
        {isAddingCategory && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Appetizers, Main Courses"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={addCategory}>Add Category</Button>
                  <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Categories */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onDelete={deleteCategory}
                onAddItem={addMenuItem}
                onEditItem={(item) => {
                  setSelectedItem(item);
                  setIsItemDialogOpen(true);
                }}
                onDeleteItem={deleteMenuItem}
                onToggleAvailability={toggleItemAvailability}
                onToggleFeatured={toggleItemFeatured}
              />
            ))}
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500 opacity-90">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {activeId.startsWith('category-') 
                      ? categories.find(cat => `category-${cat.id}` === activeId)?.name || 'Category'
                      : 'Menu Item'
                    }
                  </span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </TabsContent>

      {/* Live Preview Tab */}
      <TabsContent value="preview" className="space-y-6">
        <MenuPreview
          categories={categories}
          previewDevice={previewDevice}
          setPreviewDevice={setPreviewDevice}
          selectedTheme={safeSelectedTheme}
          setSelectedTheme={setSelectedTheme}
          isMenuPublic={isMenuPublic}
          setIsMenuPublic={setIsMenuPublic}
          isAutoSaveEnabled={isAutoSaveEnabled}
          setIsAutoSaveEnabled={setIsAutoSaveEnabled}
          isClient={isClient}
          onCustomize={handleCustomize}
          onShare={handleShare}
          onDownloadQR={handleDownloadQR}
          onCopyURL={handleCopyURL}
          onShareSocial={handleShareSocial}
          onEmbedWebsite={handleEmbedWebsite}
        />

      </TabsContent>

      {/* Menu Item Dialog */}
      {selectedItem && (
        <MenuItemDialog
          item={selectedItem}
          isOpen={isItemDialogOpen}
          onClose={() => {
            setIsItemDialogOpen(false);
            setSelectedItem(null);
          }}
          onSave={saveMenuItem}
          allMenuItems={categories.flatMap(category => category.items)}
        />
      )}
    </Tabs>
    </div>
  );
}