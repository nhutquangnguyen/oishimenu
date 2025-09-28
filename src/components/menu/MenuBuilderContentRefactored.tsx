'use client';

import React, { useState } from 'react';
import { DragDropManager, DragDropContainer } from '@/components/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuItemCard } from './MenuItemCard';
import { MenuItemDialog } from './MenuItemDialog';
import { MenuCategory, MenuItem } from './types';
import { arrayMove } from '@dnd-kit/sortable';

interface MenuBuilderContentRefactoredProps {
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
  onDragStart: (activeId: string) => void;
  onDragEnd: () => void;
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
  onCategoriesChange: (categories: MenuCategory[]) => void;
}

export function MenuBuilderContentRefactored({
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
  onCategoriesChange
}: MenuBuilderContentRefactoredProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [preDragCollapsedState, setPreDragCollapsedState] = useState<Set<string> | null>(null);
  const [isDraggingContainer, setIsDraggingContainer] = useState(false);

  const containers = categories.map(category => ({
    id: category.id,
    name: category.name,
    items: category.items
  }));

  const toggleCategoryCollapse = (categoryId: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleCollapseAll = () => {
    if (collapsedCategories.size === categories.length) {
      // If all are collapsed, expand all
      setCollapsedCategories(new Set());
    } else {
      // Otherwise, collapse all
      const allCategoryIds = categories.map(cat => cat.id);
      setCollapsedCategories(new Set(allCategoryIds));
    }
  };

  const handleDragStart = (activeId: string) => {
    onDragStart(activeId);

    // Check if dragging a container/category
    if (activeId.startsWith('category-')) {
      setIsDraggingContainer(true);
      // Save current collapse state
      setPreDragCollapsedState(new Set(collapsedCategories));
      // Collapse all categories
      const allCategoryIds = categories.map(cat => cat.id);
      setCollapsedCategories(new Set(allCategoryIds));
    }
  };

  const handleDragEnd = () => {
    onDragEnd();

    // If we were dragging a container, restore the previous collapse state
    if (isDraggingContainer && preDragCollapsedState !== null) {
      setCollapsedCategories(preDragCollapsedState);
      setPreDragCollapsedState(null);
      setIsDraggingContainer(false);
    }
  };

  const handleItemMove = (itemId: string, fromContainerId: string, toContainerId: string) => {
    const updatedCategories = categories.map(category => {
      if (category.id === fromContainerId) {
        // Remove from source category
        return { ...category, items: category.items.filter(item => item.id !== itemId) };
      } else if (category.id === toContainerId) {
        // Add to target category
        const itemToMove = categories
          .flatMap(cat => cat.items)
          .find(item => item.id === itemId);
        if (itemToMove) {
          return {
            ...category,
            items: [...category.items, { ...itemToMove, categoryId: toContainerId }]
          };
        }
      }
      return category;
    });

    onCategoriesChange(updatedCategories);
    markAsChanged();
  };

  const handleItemReorder = (containerId: string, fromIndex: number, toIndex: number) => {
    const updatedCategories = categories.map(category => {
      if (category.id === containerId) {
        const reorderedItems = arrayMove(category.items, fromIndex, toIndex);
        return { ...category, items: reorderedItems };
      }
      return category;
    });

    onCategoriesChange(updatedCategories);
    markAsChanged();
  };

  const handleContainerReorder = (fromIndex: number, toIndex: number) => {
    const reorderedCategories = arrayMove(categories, fromIndex, toIndex);
    onCategoriesChange(reorderedCategories);
    markAsChanged();
  };

  const renderDragOverlay = (activeId: string) => {
    if (activeId.startsWith('item-')) {
      const item = categories.flatMap(cat => cat.items).find(item => item.id === activeId.replace('item-', ''));
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{item?.name || 'Menu Item'}</span>
          </div>
        </div>
      );
    } else if (activeId.startsWith('category-')) {
      const category = categories.find(cat => cat.id === activeId.replace('category-', ''));
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <span className="text-sm font-medium">{category?.name || 'Category'}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Add Category Section */}
        <div className="flex items-center space-x-3 mb-6">
          {isAddingCategory ? (
            <>
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onAddCategory();
                  }
                }}
              />
              <Button onClick={onAddCategory} disabled={!newCategoryName.trim()}>
                Add
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsAddingCategory(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          )}
        </div>

        {/* Categories List */}
        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-gray-400 mb-4">
              <GripVertical className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No categories yet</h3>
            <p className="text-gray-500 text-center">
              Start by adding your first category to organize your menu items
            </p>
          </div>
        ) : (
          <>
            {/* Collapse All Button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCollapseAll}
                className="text-gray-600 hover:text-gray-800"
              >
                {collapsedCategories.size === categories.length ? (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Expand All
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Collapse All
                  </>
                )}
              </Button>
            </div>

            <DragDropManager
              containers={containers}
              activeId={activeId}
            callbacks={{
              onItemMove: handleItemMove,
              onItemReorder: handleItemReorder,
              onContainerReorder: handleContainerReorder,
              onDragStart: handleDragStart,
              onDragEnd: handleDragEnd
            }}
            renderDragOverlay={renderDragOverlay}
            itemPrefix="item-"
            containerPrefix="category-"
          >
            <div className="space-y-4">
              {containers.map((container) => (
                <DragDropContainer
                  key={container.id}
                  id={container.id}
                  title={container.name}
                  items={container.items}
                  itemPrefix="item-"
                  containerPrefix="category-"
                  className="border-gray-200"
                  headerClassName="bg-gray-50"
                  isCollapsed={collapsedCategories.has(container.id)}
                  onToggleCollapse={() => toggleCategoryCollapse(container.id)}
                  headerActions={
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddMenuItem(container.id)}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Item
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteCategory(container.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete Category
                      </Button>
                    </div>
                  }
                  emptyState={
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-gray-300 mb-2">🍽️</div>
                      <p className="text-sm mb-4">No menu items in this category yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddMenuItem(container.id)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add First Item
                      </Button>
                    </div>
                  }
                >
                  {container.items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onEditItem={(item) => {
                        console.log('🍽️ Edit button clicked for item:', item);
                        setSelectedItem(item);
                        setIsItemDialogOpen(true);
                        console.log('🍽️ Dialog should be open now');
                      }}
                      onDeleteItem={onDeleteMenuItem}
                      onToggleAvailability={onToggleItemAvailability}
                      onToggleFeatured={onToggleItemFeatured}
                    />
                  ))}
                </DragDropContainer>
              ))}
            </div>
          </DragDropManager>
          </>
        )}
      </div>

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

    </>
  );
}