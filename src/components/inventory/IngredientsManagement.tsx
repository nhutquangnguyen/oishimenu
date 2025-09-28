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
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import {
  getIngredientsByRestaurant,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getStockLevels
} from '@/lib/firestore';
import { Ingredient, StockLevel } from './types';

const INGREDIENT_CATEGORIES = [
  'Proteins',
  'Vegetables',
  'Fruits',
  'Grains & Starches',
  'Dairy & Eggs',
  'Spices & Seasonings',
  'Oils & Fats',
  'Beverages',
  'Sauces & Condiments',
  'Other'
];

const UNITS = [
  'kg', 'g', 'lbs', 'oz',
  'liter', 'ml', 'gallon', 'cups',
  'pieces', 'boxes', 'cans', 'bottles'
];

export function IngredientsManagement() {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    costPerUnit: 0,
    supplier: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [user?.uid, currentRestaurant?.id]);

  const loadData = async () => {
    if (!user?.uid || !currentRestaurant?.id) return;

    try {
      setLoading(true);
      const [ingredientsData, stockLevelsData] = await Promise.all([
        getIngredientsByRestaurant(currentRestaurant.id),
        getStockLevels(currentRestaurant.id)
      ]);
      setIngredients(ingredientsData);
      setStockLevels(stockLevelsData);
    } catch (error) {
      console.error('Error loading ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !currentRestaurant?.id) return;

    try {
      const ingredientData = {
        ...formData,
        restaurantId: currentRestaurant.id,
        isActive: true
      };

      if (editingIngredient) {
        await updateIngredient(editingIngredient.id, ingredientData);
      } else {
        await createIngredient(ingredientData);
      }

      await loadData();
      setIsAddDialogOpen(false);
      setEditingIngredient(null);
      resetForm();
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      category: ingredient.category,
      unit: ingredient.unit,
      currentStock: ingredient.currentStock,
      minStock: ingredient.minStock,
      maxStock: ingredient.maxStock || 0,
      costPerUnit: ingredient.costPerUnit,
      supplier: ingredient.supplier || '',
      notes: ingredient.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (ingredient: Ingredient) => {
    if (!confirm(`Are you sure you want to delete ${ingredient.name}?`)) return;

    try {
      await deleteIngredient(ingredient.id);
      await loadData();
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      unit: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      costPerUnit: 0,
      supplier: '',
      notes: ''
    });
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ingredient.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter !== 'all') {
      const stockLevel = stockLevels.find(sl => sl.ingredientId === ingredient.id);
      matchesStatus = stockLevel?.status === statusFilter;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockStatusBadge = (ingredient: Ingredient) => {
    const stockLevel = stockLevels.find(sl => sl.ingredientId === ingredient.id);
    if (!stockLevel) return null;

    const colors = {
      in_stock: 'bg-green-100 text-green-800',
      low_stock: 'bg-yellow-100 text-yellow-800',
      out_of_stock: 'bg-red-100 text-red-800',
      overstocked: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={colors[stockLevel.status]}>
        {stockLevel.status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading ingredients...</div>
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
          <h2 className="text-2xl font-bold text-gray-900">Ingredients Management</h2>
          <p className="text-gray-600">Manage your restaurant's ingredient inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    {INGREDIENT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    step="0.01"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    step="0.01"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxStock">Max Stock (optional)</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    step="0.01"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({ ...formData, maxStock: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="costPerUnit">Cost per Unit</Label>
                  <Input
                    id="costPerUnit"
                    type="number"
                    step="0.01"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="supplier">Supplier (optional)</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingIngredient ? 'Update' : 'Add'} Ingredient
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingIngredient(null);
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
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {INGREDIENT_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            <SelectItem value="overstocked">Overstocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ingredients List */}
      <div className="grid gap-4">
        {filteredIngredients.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No ingredients found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters.'
                  : 'Add your first ingredient to get started.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredIngredients.map((ingredient) => (
            <Card key={ingredient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {ingredient.name}
                      </h3>
                      {getStockStatusBadge(ingredient)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <div className="font-medium">{ingredient.category}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Stock:</span>
                        <div className="font-medium">
                          {ingredient.currentStock} {ingredient.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Min Stock:</span>
                        <div className="font-medium">
                          {ingredient.minStock} {ingredient.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost per Unit:</span>
                        <div className="font-medium">${ingredient.costPerUnit.toFixed(2)}</div>
                      </div>
                    </div>
                    {ingredient.supplier && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Supplier:</span>
                        <span className="ml-1 font-medium">{ingredient.supplier}</span>
                      </div>
                    )}
                    {ingredient.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        {ingredient.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ingredient)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ingredient)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}