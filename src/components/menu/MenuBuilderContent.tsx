'use client';

import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { CategoryItem } from './CategoryItem';
import { MenuItemDialog } from './MenuItemDialog';
import { MenuCategory, MenuItem } from './types';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface MenuBuilderContentProps {
  categories: MenuCategory[];
  setCategories: (categories: MenuCategory[]) => void;
  optionGroups: any[];
  onAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddMenuItem: (categoryId: string) => void;
  onSaveMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (itemId: string, categoryId: string) => void;
  onToggleItemAvailability: (itemId: string, categoryId: string) => void;
  onToggleItemFeatured: (itemId: string, categoryId: string) => void;
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  activeId: string | null;
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  isItemDialogOpen: boolean;
  setIsItemDialogOpen: (open: boolean) => void;
  isAddingCategory: boolean;
  setIsAddingCategory: (adding: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  markAsChanged: () => void;
  allExpanded: boolean;
  onToggleAllExpanded: () => void;
  expandedCategories: Set<string>;
  onToggleCategoryExpanded: (categoryId: string) => void;
}

export function MenuBuilderContent({
  categories,
  setCategories,
  optionGroups,
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
  allExpanded,
  onToggleAllExpanded,
  expandedCategories,
  onToggleCategoryExpanded
}: MenuBuilderContentProps) {
  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetection={closestCenter}>
      <div className="space-y-6">
        {/* Add Category Button and Collapse Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="w-full sm:w-auto">
            {isAddingCategory ? (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full sm:w-64"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onAddCategory();
                    }
                  }}
                />
                <div className="flex space-x-2 sm:space-x-3">
                  <Button onClick={onAddCategory} disabled={!newCategoryName.trim()} className="flex-1 sm:flex-none">
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName('');
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsAddingCategory(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            )}
          </div>

          {/* Collapse/Expand All Button */}
          {categories.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAllExpanded}
              className="flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              {allExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Collapse All</span>
                  <span className="sm:hidden">Collapse</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Expand All</span>
                  <span className="sm:hidden">Expand</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 mb-4">
                  <GripVertical className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No categories yet</h3>
                <p className="text-gray-500 text-center mb-4">
                  Start by adding your first category to organize your menu items
                </p>
                <Button
                  onClick={() => setIsAddingCategory(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Category
                </Button>
              </CardContent>
            </Card>
          ) : (
            <SortableContext items={categories.map(cat => `category-${cat.id}`)} strategy={verticalListSortingStrategy}>
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onDelete={onDeleteCategory}
                  onAddItem={onAddMenuItem}
                  onEditItem={(item) => {
                    console.log('🍽️ Edit button clicked for item:', item);
                    setSelectedItem(item);
                    setIsItemDialogOpen(true);
                    console.log('🍽️ Dialog should be open now');
                  }}
                  onDeleteItem={onDeleteMenuItem}
                  onToggleAvailability={onToggleItemAvailability}
                  onToggleFeatured={onToggleItemFeatured}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggleExpanded={onToggleCategoryExpanded}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">
                {activeId.startsWith('category-') 
                  ? categories.find(cat => `category-${cat.id}` === activeId)?.name
                  : 'Menu Item'
                }
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Menu Item Dialog */}
      {selectedItem && (
        <MenuItemDialog
          item={selectedItem}
          isOpen={isItemDialogOpen}
          onSave={onSaveMenuItem}
          optionGroups={optionGroups}
          allMenuItems={(() => {
            const allItems = categories.flatMap(category => category.items);
            console.log('🍽️ All menu items being passed to dialog:', allItems);
            console.log('🍽️ Categories structure:', categories);
            return allItems;
          })()}
          categories={categories}
          onClose={() => {
            console.log('🍽️ Closing dialog');
            setIsItemDialogOpen(false);
            setSelectedItem(null);
          }}
        />
      )}
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded">
          selectedItem: {selectedItem ? 'Yes' : 'No'}<br/>
          isItemDialogOpen: {isItemDialogOpen ? 'Yes' : 'No'}<br/>
          optionGroups: {optionGroups.length}
        </div>
      )}
    </DndContext>
  );
}
