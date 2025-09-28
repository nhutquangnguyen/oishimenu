'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Receipt, Calculator, ArrowRight, Info } from 'lucide-react';
import { IngredientsManagement } from './IngredientsManagement';
import { PurchaseManagement } from './PurchaseManagement';
import { RecipeManagementEnhanced } from './RecipeManagementEnhanced';
import { InventoryDashboard } from './InventoryDashboard';

export function InventoryTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [smartPrompt, setSmartPrompt] = useState<{
    show: boolean;
    title: string;
    description: string;
    action: string;
    actionLabel: string;
    onAction: () => void;
  } | null>(null);

  // Handle URL parameters for cross-navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    const action = searchParams.get('action');
    const recipeId = searchParams.get('recipeId');

    if (tab && ['dashboard', 'ingredients', 'recipes', 'purchases'].includes(tab)) {
      setActiveTab(tab);
    }

    // Show smart prompts based on URL context
    if (action === 'create_recipe_from_menu') {
      setSmartPrompt({
        show: true,
        title: 'Create Recipe for Menu Item',
        description: 'You\'re creating a recipe that will be connected to a menu item. Start by adding ingredients and calculating costs.',
        action: 'recipes',
        actionLabel: 'Go to Recipe Creation',
        onAction: () => {
          setActiveTab('recipes');
          setSmartPrompt(null);
        }
      });
    } else if (action === 'manage_ingredients_for_recipe') {
      setSmartPrompt({
        show: true,
        title: 'Manage Ingredients',
        description: 'Make sure you have all the required ingredients with proper costs before creating recipes.',
        action: 'ingredients',
        actionLabel: 'Manage Ingredients',
        onAction: () => {
          setActiveTab('ingredients');
          setSmartPrompt(null);
        }
      });
    }
  }, [searchParams]);

  const navigateToMenuBuilder = (recipeId?: string) => {
    const params = new URLSearchParams();
    if (recipeId) params.set('recipeId', recipeId);
    params.set('source', 'inventory');
    router.push(`/dashboard/menu?${params.toString()}`);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    // Update URL without page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    router.replace(`/dashboard/inventory?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Manage ingredients, recipes, purchases, and track costs</p>
      </div>

      {/* Smart Prompt */}
      {smartPrompt?.show && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <div className="ml-2">
            <h4 className="font-semibold text-blue-900">{smartPrompt.title}</h4>
            <AlertDescription className="text-blue-800">
              {smartPrompt.description}
            </AlertDescription>
            <div className="mt-2 flex space-x-2">
              <Button
                size="sm"
                onClick={smartPrompt.onAction}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {smartPrompt.actionLabel}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSmartPrompt(null)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Ingredients</span>
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Recipes</span>
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Purchases</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <InventoryDashboard onNavigateToTab={handleTabChange} onNavigateToMenu={navigateToMenuBuilder} />
        </TabsContent>

        <TabsContent value="ingredients" className="mt-6">
          <IngredientsManagement />
        </TabsContent>

        <TabsContent value="recipes" className="mt-6">
          <RecipeManagementEnhanced onNavigateToMenu={navigateToMenuBuilder} />
        </TabsContent>

        <TabsContent value="purchases" className="mt-6">
          <PurchaseManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}