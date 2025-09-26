export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  theme?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string; // User who owns this restaurant
}

export interface RestaurantSettings {
  restaurantId: string;
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  serviceCharge: number;
  allowOnlineOrders: boolean;
  allowTableReservations: boolean;
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
}
