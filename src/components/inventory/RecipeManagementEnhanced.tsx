'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calculator,
  ChefHat,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Menu as MenuIcon,
  Settings,
  Package
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import {
  getRecipesByRestaurant,
  createRecipe,
  updateRecipe,
  getIngredientsByRestaurant
} from '@/lib/firestore';
import { Recipe, RecipeIngredient, Ingredient, MenuItemProgress, MenuItemWorkflow } from './types';

const FOOD_CATEGORIES = [
  'Appetizers',
  'Main Courses',
  'Desserts',
  'Beverages',
  'Sides',
  'Salads',
  'Soups',
  'Pasta',
  'Pizza',
  'Sandwiches',
  'Other'
];

interface RecipeManagementEnhancedProps {
  onNavigateToMenu?: (recipeId?: string) => void;
}

export function RecipeManagementEnhanced({ onNavigateToMenu }: RecipeManagementEnhancedProps = {}) {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    menuItemName: '',
    category: '',
    profitMargin: 30,
    servingSize: 1,
    preparationTime: 30,
    instructions: '',
    ingredients: [] as RecipeIngredient[]
  });

  // Ingredient selection state
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');

  useEffect(() => {
    loadData();
  }, [user?.uid, currentRestaurant?.id]);

  const loadData = async () => {
    if (!user?.uid || !currentRestaurant?.id) return;

    try {
      setLoading(true);
      const [recipesData, ingredientsData] = await Promise.all([
        getRecipesByRestaurant(currentRestaurant.id),
        getIngredientsByRestaurant(currentRestaurant.id)
      ]);
      setRecipes(recipesData);
      setIngredients(ingredientsData);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (recipe: Recipe): MenuItemProgress => {
    const hasRecipe = recipe.ingredients.length > 0;
    const hasCostCalculation = recipe.totalCost > 0;
    const hasBasicInfo = recipe.menuItemName && recipe.category;
    const hasMenuPresentation = !!recipe.menuItemId; // Has been added to menu
    const hasOptions = false; // Will be determined by menu builder
    const isPublished = recipe.status === 'published';

    const steps = [hasRecipe, hasCostCalculation, hasBasicInfo, hasMenuPresentation, isPublished];
    const completedSteps = steps.filter(Boolean).length;
    const completionPercentage = (completedSteps / steps.length) * 100;

    return {
      hasRecipe,
      hasCostCalculation,
      hasBasicInfo,
      hasMenuPresentation,
      hasOptions,
      isPublished,
      completionPercentage
    };
  };

  const getNextAction = (progress: MenuItemProgress): MenuItemWorkflow['nextAction'] => {
    if (!progress.hasRecipe) return 'add_ingredients';
    if (!progress.hasCostCalculation) return 'calculate_cost';
    if (!progress.hasMenuPresentation) return 'configure_menu';
    if (!progress.hasOptions) return 'add_options';
    return 'publish';
  };

  const calculateTotalCost = (ingredients: RecipeIngredient[]): number => {
    return ingredients.reduce((total, ingredient) => total + ingredient.totalCost, 0);
  };

  const calculateSuggestedPrice = (totalCost: number, profitMargin: number): number => {
    return totalCost * (1 + profitMargin / 100);
  };

  const addIngredientToRecipe = () => {
    if (!selectedIngredientId || !ingredientQuantity) return;

    const ingredient = ingredients.find(ing => ing.id === selectedIngredientId);
    if (!ingredient) return;

    const quantity = parseFloat(ingredientQuantity);
    const totalCost = quantity * ingredient.costPerUnit;

    const newIngredient: RecipeIngredient = {
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      quantity,
      unit: ingredient.unit,
      costPerUnit: ingredient.costPerUnit,
      totalCost
    };

    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));

    setSelectedIngredientId('');
    setIngredientQuantity('');
  };

  const removeIngredientFromRecipe = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !currentRestaurant?.id) return;

    try {
      const totalCost = calculateTotalCost(formData.ingredients);
      const suggestedPrice = calculateSuggestedPrice(totalCost, formData.profitMargin);

      const recipeData = {
        ...formData,
        totalCost,
        suggestedPrice,
        status: 'ready_for_menu' as const,
        restaurantId: currentRestaurant.id
      };

      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, recipeData);
      } else {
        await createRecipe(recipeData);
      }

      await loadData();
      setIsCreateDialogOpen(false);
      setEditingRecipe(null);
      resetForm();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      menuItemName: recipe.menuItemName,
      category: recipe.category,
      profitMargin: recipe.profitMargin,
      servingSize: recipe.servingSize,
      preparationTime: recipe.preparationTime || 30,
      instructions: recipe.instructions || '',
      ingredients: recipe.ingredients
    });
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      menuItemName: '',
      category: '',
      profitMargin: 30,
      servingSize: 1,
      preparationTime: 30,
      instructions: '',
      ingredients: []
    });
  };

  const navigateToMenuBuilder = (recipe: Recipe) => {
    if (onNavigateToMenu) {
      onNavigateToMenu(recipe.id);
    } else {
      // Fallback to direct navigation
      window.location.href = `/dashboard/menu?recipeId=${recipe.id}`;
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.menuItemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || recipe.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || recipe.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: Recipe['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'ready_for_menu': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButton = (recipe: Recipe, progress: MenuItemProgress) => {
    const nextAction = getNextAction(progress);

    switch (nextAction) {
      case 'add_ingredients':
        return (
          <Button size="sm" onClick={() => handleEdit(recipe)}>
            <Package className="w-4 h-4 mr-2" />
            Add Ingredients
          </Button>
        );
      case 'calculate_cost':
        return (
          <Button size="sm" onClick={() => handleEdit(recipe)}>
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Cost
          </Button>
        );
      case 'configure_menu':
        return (
          <Button size="sm" onClick={() => navigateToMenuBuilder(recipe)} className="bg-blue-600 hover:bg-blue-700">
            <MenuIcon className="w-4 h-4 mr-2" />
            Configure Menu
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        );
      case 'add_options':
        return (
          <Button size="sm" variant="outline" onClick={() => navigateToMenuBuilder(recipe)}>
            <Settings className="w-4 h-4 mr-2" />
            Add Options
          </Button>
        );
      case 'publish':
        return (
          <Button size="sm" variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Ready to Publish
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading recipes...</div>
          <div className="text-sm text-gray-500">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recipe Management</h2>
          <p className="text-gray-600">Create recipes and manage menu item workflows</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="menuItemName">Menu Item Name</Label>
                  <Input
                    id="menuItemName"
                    value={formData.menuItemName}
                    onChange={(e) => setFormData({ ...formData, menuItemName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOOD_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Recipe Details */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="servingSize">Serving Size</Label>
                  <Input
                    id="servingSize"
                    type="number"
                    min="1"
                    value={formData.servingSize}
                    onChange={(e) => setFormData({ ...formData, servingSize: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="preparationTime">Prep Time (min)</Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    min="1"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 30 })}
                  />
                </div>
                <div>
                  <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                  <Input
                    id="profitMargin"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.profitMargin}
                    onChange={(e) => setFormData({ ...formData, profitMargin: parseFloat(e.target.value) || 30 })}
                  />
                </div>
              </div>

              {/* Ingredients Section */}
              <div>
                <Label className="text-base font-semibold">Ingredients</Label>
                <div className="mt-2 space-y-4">
                  {/* Add Ingredient */}
                  <div className="flex gap-2">
                    <Select value={selectedIngredientId} onValueChange={setSelectedIngredientId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select ingredient" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredients.map(ingredient => (
                          <SelectItem key={ingredient.id} value={ingredient.id}>
                            {ingredient.name} (${ingredient.costPerUnit.toFixed(2)}/{ingredient.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Quantity"
                      type="number"
                      step="0.01"
                      value={ingredientQuantity}
                      onChange={(e) => setIngredientQuantity(e.target.value)}
                      className="w-32"
                    />
                    <Button type="button" onClick={addIngredientToRecipe}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Ingredients List */}
                  {formData.ingredients.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-2">
                      {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{ingredient.ingredientName}</span>
                            <span className="text-gray-600 ml-2">
                              {ingredient.quantity} {ingredient.unit} × ${ingredient.costPerUnit.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">${ingredient.totalCost.toFixed(2)}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeIngredientFromRecipe(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Cost Summary */}
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Cost:</span>
                          <span className="font-semibold">${calculateTotalCost(formData.ingredients).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Suggested Price ({formData.profitMargin}% margin):</span>
                          <span className="font-semibold text-green-600">
                            ${calculateSuggestedPrice(calculateTotalCost(formData.ingredients), formData.profitMargin).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <Label htmlFor="instructions">Preparation Instructions (optional)</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={3}
                  placeholder="Step-by-step cooking instructions..."
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingRecipe(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="ready_for_menu">Ready for Menu</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {FOOD_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Recipes List */}
      <div className="grid gap-4">
        {filteredRecipes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters.'
                  : 'Create your first recipe to start building menu items.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRecipes.map((recipe) => {
            const progress = calculateProgress(recipe);

            return (
              <Card key={recipe.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {recipe.menuItemName}
                        </h3>
                        <Badge className={getStatusColor(recipe.status)}>
                          {recipe.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress.completionPercentage)}%</span>
                        </div>
                        <Progress value={progress.completionPercentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <div className="font-medium">{recipe.category}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span>
                          <div className="font-medium">${recipe.totalCost.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Suggested Price:</span>
                          <div className="font-medium text-green-600">${recipe.suggestedPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Ingredients:</span>
                          <div className="font-medium">{recipe.ingredients.length}</div>
                        </div>
                      </div>

                      {recipe.preparationTime && (
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {recipe.preparationTime} minutes prep time
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {getActionButton(recipe, progress)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(recipe)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {recipe.instructions && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                      <p className="text-sm text-gray-600">{recipe.instructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}