export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string; // kg, liter, piece, etc.
  currentStock: number;
  minStock: number; // Alert threshold
  maxStock?: number;
  costPerUnit: number; // Cost per unit in the base currency
  supplier?: string;
  expiryDate?: Date;
  notes?: string;
  restaurantId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  id: string;
  menuItemId?: string; // Optional - can be null if menu item not created yet
  menuItemName: string;
  ingredients: RecipeIngredient[];
  totalCost: number; // Calculated from ingredients
  profitMargin: number; // Percentage
  suggestedPrice: number; // Calculated based on cost + margin
  servingSize: number; // Number of servings this recipe makes
  instructions?: string;
  preparationTime?: number; // Minutes
  category: string; // Food category
  status: 'draft' | 'ready_for_menu' | 'published' | 'archived';
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemProgress {
  hasRecipe: boolean;
  hasCostCalculation: boolean;
  hasBasicInfo: boolean; // Name, description, category
  hasMenuPresentation: boolean; // Description, image, etc.
  hasOptions: boolean; // Size options, customizations
  isPublished: boolean;
  completionPercentage: number;
}

export interface MenuItemWorkflow {
  recipeId?: string;
  menuItemId?: string;
  name: string;
  category: string;
  progress: MenuItemProgress;
  lastUpdated: Date;
  nextAction: 'add_ingredients' | 'calculate_cost' | 'configure_menu' | 'add_options' | 'publish';
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number; // Amount needed for this recipe
  unit: string;
  costPerUnit: number;
  totalCost: number; // quantity * costPerUnit
}

export interface InventoryTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'adjustment' | 'waste';
  ingredientId: string;
  ingredientName: string;
  quantity: number; // Positive for incoming, negative for outgoing
  unit: string;
  costPerUnit?: number;
  totalCost?: number;
  reason?: string;
  orderId?: string; // Link to order if type is 'usage'
  purchaseId?: string; // Link to purchase if type is 'purchase'
  walletType: 'cash' | 'bank';
  restaurantId: string;
  userId: string;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  supplier: string;
  ingredients: PurchaseItem[];
  totalCost: number;
  walletType: 'cash' | 'bank';
  status: 'pending' | 'received' | 'cancelled';
  purchaseDate: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  restaurantId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  expiryDate?: Date;
}

export interface Wallet {
  id: string;
  restaurantId: string;
  type: 'cash' | 'bank';
  balance: number;
  currency: string;
  lastUpdated: Date;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'expired' | 'high_cost';
  ingredientId: string;
  ingredientName: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  restaurantId: string;
  createdAt: Date;
}

// Utility types for forms and calculations
export interface CostAnalysis {
  totalIngredientCost: number;
  sellingPrice: number;
  profitMargin: number;
  profitAmount: number;
  profitPercentage: number;
}

export interface StockLevel {
  ingredientId: string;
  ingredientName: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked';
  daysRemaining?: number; // Based on average usage
}