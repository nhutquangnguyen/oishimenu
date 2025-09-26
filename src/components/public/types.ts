export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isFeatured: boolean;
  allergens?: string[];
  image?: string;
  categoryId: string;
  order: number;
  optionGroups?: string[];
  recommendations?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

// Updated CartItem interface with options support
export interface PublicCartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  selectedOptions?: any;
  totalPrice: number;
}

// Legacy CartItem for backward compatibility
export interface CartItem extends PublicCartItem {}

export interface RestaurantInfo {
  name: string;
  description: string;
  logo: string;
  phone: string;
  address: string;
  hours: string;
}
