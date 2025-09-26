'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface DragDropContainerProps {
  id: string;
  title: string;
  items: any[];
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  emptyState?: React.ReactNode;
  headerActions?: React.ReactNode;
  isDragOverlayActive?: boolean;
  itemPrefix?: string;
  containerPrefix?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DragDropContainer({
  id,
  title,
  items,
  children,
  className,
  headerClassName,
  contentClassName,
  emptyState,
  headerActions,
  isDragOverlayActive = false,
  itemPrefix = 'item-',
  containerPrefix = 'container-',
  isCollapsed = false,
  onToggleCollapse
}: DragDropContainerProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${containerPrefix}${id}`,
  });

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: `${containerPrefix}${id}`,
  });

  // Additional droppable for container reordering
  const { isOver: isOverContainer, setNodeRef: setContainerDropRef } = useDroppable({
    id: `${containerPrefix}${id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const itemIds = items.map(item => `${itemPrefix}${item.id}`);

  const combinedRef = (element: HTMLDivElement | null) => {
    setSortableRef(element);
    setContainerDropRef(element);
  };

  const isAnyOver = isOver || isOverContainer;

  return (
    <div
      ref={combinedRef}
      style={style}
      className={cn(
        'bg-white rounded-lg border transition-all duration-200 relative',
        // Ensure minimum height for drop detection even when collapsed
        isCollapsed && 'min-h-[60px]',
        isAnyOver && 'border-blue-500 bg-blue-50/80 shadow-lg scale-[1.02] border-2',
        isDragging && 'opacity-30 scale-95',
        isDragOverlayActive && 'opacity-50',
        className
      )}
      {...attributes}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2 border-b bg-gray-50 rounded-t-lg transition-colors duration-200',
          isAnyOver && 'bg-blue-100 border-blue-300',
          headerClassName
        )}
      >
        <div className="flex items-center space-x-2">
          <div
            className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing transition-colors duration-200 touch-none"
            {...attributes}
            {...listeners}
            style={{
              touchAction: 'none',
            }}
          >
            <GripVertical className="w-3 h-3 text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
            {items.length}
          </span>
          {onToggleCollapse && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse();
              }}
              className="ml-1 p-0.5 hover:bg-gray-200 rounded transition-colors duration-200"
            >
              <svg
                className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        {headerActions && (
          <div className="flex items-center space-x-2">
            {headerActions}
          </div>
        )}
      </div>

      {/* Drop Indicator */}
      {isAnyOver && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg border-2 border-dashed border-blue-500 z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <span>Drop here</span>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Container Drop Zone Indicator for Reordering */}
      {isAnyOver && (
        <>
          <div className="absolute -top-2 left-0 right-0 h-1 bg-blue-500 rounded-full z-20 animate-pulse"></div>
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full z-20 animate-pulse"></div>
        </>
      )}

      {/* Content */}
      {!isCollapsed && (
        <div
          ref={setDroppableRef}
          className={cn(
            'p-2 min-h-[80px] relative transition-all duration-300 ease-in-out',
            isAnyOver && 'bg-blue-50/30',
            contentClassName
          )}
        >
          {items.length === 0 ? (
            emptyState || (
              <div className="text-center py-8 text-gray-500">
                <div className="text-gray-300 mb-2">📦</div>
                <p>No items yet</p>
              </div>
            )
          ) : (
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {children}
              </div>
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}