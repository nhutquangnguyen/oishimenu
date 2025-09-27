'use client';

import { useState, useEffect } from 'react';
import { MenuBuilderHeader } from './MenuBuilderHeader';
import { MenuBuilderTabs } from './MenuBuilderTabs';
import { useMenuData } from './hooks/useMenuData';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MenuCategory, MenuItem } from './types';
import { themes } from './constants';
import { createSampleMenu } from '@/lib/sample-menu-templates';
import QRCode from 'qrcode';

export function MenuBuilderRefactored() {
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
  }, [currentRestaurant?.id, selectedRestaurantId]);
  
  const {
    categories,
    setCategories,
    optionGroups,
    setOptionGroups,
    isMenuPublic,
    setIsMenuPublic,
    selectedTheme,
    setSelectedTheme,
    logo,
    setLogo,
    showPoweredBy,
    setShowPoweredBy,
    isAutoSaveEnabled,
    setIsAutoSaveEnabled,
    isClient,
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  // Handle tab change
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: any) => {
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
                return { ...cat, items: [...cat.items, { ...activeItem, categoryId: targetCategoryId }] };
              }
              return cat;
            }));
            markAsChanged();
          }
        } else if (overId.startsWith('item-')) {
          // Handle item reordering within or between categories
          const overItem = categories.flatMap(cat => cat.items).find(item => `item-${item.id}` === overId);
          if (overItem && activeItem.categoryId === overItem.categoryId) {
            // Reorder within same category
            const category = categories.find(cat => cat.id === activeItem.categoryId);
            if (category) {
              const newItems = [...category.items];
              const activeIndex = newItems.findIndex(item => item.id === activeItem.id);
              const overIndex = newItems.findIndex(item => item.id === overItem.id);
              
              newItems.splice(activeIndex, 1);
              newItems.splice(overIndex, 0, activeItem);
              
              setCategories(categories.map(cat => 
                cat.id === activeItem.categoryId 
                  ? { ...cat, items: newItems }
                  : cat
              ));
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

  const handlePreviewMenu = () => {
    window.open(`/menu/${selectedRestaurantId}`, '_blank');
  };

  // Preview action handlers
  const handleCustomize = () => {
    setActiveTab('builder');
  };

  const handleShare = () => {
    if (selectedRestaurantId) {
      const menuUrl = `${window.location.origin}/menu/${selectedRestaurantId}`;
      navigator.clipboard.writeText(menuUrl).then(() => {
        alert('Menu URL copied to clipboard!');
      });
    }
  };

  const handleDownloadQR = async () => {
    if (!selectedRestaurantId) return;

    try {
      const menuUrl = `${window.location.origin}/menu/${selectedRestaurantId}`;

      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(menuUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${currentRestaurant?.name || 'menu'}-qr-code.png`;
      link.href = qrDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    }
  };

  const handleCopyURL = () => {
    if (selectedRestaurantId) {
      const menuUrl = `${window.location.origin}/menu/${selectedRestaurantId}`;
      navigator.clipboard.writeText(menuUrl).then(() => {
        alert('Menu URL copied to clipboard!');
      });
    }
  };

  const handleShareSocial = () => {
    alert('Social media sharing feature will be implemented soon.');
  };

  const handleEmbedWebsite = () => {
    alert('Website embedding feature will be implemented soon.');
  };

  // Collapse/Expand functionality
  const handleToggleAllExpanded = () => {
    if (allExpanded) {
      // Collapse all
      setExpandedCategories(new Set());
      setAllExpanded(false);
    } else {
      // Expand all
      const allCategoryIds = new Set(categories.map(cat => cat.id));
      setExpandedCategories(allCategoryIds);
      setAllExpanded(true);
    }
  };

  const handleToggleCategoryExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);

    // Update allExpanded state
    setAllExpanded(newExpanded.size === categories.length);
  };

  // Logo handler
  const handleLogoChange = (logoUrl: string | undefined) => {
    setLogo(logoUrl);
    markAsChanged();
  };

  // Powered by handler
  const handleShowPoweredByChange = (show: boolean) => {
    setShowPoweredBy(show);
    markAsChanged();
  };

  // Clear menu handler
  const handleClearMenu = () => {
    if (window.confirm('Are you sure you want to clear all menu items? This action cannot be undone.')) {
      setCategories([]);
      setOptionGroups([]);
      markAsChanged();
    }
  };

  // Load template handler
  const handleLoadTemplate = (templateKey: string) => {
    if (window.confirm('Loading a template will replace your current menu. Continue?')) {
      const templateData = createSampleMenu(selectedRestaurantId, templateKey as any);
      setCategories(templateData.categories);
      setOptionGroups(templateData.optionGroups);
      markAsChanged();
    }
  };

  return (
    <div className="space-y-6">
      <MenuBuilderHeader
        selectedRestaurantId={selectedRestaurantId}
        onPreviewMenu={handlePreviewMenu}
        onClearMenu={handleClearMenu}
        onLoadTemplate={handleLoadTemplate}
        onDownloadQR={handleDownloadQR}
      />

      <MenuBuilderTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        categories={categories}
        setCategories={setCategories}
        optionGroups={optionGroups}
        setOptionGroups={setOptionGroups}
        selectedRestaurantId={selectedRestaurantId}
        selectedTheme={safeSelectedTheme}
        setSelectedTheme={setSelectedTheme}
        isMenuPublic={isMenuPublic}
        setIsMenuPublic={setIsMenuPublic}
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onAddMenuItem={addMenuItem}
        onSaveMenuItem={saveMenuItem}
        onDeleteMenuItem={deleteMenuItem}
        onToggleItemAvailability={toggleItemAvailability}
        onToggleItemFeatured={toggleItemFeatured}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        activeId={activeId}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isItemDialogOpen={isItemDialogOpen}
        setIsItemDialogOpen={setIsItemDialogOpen}
        isAddingCategory={isAddingCategory}
        setIsAddingCategory={setIsAddingCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        markAsChanged={markAsChanged}
        isAutoSaveEnabled={isAutoSaveEnabled}
        setIsAutoSaveEnabled={setIsAutoSaveEnabled}
        isClient={isClient}
        onCustomize={handleCustomize}
        onShare={handleShare}
        onDownloadQR={handleDownloadQR}
        onCopyURL={handleCopyURL}
        onShareSocial={handleShareSocial}
        onEmbedWebsite={handleEmbedWebsite}
        allExpanded={allExpanded}
        onToggleAllExpanded={handleToggleAllExpanded}
        expandedCategories={expandedCategories}
        onToggleCategoryExpanded={handleToggleCategoryExpanded}
        logo={logo}
        onLogoChange={handleLogoChange}
        showPoweredBy={showPoweredBy}
        setShowPoweredBy={handleShowPoweredByChange}
      />
    </div>
  );
}
