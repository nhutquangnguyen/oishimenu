'use client';

import { useState, useCallback, useEffect } from 'react';
import { TablesManagerHeader } from './TablesManagerHeader';
import { TablesManagerContent } from './TablesManagerContent';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getOrdersByUser } from '@/lib/firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Table, Order } from './types';
import { getMenuUrl, getQRCodeUrl } from '@/lib/env';

export function TablesManager() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(2);
  const [newTableArea, setNewTableArea] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedTableOrders, setSelectedTableOrders] = useState<Order[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Save tables and areas to Firestore
  const saveTablesToFirestore = async () => {
    if (!user?.uid || !currentRestaurant?.id) return;
    
    try {
      console.log('Current areas:', areas);
      console.log('Current tables:', tables);
      
      const tablesData = {
        areas: areas.map(area => ({
          name: area,
          tables: tables.filter(table => table.area === area).map(table => ({
            id: table.id || '',
            name: table.number || '',
            capacity: table.capacity || 4,
            status: table.status || 'available'
          }))
        })),
        lastUpdated: new Date()
      };
      
      console.log('Saving to Firestore:', tablesData);
      await setDoc(doc(db, 'tables', currentRestaurant.id), tablesData);
      console.log('Tables saved to Firestore successfully');
    } catch (error) {
      console.error('Error saving tables:', error);
    }
  };

  // Load tables and areas from Firestore
  useEffect(() => {
    const loadTablesFromFirestore = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;
      
      try {
        const docRef = doc(db, 'tables', currentRestaurant.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Loaded data from Firestore:', data);
          if (data.areas) {
            const areaNames = data.areas.map((area: any) => area.name);
            console.log('Setting areas:', areaNames);
            setAreas(areaNames);
            // Convert Firestore data back to Table format
            const loadedTables: Table[] = [];
            data.areas.forEach((area: any) => {
              area.tables.forEach((table: any) => {
                loadedTables.push({
                  id: table.id,
                  number: table.name,
                  capacity: table.capacity,
                  status: table.status,
                  qrCode: getQRCodeUrl(getMenuUrl(currentRestaurant.id, table.name), 200),
                  area: area.name,
                  lastUsed: new Date()
                });
              });
            });
            console.log('Setting tables:', loadedTables);
            setTables(loadedTables);
          }
        } else {
          console.log('No tables document found in Firestore');
        }
      } catch (error) {
        console.error('Error loading tables:', error);
      }
    };

    loadTablesFromFirestore();
  }, [user?.uid, currentRestaurant?.id]);

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.uid) return;
      
      try {
        const userOrders = await getOrdersByUser(user.uid);
        // Filter out orders with undefined IDs and convert to Order type
        const validOrders = userOrders.filter(order => order.id).map(order => ({
          id: order.id!,
          tableId: order.tableId,
          restaurantId: order.restaurantId || '',
          customerName: order.customerName || undefined,
          items: order.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            specialInstructions: item.specialInstructions || undefined,
            category: item.category
          })),
          total: order.total,
          tip: order.tip || 0,
          status: order.status,
          createdAt: order.createdAt.toDate(),
          updatedAt: order.updatedAt.toDate(),
          paymentMethod: order.paymentMethod || 'cash',
          isPaid: order.isPaid || false,
          notes: order.notes,
          userId: order.userId
        }));
        setOrders(validOrders as Order[]);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, [user?.uid]);

  // Auto-save when tables or areas change
  useEffect(() => {
    if (tables.length > 0 || areas.length > 0) {
      const timeoutId = setTimeout(() => {
        saveTablesToFirestore();
      }, 1000); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [tables, areas]);

  const addArea = () => {
    if (newAreaName.trim() && !areas.includes(newAreaName.trim())) {
      setAreas([...areas, newAreaName.trim()]);
      setNewAreaName('');
      setIsAddingArea(false);
    }
  };

  const addTable = () => {
    if (newTableNumber.trim() && newTableArea && !tables.find(table => table.number === newTableNumber.trim())) {
      const newTable: Table = {
        id: Date.now().toString(),
        number: newTableNumber.trim(),
        capacity: newTableCapacity,
        status: 'available',
        qrCode: getQRCodeUrl(getMenuUrl(currentRestaurant?.id || '', newTableNumber.trim()), 200),
        area: newTableArea,
        lastUsed: new Date()
      };
      setTables([...tables, newTable]);
      setNewTableNumber('');
      setNewTableCapacity(2);
      setNewTableArea('');
      setIsAddingTable(false);
    }
  };

  const deleteTable = (tableId: string) => {
    setTables(tables.filter(table => table.id !== tableId));
  };

  const updateTableStatus = (tableId: string, status: string) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status: status as 'available' | 'occupied' | 'reserved' | 'cleaning' } : table
    ));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    
    console.log('Drag End - Active ID:', activeId, 'Over ID:', overId);
    console.log('Available areas:', areas);
    console.log('Available tables:', tables.map(t => ({ id: t.id, number: t.number, area: t.area })));

    // Handle table reordering within areas
    if (activeId && overId && !overId.startsWith('area-')) {
      const activeTable = tables.find(table => table.id === activeId);
      const overTable = tables.find(table => table.id === overId);
      
      if (activeTable && overTable) {
        if (activeTable.area === overTable.area) {
          // Reorder within same area
          const areaTables = tables.filter(table => table.area === activeTable.area);
          const activeIndex = areaTables.findIndex(table => table.id === activeTable.id);
          const overIndex = areaTables.findIndex(table => table.id === overTable.id);
          
          const newAreaTables = arrayMove(areaTables, activeIndex, overIndex);
          const newTables = tables.map(table => {
            if (table.area === activeTable.area) {
              const newIndex = newAreaTables.findIndex(t => t.id === table.id);
              return newAreaTables[newIndex];
            }
            return table;
          });
          
          setTables(newTables);
          // Save changes to Firestore
          setTimeout(() => {
            saveTablesToFirestore();
          }, 100);
        } else {
          // Move table to different area
          const newTables = tables.map(table => {
            if (table.id === activeTable.id) {
              return { ...table, area: overTable.area };
            }
            return table;
          });
          setTables(newTables);
          // Save changes to Firestore
          setTimeout(() => {
            saveTablesToFirestore();
          }, 100);
        }
      }
    }

    // Handle dropping on area drop zone
    if (activeId && overId.startsWith('area-')) {
      const activeTable = tables.find(table => table.id === activeId);
      const targetArea = overId.replace('area-', '');
      
      console.log('Dropping table on area:', activeTable?.number, 'to area:', targetArea);
      
      if (activeTable && targetArea) {
        const newTables = tables.map(table => {
          if (table.id === activeTable.id) {
            return { ...table, area: targetArea };
          }
          return table;
        });
        setTables(newTables);
        console.log('Table moved successfully');
        
        // Save changes to Firestore
        setTimeout(() => {
          saveTablesToFirestore();
        }, 100);
      }
    }

    setActiveId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    const tableOrders = orders.filter(order => order.tableId === table.id);
    setSelectedTableOrders(tableOrders);
  };

  const handleCloseSidebar = () => {
    setSelectedTable(null);
    setSelectedTableOrders([]);
  };

  const handleDownloadQR = (table: Table) => {
    const link = document.createElement('a');
    link.href = table.qrCode;
    link.download = `table-${table.number}-qr-code.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <TablesManagerHeader
        areas={areas}
        isAddingArea={isAddingArea}
        setIsAddingArea={setIsAddingArea}
        isAddingTable={isAddingTable}
        setIsAddingTable={setIsAddingTable}
        newAreaName={newAreaName}
        setNewAreaName={setNewAreaName}
        newTableNumber={newTableNumber}
        setNewTableNumber={setNewTableNumber}
        newTableCapacity={newTableCapacity}
        setNewTableCapacity={setNewTableCapacity}
        newTableArea={newTableArea}
        setNewTableArea={setNewTableArea}
        onAddArea={addArea}
        onAddTable={addTable}
      />

      <TablesManagerContent
        areas={areas}
        tables={tables}
        orders={orders}
        activeId={activeId}
        selectedTable={selectedTable}
        selectedTableOrders={selectedTableOrders}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onTableClick={handleTableClick}
        onCloseSidebar={handleCloseSidebar}
        onDownloadQR={handleDownloadQR}
        onDeleteTable={deleteTable}
        onUpdateTableStatus={updateTableStatus}
      />
    </div>
  );
}
