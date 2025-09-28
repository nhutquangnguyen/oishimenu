export interface Wallet {
  id: string;
  restaurantId: string;
  type: 'cash' | 'bank';
  balance: number;
  currency: string;
  lastUpdated: Date;
}

export interface MoneyTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'adjustment';
  category: string;
  subcategory?: string;
  amount: number;
  description: string;
  walletType: 'cash' | 'bank';
  fromWallet?: 'cash' | 'bank'; // For transfers
  toWallet?: 'cash' | 'bank'; // For transfers
  paymentMethod?: 'cash' | 'card' | 'digital' | 'bank_transfer';
  reference?: string; // Receipt number, invoice ID, etc.
  orderId?: string; // Link to order if applicable
  supplierId?: string; // Link to supplier if applicable
  restaurantId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  restaurantId: string;
  subcategories?: string[];
}

export interface IncomeCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  restaurantId: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  cashBalance: number;
  bankBalance: number;
  totalBalance: number;
  period: 'today' | 'week' | 'month' | 'year';
  periodStart: Date;
  periodEnd: Date;
}

export interface MonthlyReport {
  year: number;
  month: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  orderIncome: number;
  otherIncome: number;
  expensesByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  transactionCount: number;
  averageTransactionAmount: number;
}

export interface DailySummary {
  date: Date;
  income: number;
  expenses: number;
  netAmount: number;
  transactionCount: number;
  orderCount: number;
  cashFlow: number;
}

export interface BudgetItem {
  id: string;
  category: string;
  monthlyBudget: number;
  currentSpent: number;
  remaining: number;
  isOverBudget: boolean;
  restaurantId: string;
  year: number;
  month: number;
}

// Default expense categories
export const DEFAULT_EXPENSE_CATEGORIES: Omit<ExpenseCategory, 'id' | 'restaurantId'>[] = [
  {
    name: 'Food & Ingredients',
    description: 'Ingredients, food supplies, inventory purchases',
    color: '#ef4444',
    isActive: true,
    subcategories: ['Meat & Protein', 'Vegetables', 'Dairy', 'Spices', 'Beverages', 'Other Ingredients']
  },
  {
    name: 'Staff & Payroll',
    description: 'Salaries, wages, benefits, training',
    color: '#3b82f6',
    isActive: true,
    subcategories: ['Salaries', 'Hourly Wages', 'Benefits', 'Training', 'Overtime']
  },
  {
    name: 'Utilities',
    description: 'Electricity, water, gas, internet, phone',
    color: '#f59e0b',
    isActive: true,
    subcategories: ['Electricity', 'Water', 'Gas', 'Internet', 'Phone', 'Other Utilities']
  },
  {
    name: 'Rent & Property',
    description: 'Rent, property maintenance, insurance',
    color: '#8b5cf6',
    isActive: true,
    subcategories: ['Rent', 'Property Tax', 'Insurance', 'Maintenance', 'Security']
  },
  {
    name: 'Equipment & Supplies',
    description: 'Kitchen equipment, cleaning supplies, packaging',
    color: '#10b981',
    isActive: true,
    subcategories: ['Kitchen Equipment', 'Cleaning Supplies', 'Packaging', 'Uniforms', 'Other Supplies']
  },
  {
    name: 'Marketing & Advertising',
    description: 'Online ads, promotional materials, events',
    color: '#f97316',
    isActive: true,
    subcategories: ['Online Advertising', 'Print Materials', 'Events', 'Social Media', 'Website']
  },
  {
    name: 'Transportation',
    description: 'Delivery costs, fuel, vehicle maintenance',
    color: '#06b6d4',
    isActive: true,
    subcategories: ['Fuel', 'Vehicle Maintenance', 'Delivery Fees', 'Parking', 'Other Transport']
  },
  {
    name: 'Professional Services',
    description: 'Accounting, legal, consulting, software',
    color: '#84cc16',
    isActive: true,
    subcategories: ['Accounting', 'Legal', 'Consulting', 'Software Subscriptions', 'Banking Fees']
  },
  {
    name: 'Other Expenses',
    description: 'Miscellaneous business expenses',
    color: '#6b7280',
    isActive: true,
    subcategories: ['Miscellaneous', 'Emergency', 'Unexpected']
  }
];

// Default income categories
export const DEFAULT_INCOME_CATEGORIES: Omit<IncomeCategory, 'id' | 'restaurantId'>[] = [
  {
    name: 'Order Sales',
    description: 'Revenue from food orders',
    color: '#10b981',
    isActive: true
  },
  {
    name: 'Delivery Revenue',
    description: 'Revenue from delivery services',
    color: '#3b82f6',
    isActive: true
  },
  {
    name: 'Catering',
    description: 'Revenue from catering services',
    color: '#f59e0b',
    isActive: true
  },
  {
    name: 'Other Income',
    description: 'Miscellaneous income sources',
    color: '#8b5cf6',
    isActive: true
  }
];