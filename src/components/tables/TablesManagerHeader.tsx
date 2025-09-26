'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus } from 'lucide-react';

interface TablesManagerHeaderProps {
  areas: string[];
  isAddingArea: boolean;
  setIsAddingArea: (adding: boolean) => void;
  isAddingTable: boolean;
  setIsAddingTable: (adding: boolean) => void;
  newAreaName: string;
  setNewAreaName: (name: string) => void;
  newTableNumber: string;
  setNewTableNumber: (number: string) => void;
  newTableCapacity: number;
  setNewTableCapacity: (capacity: number) => void;
  newTableArea: string;
  setNewTableArea: (area: string) => void;
  onAddArea: () => void;
  onAddTable: () => void;
}

export function TablesManagerHeader({
  areas,
  isAddingArea,
  setIsAddingArea,
  isAddingTable,
  setIsAddingTable,
  newAreaName,
  setNewAreaName,
  newTableNumber,
  setNewTableNumber,
  newTableCapacity,
  setNewTableCapacity,
  newTableArea,
  setNewTableArea,
  onAddArea,
  onAddTable
}: TablesManagerHeaderProps) {
  return (
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
                <Button onClick={onAddArea}>Add Area</Button>
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
                <select
                  id="area"
                  value={newTableArea}
                  onChange={(e) => setNewTableArea(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select an area</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingTable(false)}>
                  Cancel
                </Button>
                <Button onClick={onAddTable}>Add Table</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
