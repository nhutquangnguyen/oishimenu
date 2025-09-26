'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Table, Order } from './types';
import { SortableTable } from './SortableTable';

interface AreaDropZoneProps {
  area: string;
  tables: Table[];
  onTableClick: (table: Table) => void;
  onDeleteTable: (tableId: string) => void;
  onDownloadQR: (table: Table) => void;
  getTableOrders: (tableId: string) => Order[];
  getTableTotal: (tableId: string) => number;
}

export function AreaDropZone({ 
  area, 
  tables, 
  onTableClick, 
  onDeleteTable, 
  onDownloadQR,
  getTableOrders,
  getTableTotal 
}: AreaDropZoneProps) {
  const areaOrders = tables.reduce((sum, table) => sum + getTableOrders(table.id).length, 0);
  const areaRevenue = tables.reduce((sum, table) => sum + getTableTotal(table.id), 0);

  const { setNodeRef, isOver } = useDroppable({
    id: `area-${area}`,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{area}</h3>
          <p className="text-sm text-gray-600">
            {tables.length} tables • {areaOrders} orders • ${areaRevenue.toFixed(2)} revenue
          </p>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`min-h-[100px] rounded-lg border-2 border-dashed transition-colors ${
          isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
        }`}
      >
        <SortableContext items={tables.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 p-4">
            {tables.map((table) => (
              <SortableTable
                key={table.id}
                table={table}
                onTableClick={onTableClick}
                onDeleteTable={onDeleteTable}
                onDownloadQR={onDownloadQR}
                getTableOrders={getTableOrders}
                getTableTotal={getTableTotal}
              />
            ))}
            {tables.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Drop tables here to move them to {area}</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
