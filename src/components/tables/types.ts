export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  qrCode: string;
  currentOrder?: string;
  lastUsed?: Date;
  area: string;
  restaurantId?: string; // Link to parent restaurant
}

export interface Order {
  id: string;
  tableId: string;
  restaurantId: string; // Required - which restaurant this order belongs to
  customerName?: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  tip: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  paymentMethod: 'cash' | 'card' | 'digital';
  isPaid: boolean;
  userId?: string; // Optional - for tracking which user created the order
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  category: string;
  menuItemId?: string; // Optional - link back to original menu item
}

export interface TableArea {
  name: string;
  tables: Table[];
  status?: 'active' | 'closed' | 'maintenance';
  restaurantId?: string; // Link to parent restaurant
}

export interface TablesData {
  areas: TableArea[];
  restaurantId: string; // Required restaurant ID
  lastUpdated: Date;
}
