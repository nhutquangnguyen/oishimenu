'use client';

import { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MenuCategory, MenuItem } from './MenuBuilder';
import { MenuItem as MenuItemComponent } from './MenuItem';

interface CategoryItemProps {
  category: MenuCategory;
  onDelete: (categoryId: string) => void;
  onAddItem: (categoryId: string) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string, categoryId: string) => void;
  onToggleAvailability: (itemId: string, categoryId: string) => void;
  onToggleFeatured: (itemId: string, categoryId: string) => void;
  isExpanded?: boolean;
  onToggleExpanded?: (categoryId: string) => void;
}

export function CategoryItem({ 
  category, 
  onDelete, 
  onAddItem, 
  onEditItem,
  onDeleteItem,
  onToggleAvailability,
  onToggleFeatured,
  isExpanded = false,
  onToggleExpanded
}: CategoryItemProps) {
  // Use internal state if no external control is provided
  const [internalExpanded, setInternalExpanded] = useState(false);
  const actualExpanded = onToggleExpanded ? isExpanded : internalExpanded;
  
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `category-${category.id}`,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `category-${category.id}`,
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''} ${isOver ? 'ring-2 ring-blue-300 bg-blue-50' : ''} transition-all`}
      data-category-id={`category-${category.id}`}
    >
      <CardHeader className={`pb-3 ${isOver && !actualExpanded ? 'bg-blue-50 border-b-2 border-blue-200' : ''} transition-colors`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (onToggleExpanded) {
                    onToggleExpanded(category.id);
                  } else {
                    setInternalExpanded(!internalExpanded);
                  }
                }}
                className="p-1 h-auto"
              >
                {actualExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              <div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                {category.description && (
                  <CardDescription>{category.description}</CardDescription>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {category.items.length} items
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddItem(category.id)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(category.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {actualExpanded && (
        <CardContent>
          {category.items.length > 0 ? (
            <SortableContext items={category.items.map(item => `item-${item.id}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <MenuItemComponent
                    key={item.id}
                    item={item}
                    onEdit={() => onEditItem(item)}
                    onDelete={() => onDeleteItem(item.id, category.id)}
                    onToggleAvailability={() => onToggleAvailability(item.id, category.id)}
                    onToggleFeatured={() => onToggleFeatured(item.id, category.id)}
                  />
                ))}
              </div>
            </SortableContext>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No items in this category yet.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => onAddItem(category.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add your first item
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
