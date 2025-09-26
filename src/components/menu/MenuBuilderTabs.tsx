'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuBuilderContent } from './MenuBuilderContent';
import { MenuPreview } from './MenuPreview';
import { MenuSettings } from './MenuSettings';
import { OptionsManager } from './OptionsManager';

interface MenuBuilderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  categories: any[];
  setCategories: (categories: any[]) => void;
  optionGroups: any[];
  setOptionGroups: (groups: any[]) => void;
  selectedRestaurantId: string;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  isMenuPublic: boolean;
  setIsMenuPublic: (isPublic: boolean) => void;
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  setPreviewDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;
  onAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddMenuItem: (categoryId: string) => void;
  onSaveMenuItem: (item: any) => void;
  onDeleteMenuItem: (itemId: string, categoryId: string) => void;
  onToggleItemAvailability: (itemId: string, categoryId: string) => void;
  onToggleItemFeatured: (itemId: string, categoryId: string) => void;
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  activeId: string | null;
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  isItemDialogOpen: boolean;
  setIsItemDialogOpen: (open: boolean) => void;
  isAddingCategory: boolean;
  setIsAddingCategory: (adding: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  markAsChanged: () => void;
  isAutoSaveEnabled: boolean;
  setIsAutoSaveEnabled: (enabled: boolean) => void;
  isClient: boolean;
  onCustomize: () => void;
  onShare: () => void;
  onDownloadQR: () => void;
  onCopyURL: () => void;
  onShareSocial: () => void;
  onEmbedWebsite: () => void;
  allExpanded: boolean;
  onToggleAllExpanded: () => void;
  expandedCategories: Set<string>;
  onToggleCategoryExpanded: (categoryId: string) => void;
  logo?: string;
  onLogoChange: (logo: string | undefined) => void;
}

export function MenuBuilderTabs({
  activeTab,
  onTabChange,
  categories,
  setCategories,
  optionGroups,
  setOptionGroups,
  selectedRestaurantId,
  selectedTheme,
  setSelectedTheme,
  isMenuPublic,
  setIsMenuPublic,
  previewDevice,
  setPreviewDevice,
  onAddCategory,
  onDeleteCategory,
  onAddMenuItem,
  onSaveMenuItem,
  onDeleteMenuItem,
  onToggleItemAvailability,
  onToggleItemFeatured,
  onDragStart,
  onDragEnd,
  activeId,
  selectedItem,
  setSelectedItem,
  isItemDialogOpen,
  setIsItemDialogOpen,
  isAddingCategory,
  setIsAddingCategory,
  newCategoryName,
  setNewCategoryName,
  markAsChanged,
  isAutoSaveEnabled,
  setIsAutoSaveEnabled,
  isClient,
  onCustomize,
  onShare,
  onDownloadQR,
  onCopyURL,
  onShareSocial,
  onEmbedWebsite,
  allExpanded,
  onToggleAllExpanded,
  expandedCategories,
  onToggleCategoryExpanded,
  logo,
  onLogoChange
}: MenuBuilderTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="builder" className="text-sm font-medium">
          🏗️ Builder
        </TabsTrigger>
        <TabsTrigger value="options" className="text-sm font-medium">
          ⚙️ Options
        </TabsTrigger>
        <TabsTrigger value="preview" className="text-sm font-medium">
          🎨 Brand
        </TabsTrigger>
      </TabsList>

      <TabsContent value="builder" className="space-y-6">
        <MenuBuilderContent
          categories={categories}
          setCategories={setCategories}
          optionGroups={optionGroups}
          onAddCategory={onAddCategory}
          onDeleteCategory={onDeleteCategory}
          onAddMenuItem={onAddMenuItem}
          onSaveMenuItem={onSaveMenuItem}
          onDeleteMenuItem={onDeleteMenuItem}
          onToggleItemAvailability={onToggleItemAvailability}
          onToggleItemFeatured={onToggleItemFeatured}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
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
          allExpanded={allExpanded}
          onToggleAllExpanded={onToggleAllExpanded}
          expandedCategories={expandedCategories}
          onToggleCategoryExpanded={onToggleCategoryExpanded}
        />
      </TabsContent>

      <TabsContent value="options" className="space-y-6">
        <OptionsManager
          optionGroups={optionGroups}
          setOptionGroups={setOptionGroups}
          categories={categories}
          setCategories={setCategories}
          restaurantId={selectedRestaurantId}
          markAsChanged={markAsChanged}
        />
      </TabsContent>

      <TabsContent value="preview" className="space-y-6">
        <MenuPreview
          categories={categories}
          previewDevice={previewDevice}
          setPreviewDevice={setPreviewDevice}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          isMenuPublic={isMenuPublic}
          setIsMenuPublic={setIsMenuPublic}
          isAutoSaveEnabled={isAutoSaveEnabled}
          setIsAutoSaveEnabled={setIsAutoSaveEnabled}
          isClient={isClient}
          onCustomize={onCustomize}
          onShare={onShare}
          onDownloadQR={onDownloadQR}
          onCopyURL={onCopyURL}
          onShareSocial={onShareSocial}
          onEmbedWebsite={onEmbedWebsite}
          logo={logo}
          onLogoChange={onLogoChange}
        />
      </TabsContent>

    </Tabs>
  );
}
