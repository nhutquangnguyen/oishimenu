'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  DollarSign,
  Check,
  X
} from 'lucide-react';
import { MenuOptionGroup, MenuOption } from './types';

interface OptionsManagerProps {
  optionGroups: MenuOptionGroup[];
  setOptionGroups: (groups: MenuOptionGroup[]) => void;
  categories: any[];
  setCategories: (categories: any[]) => void;
  restaurantId: string;
  markAsChanged: () => void;
}

export function OptionsManager({ optionGroups, setOptionGroups, categories, setCategories, restaurantId, markAsChanged }: OptionsManagerProps) {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isCreatingOption, setIsCreatingOption] = useState(false);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    type: 'single' as 'single' | 'multiple',
    isRequired: false,
    minSelections: 0,
    maxSelections: 0,
    selectedDishes: [] as string[]
  });
  const [newOption, setNewOption] = useState({
    name: '',
    price: 0,
    isDefault: false,
    isAvailable: true
  });

  const addOptionGroup = () => {
    if (!newGroup.name.trim()) return;

    const group: MenuOptionGroup = {
      id: `group-${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description,
      type: newGroup.type,
      isRequired: newGroup.isRequired,
      minSelections: newGroup.minSelections,
      maxSelections: newGroup.maxSelections,
      options: [],
      order: optionGroups.length,
      restaurantId,
      linkedDishes: newGroup.selectedDishes
    };

    // Update the dishes to include this option group
    setCategories(categories.map(category => ({
      ...category,
      items: category.items.map(item => 
        newGroup.selectedDishes.includes(item.id)
          ? { ...item, optionGroups: [...(item.optionGroups || []), group.id] }
          : item
      )
    })));

    setOptionGroups([...optionGroups, group]);
    setNewGroup({
      name: '',
      description: '',
      type: 'single',
      isRequired: false,
      minSelections: 0,
      maxSelections: 0,
      selectedDishes: []
    });
    setIsCreatingGroup(false);
    markAsChanged();
  };

  const addOption = (groupId: string) => {
    if (!newOption.name.trim()) return;

    const option: MenuOption = {
      id: `option-${Date.now()}`,
      name: newOption.name,
      price: newOption.price,
      isDefault: newOption.isDefault,
      isAvailable: newOption.isAvailable,
      order: optionGroups.find(g => g.id === groupId)?.options.length || 0,
      optionGroupId: groupId,
      restaurantId
    };

    setOptionGroups(optionGroups.map(group => 
      group.id === groupId 
        ? { ...group, options: [...group.options, option] }
        : group
    ));

    setNewOption({
      name: '',
      price: 0,
      isDefault: false,
      isAvailable: true
    });
    setIsCreatingOption(false);
    setSelectedGroupId(null);
    markAsChanged();
  };

  const deleteOptionGroup = (groupId: string) => {
    setOptionGroups(optionGroups.filter(group => group.id !== groupId));
    markAsChanged();
  };

  const deleteOption = (groupId: string, optionId: string) => {
    setOptionGroups(optionGroups.map(group => 
      group.id === groupId 
        ? { ...group, options: group.options.filter(option => option.id !== optionId) }
        : group
    ));
    markAsChanged();
  };

  const toggleOptionAvailability = (groupId: string, optionId: string) => {
    setOptionGroups(optionGroups.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            options: group.options.map(option => 
              option.id === optionId 
                ? { ...option, isAvailable: !option.isAvailable }
                : option
            )
          }
        : group
    ));
    markAsChanged();
  };

  const editOptionGroup = (group: MenuOptionGroup) => {
    console.log('🔧 Editing option group:', group);
    setNewGroup({
      name: group.name,
      description: group.description || '',
      type: group.type,
      isRequired: group.isRequired,
      minSelections: group.minSelections || 0,
      maxSelections: group.maxSelections || 0,
      selectedDishes: group.linkedDishes || []
    });
    setSelectedGroupId(group.id);
    setIsEditingGroup(true);
  };

  const updateOptionGroup = () => {
    if (!selectedGroupId || !newGroup.name.trim()) return;

    console.log('🔄 Updating option group:', selectedGroupId);
    const oldGroup = optionGroups.find(group => group.id === selectedGroupId);
    const oldLinkedDishes = oldGroup?.linkedDishes || [];
    console.log('📋 Old linked dishes:', oldLinkedDishes);
    console.log('📋 New linked dishes:', newGroup.selectedDishes);

    // Update the option group
    setOptionGroups(optionGroups.map(group => 
      group.id === selectedGroupId 
        ? { 
            ...group, 
            name: newGroup.name,
            description: newGroup.description,
            type: newGroup.type,
            isRequired: newGroup.isRequired,
            minSelections: newGroup.minSelections,
            maxSelections: newGroup.maxSelections,
            linkedDishes: newGroup.selectedDishes
          }
        : group
    ));

    // Update the dishes to reflect the new option group assignments
    setCategories(categories.map(category => ({
      ...category,
      items: category.items.map(item => {
        const wasLinked = oldLinkedDishes.includes(item.id);
        const isNowLinked = newGroup.selectedDishes.includes(item.id);
        
        if (wasLinked && !isNowLinked) {
          // Remove this option group from the item
          return {
            ...item,
            optionGroups: (item.optionGroups || []).filter(groupId => groupId !== selectedGroupId)
          };
        } else if (!wasLinked && isNowLinked) {
          // Add this option group to the item
          return {
            ...item,
            optionGroups: [...(item.optionGroups || []), selectedGroupId]
          };
        }
        
        return item;
      })
    })));

    setNewGroup({
      name: '',
      description: '',
      type: 'single',
      isRequired: false,
      minSelections: 0,
      maxSelections: 0,
      selectedDishes: []
    });
    setIsEditingGroup(false);
    setSelectedGroupId(null);
    markAsChanged();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Menu Options</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage sizes, toppings, and other options for your menu items</p>
        </div>
        <Button
          onClick={() => setIsCreatingGroup(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Option Group</span>
          <span className="sm:hidden">Add Group</span>
        </Button>
      </div>

      {/* Create/Edit Option Group Dialog */}
      <Dialog open={isCreatingGroup || isEditingGroup} onOpenChange={(open) => {
        if (!open) {
          setIsCreatingGroup(false);
          setIsEditingGroup(false);
          setSelectedGroupId(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditingGroup ? 'Edit Option Group' : 'Create Option Group'}</DialogTitle>
            <DialogDescription>
              {isEditingGroup ? 'Update the option group settings and linked dishes' : 'Create a new option group (e.g., Size, Toppings, Extras)'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="e.g., Size, Toppings, Extras"
              />
            </div>

            <div>
              <Label htmlFor="groupDescription">Description (Optional)</Label>
              <Textarea
                id="groupDescription"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                placeholder="Describe this option group..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="groupType">Selection Type</Label>
                <Select
                  value={newGroup.type}
                  onValueChange={(value: 'single' | 'multiple') => setNewGroup({ ...newGroup, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Choice (Radio)</SelectItem>
                    <SelectItem value="multiple">Multiple Choice (Checkboxes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isRequired"
                  checked={newGroup.isRequired}
                  onCheckedChange={(checked) => setNewGroup({ ...newGroup, isRequired: checked })}
                />
                <Label htmlFor="isRequired">Required</Label>
              </div>
            </div>

            {newGroup.type === 'multiple' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minSelections">Min Selections</Label>
                  <Input
                    id="minSelections"
                    type="number"
                    min="0"
                    value={newGroup.minSelections}
                    onChange={(e) => setNewGroup({ ...newGroup, minSelections: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxSelections">Max Selections</Label>
                  <Input
                    id="maxSelections"
                    type="number"
                    min="0"
                    value={newGroup.maxSelections}
                    onChange={(e) => setNewGroup({ ...newGroup, maxSelections: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            )}

            {/* Dish Selection */}
            <div>
              <Label>Apply to Dishes</Label>
              <p className="text-sm text-gray-500 mb-3">Select which dishes this option group will be available for</p>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-1">
                    <div className="font-medium text-sm text-gray-700">{category.name}</div>
                    {category.items.map((item) => (
                      <label key={item.id} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newGroup.selectedDishes.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewGroup({
                                ...newGroup,
                                selectedDishes: [...newGroup.selectedDishes, item.id]
                              });
                            } else {
                              setNewGroup({
                                ...newGroup,
                                selectedDishes: newGroup.selectedDishes.filter(id => id !== item.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span>{item.name}</span>
                        <span className="text-gray-500">(${item.price.toFixed(2)})</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
              {newGroup.selectedDishes.length > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ Will be available for {newGroup.selectedDishes.length} dish(es)
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => {
              setIsCreatingGroup(false);
              setIsEditingGroup(false);
              setSelectedGroupId(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={isEditingGroup ? updateOptionGroup : addOptionGroup} 
              disabled={!newGroup.name.trim()}
            >
              {isEditingGroup ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Option Dialog */}
      <Dialog open={isCreatingOption} onOpenChange={setIsCreatingOption}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Option</DialogTitle>
            <DialogDescription>
              Add a new option to "{optionGroups.find(g => g.id === selectedGroupId)?.name}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="optionName">Option Name</Label>
              <Input
                id="optionName"
                value={newOption.name}
                onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                placeholder="e.g., Large, Extra Cheese, No Onions"
              />
            </div>

            <div>
              <Label htmlFor="optionPrice">Additional Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="optionPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newOption.price}
                  onChange={(e) => setNewOption({ ...newOption, price: parseFloat(e.target.value) || 0 })}
                  className="pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={newOption.isDefault}
                  onCheckedChange={(checked) => setNewOption({ ...newOption, isDefault: checked })}
                />
                <Label htmlFor="isDefault">Default Option</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAvailable"
                  checked={newOption.isAvailable}
                  onCheckedChange={(checked) => setNewOption({ ...newOption, isAvailable: checked })}
                />
                <Label htmlFor="isAvailable">Available</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsCreatingOption(false)}>
              Cancel
            </Button>
            <Button onClick={() => addOption(selectedGroupId!)} disabled={!newOption.name.trim()}>
              Add Option
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Option Groups List */}
      <div className="space-y-4">
        {optionGroups.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Option Groups Yet</h3>
              <p className="text-gray-600 mb-4">Create option groups like sizes, toppings, or extras for your menu items</p>
              <Button onClick={() => setIsCreatingGroup(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Option Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          optionGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex flex-wrap items-center gap-2">
                      <span className="truncate">{group.name}</span>
                      <Badge variant={group.type === 'single' ? 'default' : 'secondary'} className="text-xs">
                        {group.type === 'single' ? 'Single' : 'Multiple'}
                      </Badge>
                      {group.isRequired && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </CardTitle>
                    {group.description && (
                      <CardDescription className="mt-1">{group.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('🖱️ Edit button clicked for group:', group.id);
                        editOptionGroup(group);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Edit className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline ml-1">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setIsCreatingOption(true);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline ml-1">Add</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteOptionGroup(group.id)}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Linked Dishes */}
                {group.linkedDishes && group.linkedDishes.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-2">Applied to Dishes:</div>
                    <div className="flex flex-wrap gap-1">
                      {group.linkedDishes.map(dishId => {
                        const dish = categories.flatMap(cat => cat.items).find(item => item.id === dishId);
                        return dish ? (
                          <Badge key={dishId} variant="secondary" className="text-xs">
                            {dish.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {group.options.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No options yet. Add some options to this group.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <div key={option.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-medium truncate">{option.name}</span>
                            {option.isDefault && (
                              <Badge variant="outline" className="text-xs">Default</Badge>
                            )}
                            {!option.isAvailable && (
                              <Badge variant="destructive" className="text-xs">Unavailable</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'No additional cost'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleOptionAvailability(group.id, option.id)}
                            className="h-8 w-8 p-0"
                          >
                            {option.isAvailable ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteOption(group.id, option.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
