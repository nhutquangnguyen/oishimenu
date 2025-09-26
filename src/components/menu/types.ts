export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  order: number;
  restaurantId?: string; // Link to parent restaurant
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  allergens?: string[];
  order: number;
  restaurantId?: string; // Link to parent restaurant
  optionGroups?: string[]; // Array of option group IDs linked to this item
  recommendations?: string[]; // Array of recommended item IDs
}

export interface MenuOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
  isAvailable: boolean;
  order: number;
  optionGroupId: string;
  restaurantId?: string;
}

export interface MenuOptionGroup {
  id: string;
  name: string;
  description?: string;
  type: 'single' | 'multiple'; // single = radio buttons, multiple = checkboxes
  isRequired: boolean;
  minSelections?: number;
  maxSelections?: number;
  options: MenuOption[];
  order: number;
  restaurantId?: string;
  linkedDishes?: string[]; // Array of dish IDs that this option group applies to
}

export interface MenuData {
  categories: MenuCategory[];
  optionGroups?: MenuOptionGroup[];
  isPublic: boolean;
  theme: string;
  restaurantId: string; // Required restaurant ID
  restaurant: {
    name: string;
    logo: string;
    description: string;
    address: string;
    phone: string;
    email?: string;
    hours: string;
  };
  lastUpdated: Date;
}
