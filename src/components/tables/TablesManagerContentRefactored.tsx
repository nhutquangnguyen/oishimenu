'use client';

import React, { useState } from 'react';
import { DragDropManager, DragDropContainer } from '@/components/shared';
import { TableOrdersSidebar } from './TableOrdersSidebar';
import { TableItem } from './TableItem';
import { Table, Order } from './types';
import { arrayMove } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, ChevronDown, ChevronUp, Edit, Check, X } from 'lucide-react';

interface TablesManagerContentRefactoredProps {
  areas: string[];
  tables: Table[];
  orders: Order[];
  activeId: string | null;
  selectedTable: Table | null;
  selectedTableOrders: Order[];
  onDragStart: (activeId: string) => void;
  onDragEnd: () => void;
  onTableClick: (table: Table) => void;
  onCloseSidebar: () => void;
  onDownloadQR: (table: Table) => void;
  onDeleteTable: (tableId: string) => void;
  onUpdateTableStatus: (tableId: string, status: string) => void;
  onUpdateTableCapacity: (tableId: string, capacity: number) => void;
  onTablesChange: (tables: Table[]) => void;
  onAreasChange: (areas: string[]) => void;
  onAddArea?: () => void;
  onAddTable?: (areaName: string, tableName?: string) => void;
}

export function TablesManagerContentRefactored({
  areas,
  tables,
  orders,
  activeId,
  selectedTable,
  selectedTableOrders,
  onDragStart,
  onDragEnd,
  onTableClick,
  onCloseSidebar,
  onDownloadQR,
  onDeleteTable,
  onUpdateTableStatus,
  onUpdateTableCapacity,
  onTablesChange,
  onAreasChange,
  onAddArea,
  onAddTable
}: TablesManagerContentRefactoredProps) {
  const [collapsedAreas, setCollapsedAreas] = useState<Set<string>>(new Set());
  const [preDragCollapsedState, setPreDragCollapsedState] = useState<Set<string> | null>(null);
  const [isDraggingContainer, setIsDraggingContainer] = useState(false);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [isAddingTable, setIsAddingTable] = useState<string | null>(null); // Track which area is adding a table
  const [newTableName, setNewTableName] = useState('');

  // Area status management
  const [areaStatuses, setAreaStatuses] = useState<Record<string, 'active' | 'closed' | 'maintenance'>>(() => {
    const statuses: Record<string, 'active' | 'closed' | 'maintenance'> = {};
    areas.forEach(area => {
      statuses[area] = 'active'; // Default status
    });
    return statuses;
  });
  const [isEditingAreaStatus, setIsEditingAreaStatus] = useState<string | null>(null);
  const [editAreaStatus, setEditAreaStatus] = useState<'active' | 'closed' | 'maintenance'>('active');

  const toggleAreaCollapse = (areaName: string) => {
    setCollapsedAreas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(areaName)) {
        newSet.delete(areaName);
      } else {
        newSet.add(areaName);
      }
      return newSet;
    });
  };

  const toggleCollapseAll = () => {
    if (collapsedAreas.size === areas.length) {
      // If all are collapsed, expand all
      setCollapsedAreas(new Set());
    } else {
      // Otherwise, collapse all
      setCollapsedAreas(new Set(areas));
    }
  };

  const handleDragStart = (activeId: string) => {
    onDragStart(activeId);

    // Check if dragging a container/area
    if (activeId.startsWith('area-')) {
      setIsDraggingContainer(true);
      // Save current collapse state
      setPreDragCollapsedState(new Set(collapsedAreas));
      // Collapse all areas
      setCollapsedAreas(new Set(areas));
    }
  };

  const handleDragEnd = () => {
    onDragEnd();

    // If we were dragging a container, restore the previous collapse state
    if (isDraggingContainer && preDragCollapsedState !== null) {
      setCollapsedAreas(preDragCollapsedState);
      setPreDragCollapsedState(null);
      setIsDraggingContainer(false);
    }
  };

  const getTableOrders = (tableId: string) => {
    return orders.filter(order => order.tableId === tableId);
  };

  const getTablesByArea = (area: string) => {
    return tables.filter(table => table.area === area);
  };

  const containers = areas.map(area => ({
    id: area,
    name: area,
    items: getTablesByArea(area)
  }));

  const handleItemMove = (itemId: string, fromContainerId: string, toContainerId: string) => {
    const updatedTables = tables.map(table =>
      table.id === itemId ? { ...table, area: toContainerId } : table
    );
    onTablesChange(updatedTables);
  };

  const handleItemReorder = (containerId: string, fromIndex: number, toIndex: number) => {
    const containerTables = getTablesByArea(containerId);
    const reorderedTables = arrayMove(containerTables, fromIndex, toIndex);

    const updatedTables = tables.map(table => {
      if (table.area === containerId) {
        const newIndex = reorderedTables.findIndex(t => t.id === table.id);
        return newIndex !== -1 ? reorderedTables[newIndex] : table;
      }
      return table;
    });

    onTablesChange(updatedTables);
  };

  const handleContainerReorder = (fromIndex: number, toIndex: number) => {
    const reorderedAreas = arrayMove(areas, fromIndex, toIndex);
    onAreasChange(reorderedAreas);
  };

  const renderDragOverlay = (activeId: string) => {
    if (activeId.startsWith('table-')) {
      const table = tables.find(t => t.id === activeId.replace('table-', ''));
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Table {table?.number}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Update area statuses when areas change
  React.useEffect(() => {
    setAreaStatuses(prev => {
      const newStatuses: Record<string, 'active' | 'closed' | 'maintenance'> = {};
      areas.forEach(area => {
        // Keep existing status or default to 'active'
        newStatuses[area] = prev[area] || 'active';
      });
      return newStatuses;
    });
  }, [areas]);

  const getAreaStatusColor = (status: 'active' | 'closed' | 'maintenance') => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAreaStatusSave = (areaName: string) => {
    setAreaStatuses(prev => ({
      ...prev,
      [areaName]: editAreaStatus
    }));
    setIsEditingAreaStatus(null);
  };

  const handleAreaStatusCancel = () => {
    setIsEditingAreaStatus(null);
    setEditAreaStatus('active');
  };

  const handleAddArea = () => {
    if (newAreaName.trim() && onAddArea) {
      onAreasChange([...areas, newAreaName.trim()]);
      setNewAreaName('');
      setIsAddingArea(false);
    }
  };

  const handleAddTable = (areaName: string) => {
    if (newTableName.trim() && onAddTable) {
      // Check if table name already exists in the area
      const areaTableNames = tables
        .filter(table => table.area === areaName)
        .map(table => table.number.toLowerCase());

      if (areaTableNames.includes(newTableName.trim().toLowerCase())) {
        alert(`A table named "${newTableName.trim()}" already exists in ${areaName}. Please choose a different name.`);
        return;
      }

      // Call the parent's onAddTable function with the area and custom table name
      onAddTable(areaName, newTableName.trim());
      setNewTableName('');
      setIsAddingTable(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Area Section */}
      <div className="flex items-center space-x-3 mb-6">
        {isAddingArea ? (
          <>
            <Input
              placeholder="Area name (e.g., Main Dining, Patio, Bar)"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              className="flex-1"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddArea();
                }
              }}
            />
            <Button onClick={handleAddArea} disabled={!newAreaName.trim()}>
              Add
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingArea(false);
                setNewAreaName('');
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsAddingArea(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Area
          </Button>
        )}
      </div>

      {/* Areas List */}
      {areas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-gray-400 mb-4">🍽️</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No areas yet</h3>
          <p className="text-gray-500 text-center">
            Start by adding your first dining area to organize your restaurant tables
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
              {collapsedAreas.size === areas.length ? (
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
        itemPrefix="table-"
        containerPrefix="area-"
      >
        <div className="space-y-6">
          {containers.map((container) => {
            const areaOrders = container.items.reduce(
              (sum, table) => sum + getTableOrders(table.id).length,
              0
            );

            return (
              <DragDropContainer
                key={container.id}
                id={container.id}
                title={container.name}
                items={container.items}
                itemPrefix="table-"
                containerPrefix="area-"
                className="border-gray-200"
                headerClassName="bg-gray-50"
                isCollapsed={collapsedAreas.has(container.id)}
                onToggleCollapse={() => toggleAreaCollapse(container.id)}
                headerActions={
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-600">
                      {container.items.length} tables • {areaOrders} orders
                    </div>

                    {/* Area Status Badge */}
                    {isEditingAreaStatus === container.id ? (
                      <div className="flex items-center space-x-1">
                        <Select value={editAreaStatus} onValueChange={setEditAreaStatus}>
                          <SelectTrigger className="w-24 h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAreaStatusSave(container.id)}
                          className="h-5 w-5 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleAreaStatusCancel}
                          className="h-5 w-5 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className={`text-xs py-0 px-2 ${getAreaStatusColor(areaStatuses[container.id] || 'active')} cursor-pointer hover:opacity-75`}
                        onClick={() => {
                          setIsEditingAreaStatus(container.id);
                          setEditAreaStatus(areaStatuses[container.id] || 'active');
                        }}
                      >
                        <span className="capitalize">{areaStatuses[container.id] || 'active'}</span>
                        <Edit className="w-2 h-2 ml-1 opacity-50" />
                      </Badge>
                    )}

                    {onAddTable && (
                      isAddingTable === container.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Table name"
                            value={newTableName}
                            onChange={(e) => setNewTableName(e.target.value)}
                            className="w-32 h-8"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddTable(container.id);
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTable(container.id)}
                            disabled={!newTableName.trim()}
                          >
                            Add
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsAddingTable(null);
                              setNewTableName('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddingTable(container.id)}
                          className="text-green-600 hover:bg-green-50 border-green-200"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Table
                        </Button>
                      )
                    )}
                  </div>
                }
                emptyState={
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-gray-300 mb-2">🍽️</div>
                    <p className="text-sm mb-4">No tables in this area yet</p>
                    {onAddTable && (
                      isAddingTable === container.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Table name"
                            value={newTableName}
                            onChange={(e) => setNewTableName(e.target.value)}
                            className="w-40"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddTable(container.id);
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTable(container.id)}
                            disabled={!newTableName.trim()}
                          >
                            Add
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsAddingTable(null);
                              setNewTableName('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddingTable(container.id)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add First Table
                        </Button>
                      )
                    )}
                    <p className="text-xs mt-4 text-gray-400">Or drop tables here to move them to {container.name}</p>
                  </div>
                }
              >
                {container.items.map((table) => (
                  <TableItem
                    key={table.id}
                    table={table}
                    orders={getTableOrders(table.id)}
                    total={0}
                    onTableClick={onTableClick}
                    onDownloadQR={onDownloadQR}
                    onDeleteTable={onDeleteTable}
                    onUpdateCapacity={onUpdateTableCapacity}
                    onUpdateStatus={onUpdateTableStatus}
                  />
                ))}
              </DragDropContainer>
            );
          })}
        </div>
      </DragDropManager>
          </>
        )}

      {/* Table Orders Sidebar */}
      {selectedTable && (
        <TableOrdersSidebar
          selectedTable={selectedTable}
          selectedTableOrders={selectedTableOrders}
          onClose={onCloseSidebar}
        />
      )}
    </div>
  );
}