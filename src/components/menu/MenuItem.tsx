'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MenuItem } from './types';
import {
  Edit,
  Trash2,
  GripVertical,
  DollarSign,
  Star,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface MenuItemProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  onToggleFeatured: () => void;
}

export function MenuItem({ 
  item, 
  onEdit, 
  onDelete, 
  onToggleAvailability,
  onToggleFeatured
}: MenuItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `item-${item.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`${isDragging ? 'opacity-50' : ''} transition-all hover:shadow-md`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded mt-1"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {item.name}
                  </h4>
                  {item.isFeatured && (
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {!item.isAvailable && (
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Unavailable
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-semibold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span>Contains: {item.allergens.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={item.isAvailable}
                    onCheckedChange={onToggleAvailability}
                    size="sm"
                  />
                  <span className="text-xs text-gray-500">Available</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={item.isFeatured}
                    onCheckedChange={onToggleFeatured}
                    size="sm"
                  />
                  <span className="text-xs text-gray-500">Featured</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                console.log('🖱️ Edit button clicked in MenuItem for:', item.name);
                onEdit();
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
