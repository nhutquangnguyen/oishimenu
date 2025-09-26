'use client';

import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export interface DragDropItem {
  id: string;
  parentId?: string;
  [key: string]: any;
}

export interface DragDropContainer {
  id: string;
  name: string;
  items: DragDropItem[];
  [key: string]: any;
}

export interface DragDropCallbacks {
  onItemMove?: (itemId: string, fromContainerId: string, toContainerId: string) => void;
  onItemReorder?: (containerId: string, fromIndex: number, toIndex: number) => void;
  onContainerReorder?: (fromIndex: number, toIndex: number) => void;
  onDragStart?: (itemId: string) => void;
  onDragEnd?: () => void;
}

interface DragDropManagerProps {
  containers: DragDropContainer[];
  activeId: string | null;
  callbacks: DragDropCallbacks;
  children: React.ReactNode;
  renderDragOverlay?: (activeId: string, containers: DragDropContainer[]) => React.ReactNode;
  itemPrefix?: string;
  containerPrefix?: string;
}

export function DragDropManager({
  containers,
  activeId,
  callbacks,
  children,
  renderDragOverlay,
  itemPrefix = 'item-',
  containerPrefix = 'container-'
}: DragDropManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string;
    console.log('🎯 Drag started:', activeId);
    callbacks.onDragStart?.(activeId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('🎯 Drag ended:', {
      activeId: active.id,
      overId: over?.id,
      hasOver: !!over
    });

    if (!over) {
      callbacks.onDragEnd?.();
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle container reordering
    if (activeId.startsWith(containerPrefix) && overId.startsWith(containerPrefix)) {
      const activeContainerIndex = containers.findIndex(c => `${containerPrefix}${c.id}` === activeId);
      const overContainerIndex = containers.findIndex(c => `${containerPrefix}${c.id}` === overId);

      if (activeContainerIndex !== -1 && overContainerIndex !== -1 && activeContainerIndex !== overContainerIndex) {
        callbacks.onContainerReorder?.(activeContainerIndex, overContainerIndex);
      }
    }

    // Handle item operations
    if (activeId.startsWith(itemPrefix)) {
      const activeItem = containers.flatMap(c => c.items).find(item => `${itemPrefix}${item.id}` === activeId);

      if (!activeItem) {
        callbacks.onDragEnd?.();
        return;
      }

      const currentContainer = containers.find(c => c.items.some(item => item.id === activeItem.id));

      if (!currentContainer) {
        callbacks.onDragEnd?.();
        return;
      }

      // Dropping on a container
      if (overId.startsWith(containerPrefix)) {
        const targetContainerId = overId.replace(containerPrefix, '');
        const targetContainer = containers.find(c => c.id === targetContainerId);

        if (targetContainer && currentContainer.id !== targetContainer.id) {
          callbacks.onItemMove?.(activeItem.id, currentContainer.id, targetContainer.id);
        }
      }
      // Dropping on an item
      else if (overId.startsWith(itemPrefix)) {
        const overItem = containers.flatMap(c => c.items).find(item => `${itemPrefix}${item.id}` === overId);

        if (overItem) {
          const overContainer = containers.find(c => c.items.some(item => item.id === overItem.id));

          if (overContainer) {
            if (currentContainer.id === overContainer.id) {
              // Reorder within same container
              const currentItems = currentContainer.items;
              const activeIndex = currentItems.findIndex(item => item.id === activeItem.id);
              const overIndex = currentItems.findIndex(item => item.id === overItem.id);

              if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
                callbacks.onItemReorder?.(currentContainer.id, activeIndex, overIndex);
              }
            } else {
              // Move to different container
              callbacks.onItemMove?.(activeItem.id, currentContainer.id, overContainer.id);
            }
          }
        }
      }
    }

    callbacks.onDragEnd?.();
  };

  const defaultRenderDragOverlay = (activeId: string, containers: DragDropContainer[]) => {
    if (activeId.startsWith(containerPrefix)) {
      const container = containers.find(c => `${containerPrefix}${c.id}` === activeId);
      return (
        <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-2xl opacity-90 pointer-events-none text-sm font-medium">
          📦 {container?.name || 'Container'} ({container?.items?.length || 0})
        </div>
      );
    } else if (activeId.startsWith(itemPrefix)) {
      const item = containers.flatMap(c => c.items).find(item => `${itemPrefix}${item.id}` === activeId);
      return (
        <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-2xl opacity-90 pointer-events-none text-sm font-medium">
          📄 {item?.name || 'Item'}
        </div>
      );
    }
    return null;
  };

  const containerIds = containers.map(container => `${containerPrefix}${container.id}`);

  // Custom collision detection that works better for both items and containers
  const customCollisionDetection = (args) => {
    const { active } = args;
    const activeId = active.id as string;

    // For container dragging, use rectIntersection which is better for container reordering
    if (activeId.startsWith(containerPrefix)) {
      const rectCollisions = rectIntersection(args);
      if (rectCollisions.length > 0) {
        return rectCollisions;
      }

      // Fallback to pointer-based detection for containers
      return pointerWithin(args);
    }

    // For item dragging, use closestCenter
    return closestCenter(args);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={containerIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>

      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'ease',
        }}
      >
        {activeId ? (
          renderDragOverlay ?
            renderDragOverlay(activeId, containers) :
            defaultRenderDragOverlay(activeId, containers)
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}