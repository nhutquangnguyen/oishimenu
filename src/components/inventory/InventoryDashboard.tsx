'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Calculator,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import {
  getStockLevels,
  getInventoryAlerts,
  getWallet,
  getIngredientsByRestaurant,
  getInventoryTransactions,
  getRecipesByRestaurant
} from '@/lib/firestore';
import { StockLevel, InventoryAlert, Wallet, Ingredient, InventoryTransaction, MenuItemWorkflow, Recipe } from './types';
import { WorkflowGuide } from './WorkflowGuide';

interface InventoryDashboardProps {
  onNavigateToTab?: (tab: string) => void;
  onNavigateToMenu?: (recipeId?: string) => void;
}

export function InventoryDashboard({ onNavigateToTab, onNavigateToMenu }: InventoryDashboardProps = {}) {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();

  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [cashWallet, setCashWallet] = useState<Wallet | null>(null);
  const [bankWallet, setBankWallet] = useState<Wallet | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<InventoryTransaction[]>([]);
  const [workflows, setWorkflows] = useState<MenuItemWorkflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.uid || !currentRestaurant?.id) return;

      try {
        setLoading(true);

        // Load all data in parallel
        const [
          stockLevelsData,
          alertsData,
          cashWalletData,
          bankWalletData,
          ingredientsData,
          transactionsData,
          recipesData
        ] = await Promise.all([
          getStockLevels(currentRestaurant.id),
          getInventoryAlerts(currentRestaurant.id),
          getWallet(currentRestaurant.id, 'cash'),
          getWallet(currentRestaurant.id, 'bank'),
          getIngredientsByRestaurant(currentRestaurant.id),
          getInventoryTransactions(currentRestaurant.id, 10),
          getRecipesByRestaurant(currentRestaurant.id)
        ]);

        setStockLevels(stockLevelsData);
        setAlerts(alertsData);
        setCashWallet(cashWalletData);
        setBankWallet(bankWalletData);
        setIngredients(ingredientsData);
        setRecentTransactions(transactionsData);

        // Generate workflows from recipes
        const workflowsData = generateWorkflowsFromRecipes(recipesData);
        setWorkflows(workflowsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.uid, currentRestaurant?.id]);

  const generateWorkflowsFromRecipes = (recipes: Recipe[]): MenuItemWorkflow[] => {
    return recipes.map(recipe => {
      const hasRecipe = recipe.ingredients.length > 0;
      const hasCostCalculation = recipe.totalCost > 0;
      const hasBasicInfo = recipe.menuItemName && recipe.category;
      const hasMenuPresentation = !!recipe.menuItemId;
      const hasOptions = false; // Will be determined by menu builder
      const isPublished = recipe.status === 'published';

      const steps = [hasRecipe, hasCostCalculation, hasBasicInfo, hasMenuPresentation, isPublished];
      const completedSteps = steps.filter(Boolean).length;
      const completionPercentage = (completedSteps / steps.length) * 100;

      const progress = {
        hasRecipe,
        hasCostCalculation,
        hasBasicInfo,
        hasMenuPresentation,
        hasOptions,
        isPublished,
        completionPercentage
      };

      const getNextAction = () => {
        if (!hasRecipe) return 'add_ingredients' as const;
        if (!hasCostCalculation) return 'calculate_cost' as const;
        if (!hasMenuPresentation) return 'configure_menu' as const;
        if (!hasOptions) return 'add_options' as const;
        return 'publish' as const;
      };

      return {
        recipeId: recipe.id,
        menuItemId: recipe.menuItemId,
        name: recipe.menuItemName,
        category: recipe.category,
        progress,
        lastUpdated: recipe.updatedAt,
        nextAction: getNextAction()
      };
    }).filter(workflow => workflow.progress.completionPercentage < 100); // Only show incomplete workflows
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading dashboard...</div>
          <div className="text-sm text-gray-500">Please wait while we load your inventory data</div>
        </div>
      </div>
    );
  }

  const lowStockItems = stockLevels.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock');
  const totalIngredients = ingredients.length;
  const totalValue = ingredients.reduce((sum, ingredient) => sum + (ingredient.currentStock * ingredient.costPerUnit), 0);
  const totalWalletBalance = (cashWallet?.balance || 0) + (bankWallet?.balance || 0);

  const getStockStatusColor = (status: StockLevel['status']) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'overstocked': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeColor = (type: InventoryTransaction['type']) => {
    switch (type) {
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'usage': return 'bg-red-100 text-red-800';
      case 'adjustment': return 'bg-blue-100 text-blue-800';
      case 'waste': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingredients</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIngredients}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockItems.length} low/out of stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Current stock value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWalletBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Cash: ${(cashWallet?.balance || 0).toFixed(2)} | Bank: ${(bankWallet?.balance || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Guide */}
      <WorkflowGuide
        workflows={workflows}
        onNavigateToTab={onNavigateToTab || (() => {})}
        onNavigateToMenu={onNavigateToMenu || (() => {})}
      />

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Inventory Alerts</span>
            </CardTitle>
            <CardDescription>Items that require immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{alert.ingredientName}</div>
                    <div className="text-sm text-gray-600">{alert.message}</div>
                  </div>
                  <Badge variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'default' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
              {alerts.length > 5 && (
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    View All Alerts ({alerts.length - 5} more)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Status Overview</CardTitle>
            <CardDescription>Current inventory levels by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockLevels.slice(0, 8).map((item) => (
                <div key={item.ingredientId} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.ingredientName}</div>
                    <div className="text-sm text-gray-600">
                      {item.currentStock} {item.unit} (min: {item.minStock})
                    </div>
                  </div>
                  <Badge className={getStockStatusColor(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
              {stockLevels.length > 8 && (
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All ({stockLevels.length - 8} more)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest inventory movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No transactions yet
                </div>
              ) : (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{transaction.ingredientName}</div>
                      <div className="text-sm text-gray-600">
                        {transaction.quantity > 0 ? '+' : ''}{transaction.quantity} {transaction.unit}
                        {transaction.reason && ` • ${transaction.reason}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getTransactionTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                      {transaction.totalCost && (
                        <div className="text-sm font-medium mt-1">
                          ${transaction.totalCost.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common inventory management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => onNavigateToTab?.('ingredients')}
            >
              <Package className="h-6 w-6" />
              <span className="text-sm">Add Ingredient</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => onNavigateToTab?.('purchases')}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">Record Purchase</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => onNavigateToTab?.('recipes')}
            >
              <Calculator className="h-6 w-6" />
              <span className="text-sm">Create Recipe</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Update Wallet</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}