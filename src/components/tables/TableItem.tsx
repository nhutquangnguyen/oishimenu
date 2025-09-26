'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  QrCode,
  Trash2,
  Clock,
  DollarSign,
  AlertCircle,
  Edit,
  Check,
  X
} from 'lucide-react';
import { DragDropItem } from '@/components/shared';
import { Table, Order } from './types';
// Simple time display without external dependency

interface TableItemProps {
  table: Table;
  orders: Order[];
  total: number;
  onTableClick: (table: Table) => void;
  onDownloadQR: (table: Table) => void;
  onDeleteTable: (tableId: string) => void;
  onUpdateCapacity: (tableId: string, capacity: number) => void;
  onUpdateStatus: (tableId: string, status: string) => void;
}

export function TableItem({
  table,
  orders,
  total,
  onTableClick,
  onDownloadQR,
  onDeleteTable,
  onUpdateCapacity,
  onUpdateStatus
}: TableItemProps) {
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [editCapacity, setEditCapacity] = useState(table.capacity.toString());
  const [editStatus, setEditStatus] = useState(table.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cleaning':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'occupied':
        return <AlertCircle className="w-3 h-3" />;
      case 'cleaning':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleSaveCapacity = () => {
    const newCapacity = parseInt(editCapacity);
    if (!isNaN(newCapacity) && newCapacity > 0) {
      onUpdateCapacity(table.id, newCapacity);
      setIsEditingCapacity(false);
    }
  };

  const handleCancelCapacity = () => {
    setEditCapacity(table.capacity.toString());
    setIsEditingCapacity(false);
  };

  const handleSaveStatus = () => {
    onUpdateStatus(table.id, editStatus);
    setIsEditingStatus(false);
  };

  const handleCancelStatus = () => {
    setEditStatus(table.status);
    setIsEditingStatus(false);
  };

  return (
    <DragDropItem id={table.id} itemPrefix="table-">
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() => onTableClick(table)}
      >
        <CardContent className="p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-gray-800">
                {table.number}
              </div>
              {isEditingStatus ? (
                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="w-24 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveStatus}
                    className="h-5 w-5 p-0"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelStatus}
                    className="h-5 w-5 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Badge
                  variant="outline"
                  className={`text-xs py-0 px-1 ${getStatusColor(table.status)} flex items-center space-x-1 cursor-pointer hover:opacity-75`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingStatus(true);
                  }}
                >
                  {getStatusIcon(table.status)}
                  <span className="capitalize">{table.status}</span>
                  <Edit className="w-2 h-2 ml-1 opacity-50" />
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadQR(table);
                }}
                className="h-6 w-6 p-0"
              >
                <QrCode className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTable(table.id);
                }}
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              {isEditingCapacity ? (
                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                  <Users className="w-3 h-3" />
                  <Input
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    className="w-12 h-5 text-xs p-1"
                    type="number"
                    min="1"
                    max="20"
                  />
                  <span>seats</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveCapacity}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <Check className="h-2 w-2" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelCapacity}
                    className="h-4 w-4 p-0"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex items-center space-x-1 cursor-pointer hover:opacity-75"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingCapacity(true);
                  }}
                >
                  <Users className="w-3 h-3" />
                  <span>{table.capacity} seats</span>
                  <Edit className="w-2 h-2 ml-1 opacity-50" />
                </div>
              )}

              {orders.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {total > 0 && (
              <div className="flex items-center space-x-1 text-green-600">
                <DollarSign className="w-3 h-3" />
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
            )}

            <div className="text-xs text-gray-400">
              Last used: {table.lastUsed.toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </DragDropItem>
  );
}