'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface DragDropItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  isDragOverlayActive?: boolean;
  itemPrefix?: string;
  dragHandle?: React.ReactNode;
}

export function DragDropItem({
  id,
  children,
  className,
  isDragOverlayActive = false,
  itemPrefix = 'item-',
  dragHandle
}: DragDropItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${itemPrefix}${id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'transition-all duration-200 relative flex items-start space-x-2',
        isDragging && 'opacity-30 scale-95 rotate-1',
        isDragOverlayActive && 'opacity-50',
        className
      )}
      {...attributes}
    >
      <div
        className="flex-shrink-0 p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing transition-colors duration-200 mt-1 touch-none"
        {...listeners}
        style={{
          touchAction: 'none',
        }}
      >
        {dragHandle || <GripVertical className="w-3 h-3 text-gray-400" />}
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}