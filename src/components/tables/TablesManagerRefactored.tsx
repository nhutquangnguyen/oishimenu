'use client';

import { useState, useCallback, useEffect } from 'react';
import { TablesManagerContentRefactored } from './TablesManagerContentRefactored';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getOrdersByUser } from '@/lib/firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Table, Order } from './types';
import { getMenuUrl, getQRCodeUrl } from '@/lib/env';

export function TablesManagerRefactored() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedTableOrders, setSelectedTableOrders] = useState<Order[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);


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
        const validOrders = userOrders.filter(order => order.id).map(order => {
          let tableId = order.tableId;

          // For backward compatibility: if no tableId but we have tableNumber,
          // try to find the table with matching number and use its ID
          if (!tableId && order.tableNumber && order.tableNumber !== 'walk-in') {
            const matchingTable = tables.find(table => table.number === order.tableNumber);
            tableId = matchingTable?.id || '';
          }

          return {
            id: order.id!,
            tableId: tableId || '',
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
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
          };
        });
        setOrders(validOrders);
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


  // Wrapper function for adding area from content component
  const handleAddArea = () => {
    // The content component manages its own newAreaName state and calls onAreasChange directly
    // This function serves as a callback but the actual logic is handled in the content component
    return;
  };

  // Wrapper function for adding table to specific area from content component
  const handleAddTable = (areaName: string, tableName?: string) => {
    let tableNumber: string;

    if (tableName && tableName.trim()) {
      // Use the custom table name provided by user
      tableNumber = tableName.trim();
    } else {
      // Generate next table number for this area (fallback for backward compatibility)
      const areaTableNumbers = tables
        .filter(table => table.area === areaName)
        .map(table => parseInt(table.number))
        .filter(num => !isNaN(num))
        .sort((a, b) => a - b);

      let nextTableNumber = 1;
      for (let i = 0; i < areaTableNumbers.length; i++) {
        if (areaTableNumbers[i] !== nextTableNumber) {
          break;
        }
        nextTableNumber++;
      }
      tableNumber = nextTableNumber.toString();
    }

    const newTable: Table = {
      id: Date.now().toString(),
      number: tableNumber,
      capacity: 4, // Default capacity
      status: 'available',
      qrCode: getQRCodeUrl(getMenuUrl(currentRestaurant?.id || '', tableNumber), 200),
      area: areaName,
      lastUsed: new Date()
    };
    setTables([...tables, newTable]);
  };

  const deleteTable = (tableId: string) => {
    setTables(tables.filter(table => table.id !== tableId));
  };

  const updateTableStatus = (tableId: string, status: string) => {
    setTables(tables.map(table =>
      table.id === tableId ? { ...table, status: status as 'available' | 'occupied' | 'reserved' | 'cleaning' } : table
    ));
  };

  const updateTableCapacity = (tableId: string, capacity: number) => {
    setTables(tables.map(table =>
      table.id === tableId ? { ...table, capacity } : table
    ));
  };

  const handleDragStart = (activeId: string) => {
    setActiveId(activeId);
  };

  const handleDragEnd = () => {
    setActiveId(null);
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
      <TablesManagerContentRefactored
        areas={areas}
        tables={tables}
        orders={orders}
        activeId={activeId}
        selectedTable={selectedTable}
        selectedTableOrders={selectedTableOrders}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTableClick={handleTableClick}
        onCloseSidebar={handleCloseSidebar}
        onDownloadQR={handleDownloadQR}
        onDeleteTable={deleteTable}
        onUpdateTableStatus={updateTableStatus}
        onUpdateTableCapacity={updateTableCapacity}
        onTablesChange={setTables}
        onAreasChange={setAreas}
        onAddArea={handleAddArea}
        onAddTable={handleAddTable}
      />
    </div>
  );
}
