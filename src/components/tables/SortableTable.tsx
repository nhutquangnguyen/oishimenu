'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Edit, 
  Trash2, 
  ChefHat,
  GripVertical,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  QrCode
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table, Order } from './types';
import { statusConfig } from './constants';

interface SortableTableProps {
  table: Table;
  onTableClick: (table: Table) => void;
  onDeleteTable: (tableId: string) => void;
  onDownloadQR: (table: Table) => void;
  getTableOrders: (tableId: string) => Order[];
  getTableTotal: (tableId: string) => number;
}

export function SortableTable({ 
  table, 
  onTableClick, 
  onDeleteTable, 
  onDownloadQR,
  getTableOrders,
  getTableTotal 
}: SortableTableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: table.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const tableOrders = getTableOrders(table.id);
  const tableTotal = getTableTotal(table.id);
  const activeOrders = tableOrders.filter(order => 
    order.status !== 'delivered' && order.status !== 'cancelled'
  );
  const completedOrders = tableOrders.filter(order => 
    order.status === 'delivered'
  );

  const StatusIcon = statusConfig[table.status].icon;

  // Calculate additional metrics
  const totalRevenue = tableOrders.reduce((sum, order) => sum + order.total + order.tip, 0);
  const averageOrderValue = tableOrders.length > 0 ? totalRevenue / tableOrders.length : 0;
  const lastUsedTime = table.lastUsed ? new Date(table.lastUsed) : null;
  const timeSinceLastUsed = lastUsedTime ? Math.floor((Date.now() - lastUsedTime.getTime()) / (1000 * 60)) : null;

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`w-full hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 ${
        table.status === 'available' ? 'border-l-green-500' :
        table.status === 'occupied' ? 'border-l-red-500' :
        table.status === 'reserved' ? 'border-l-yellow-500' :
        'border-l-blue-500'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onTableClick(table)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Table info and drag handle */}
          <div className="flex items-center space-x-3 flex-1">
            {/* Drag handle */}
            <div 
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            
            {/* Table number and basic info */}
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Table {table.number}</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{table.capacity} seats</span>
                  </div>
                  <Badge className={`${statusConfig[table.status].color} font-medium`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig[table.status].label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Compact metrics */}
            <div className="flex items-center space-x-4 ml-4">
              {/* Active Orders */}
              {activeOrders.length > 0 && (
                <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
                  <ChefHat className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">{activeOrders.length}</span>
                  <span className="text-sm text-blue-600">${tableTotal.toFixed(2)}</span>
                </div>
              )}

              {/* Total Orders */}
              <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">{tableOrders.length}</span>
              </div>

              {/* Revenue */}
              {totalRevenue > 0 && (
                <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">${totalRevenue.toFixed(2)}</span>
                </div>
              )}

              {/* Last Used */}
              {timeSinceLastUsed !== null && (
                <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    {timeSinceLastUsed < 60 ? `${timeSinceLastUsed}m` : 
                     timeSinceLastUsed < 1440 ? `${Math.floor(timeSinceLastUsed / 60)}h` : 
                     `${Math.floor(timeSinceLastUsed / 1440)}d`} ago
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - QR Code and Actions */}
          <div className="flex items-center space-x-3">
            {/* QR Code */}
            <div className="text-center">
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <img 
                  src={table.qrCode} 
                  alt={`QR Code for Table ${table.number}`}
                  className="w-12 h-12"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadQR(table);
                }}
                className="text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                QR
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement edit functionality
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTable(table.id);
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
