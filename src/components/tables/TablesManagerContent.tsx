'use client';

import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { AreaDropZone } from './AreaDropZone';
import { TableOrdersSidebar } from './TableOrdersSidebar';
import { Table, Order } from './types';

interface TablesManagerContentProps {
  areas: string[];
  tables: Table[];
  orders: Order[];
  activeId: string | null;
  selectedTable: Table | null;
  selectedTableOrders: Order[];
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  onDragOver: (event: any) => void;
  onTableClick: (table: Table) => void;
  onCloseSidebar: () => void;
  onDownloadQR: (table: Table) => void;
  onDeleteTable: (tableId: string) => void;
  onUpdateTableStatus: (tableId: string, status: string) => void;
}

export function TablesManagerContent({
  areas,
  tables,
  orders,
  activeId,
  selectedTable,
  selectedTableOrders,
  onDragStart,
  onDragEnd,
  onDragOver,
  onTableClick,
  onCloseSidebar,
  onDownloadQR,
  onDeleteTable,
  onUpdateTableStatus
}: TablesManagerContentProps) {
  const getTableOrders = (tableId: string) => {
    return orders.filter(order => order.tableId === tableId);
  };

  const getTableTotal = (tableId: string) => {
    return orders
      .filter(order => order.tableId === tableId)
      .reduce((sum, order) => sum + order.total + order.tip, 0);
  };

  const getTablesByArea = (area: string) => {
    return tables.filter(table => table.area === area);
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetection={closestCenter}
    >
      <div className="space-y-6">
        {areas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Areas Created</h3>
            <p className="text-gray-500 mb-4">
              Start by creating your first dining area, then add tables to organize your restaurant.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {areas.map((area) => (
              <AreaDropZone
                key={area}
                area={area}
                tables={getTablesByArea(area)}
                onTableClick={onTableClick}
                onDownloadQR={onDownloadQR}
                onDeleteTable={onDeleteTable}
                getTableOrders={getTableOrders}
                getTableTotal={getTableTotal}
              />
            ))}
          </div>
        )}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {tables.find(table => table.id === activeId)?.number || 'Table'}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Table Orders Sidebar */}
      {selectedTable && (
        <TableOrdersSidebar
          selectedTable={selectedTable}
          selectedTableOrders={selectedTableOrders}
          onClose={onCloseSidebar}
        />
      )}
    </DndContext>
  );
}
