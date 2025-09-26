'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  QrCode, 
  Download, 
  MapPin
} from 'lucide-react';
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
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Table, Order } from './types';
import { getMenuUrl, getQRCodeUrl } from '@/lib/env';
import { AreaDropZone } from './AreaDropZone';
import { TableOrdersSidebar } from './TableOrdersSidebar';

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
          customerName: order.customerName || undefined,
          items: order.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            specialInstructions: item.specialInstructions || undefined,
            category: item.category
          })),
          status: order.status,
          total: order.total,
          tip: order.tip,
          createdAt: order.createdAt.toDate(),
          updatedAt: order.updatedAt.toDate(),
          notes: order.notes || undefined,
          paymentMethod: order.paymentMethod,
          isPaid: order.isPaid
        }));
        setOrders(validOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, [user?.uid]);


  // Auto-save when tables or areas change
  useEffect(() => {
    if (user?.uid && currentRestaurant?.id && (tables.length > 0 || areas.length > 0)) {
      const timeoutId = setTimeout(() => {
        saveTablesToFirestore();
      }, 1000); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [tables, areas, user?.uid, currentRestaurant?.id]);

  // Set default area when areas change
  useEffect(() => {
    if (areas.length > 0 && !newTableArea) {
      setNewTableArea(areas[0]);
      console.log('Set default area to:', areas[0]);
    }
  }, [areas, newTableArea]);

  // Set default area when dialog opens
  useEffect(() => {
    if (isAddingTable && areas.length > 0) {
      setNewTableArea(areas[0]);
      console.log('Dialog opened, set default area to:', areas[0]);
    }
  }, [isAddingTable, areas]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setTables((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
  };

  const addTable = () => {
    console.log('Add Table clicked!');
    console.log('newTableNumber:', newTableNumber);
    console.log('newTableArea:', newTableArea);
    console.log('areas:', areas);
    
    if (!newTableNumber.trim() || !newTableArea) {
      console.log('Validation failed - missing required fields');
      return;
    }
    
    console.log('Creating new table...');
    const newTable: Table = {
      id: Date.now().toString(),
      number: newTableNumber,
      capacity: newTableCapacity,
      status: 'available',
      qrCode: getQRCodeUrl(getMenuUrl(currentRestaurant?.id, newTableNumber), 200),
      area: newTableArea,
      lastUsed: new Date()
    };
    
    console.log('New table created:', newTable);
    setTables(prev => {
      const updatedTables = [...prev, newTable];
      console.log('Updated tables:', updatedTables);
      return updatedTables;
    });
    setNewTableNumber('');
    setNewTableCapacity(2);
    setNewTableArea(areas.length > 0 ? areas[0] : '');
    setIsAddingTable(false);
    console.log('Table added successfully!');
  };

  const addArea = () => {
    if (!newAreaName.trim()) return;
    
    console.log('Adding area:', newAreaName);
    setAreas(prev => {
      const newAreas = [...prev, newAreaName];
      console.log('Updated areas:', newAreas);
      return newAreas;
    });
    setNewAreaName('');
    setIsAddingArea(false);
    
    // Save immediately to Firestore
    setTimeout(() => {
      console.log('Saving areas to Firestore...');
      saveTablesToFirestore();
    }, 100);
  };

  const deleteTable = (tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    const tableOrders = orders.filter(order => order.tableId === table.id);
    setSelectedTableOrders(tableOrders);
  };

  const closeSidebar = () => {
    setSelectedTable(null);
    setSelectedTableOrders([]);
  };

  const downloadQR = (table: Table) => {
    const link = document.createElement('a');
    link.href = table.qrCode;
    link.download = `table-${table.number}-qr.png`;
    link.click();
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-600">Manage your restaurant tables and seating areas</p>
          {areas.length === 0 && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Getting Started:</strong> First, add a dining area (e.g., "Main Dining", "Patio"), then you can add tables to that area.
              </p>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Dialog open={isAddingArea} onOpenChange={setIsAddingArea}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Add Area
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Area</DialogTitle>
                <DialogDescription>
                  Create a new seating area for your restaurant
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="areaName">Area Name</Label>
                  <Input
                    id="areaName"
                    value={newAreaName}
                    onChange={(e) => setNewAreaName(e.target.value)}
                    placeholder="e.g., Patio, Bar, Private Dining"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingArea(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addArea}>Add Area</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddingTable} onOpenChange={setIsAddingTable}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
                <DialogDescription>
                  Add a new table to your restaurant
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tableNumber">Table Number</Label>
                  <Input
                    id="tableNumber"
                    value={newTableNumber}
                    onChange={(e) => setNewTableNumber(e.target.value)}
                    placeholder="e.g., 1, 2, A1, B2"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="20"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(parseInt(e.target.value) || 2)}
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  {areas.length === 0 ? (
                    <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-center">
                      No areas available. Please add an area first.
                    </div>
                  ) : (
                    <select
                      id="area"
                      value={newTableArea}
                      onChange={(e) => setNewTableArea(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {areas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingTable(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={addTable}
                    disabled={areas.length === 0}
                    title={areas.length === 0 ? "Please add an area first" : ""}
                  >
                    {areas.length === 0 ? "Add Area First" : "Add Table"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Areas and Tables */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="space-y-8">
          {areas.map(area => (
            <AreaDropZone
              key={area}
              area={area}
              tables={getTablesByArea(area)}
              onTableClick={handleTableClick}
              onDeleteTable={deleteTable}
              onDownloadQR={downloadQR}
              getTableOrders={getTableOrders}
              getTableTotal={getTableTotal}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeId ? (
            <div className="opacity-50">
              {/* Render dragged table preview */}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Table Orders Sidebar */}
      {selectedTable && (
        <TableOrdersSidebar
          selectedTable={selectedTable}
          selectedTableOrders={selectedTableOrders}
          onClose={closeSidebar}
        />
      )}
    </div>
  );
}