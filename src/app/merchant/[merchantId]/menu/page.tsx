'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Store, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  DollarSign,
  Star,
  Clock,
  Users
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  rating: number;
  orders: number;
  prepTime: number;
}

export default function MerchantMenuPage() {
  const params = useParams();
  const merchantId = params.merchantId as string;
  const [merchant, setMerchant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMerchant = {
      id: merchantId,
      name: merchantId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      shortName: merchantId,
      description: 'Your restaurant menu management',
      location: 'Your City, State',
      logo: '🍽️'
    };
    
    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, and basil',
        price: 18.99,
        category: 'Pizza',
        image: '🍕',
        isAvailable: true,
        rating: 4.8,
        orders: 125,
        prepTime: 15
      },
      {
        id: '2',
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with mozzarella cheese',
        price: 21.99,
        category: 'Pizza',
        image: '🍕',
        isAvailable: true,
        rating: 4.6,
        orders: 98,
        prepTime: 15
      },
      {
        id: '3',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with caesar dressing',
        price: 12.99,
        category: 'Salad',
        image: '🥗',
        isAvailable: true,
        rating: 4.5,
        orders: 67,
        prepTime: 8
      },
      {
        id: '4',
        name: 'Chicken Wings',
        description: 'Crispy wings with your choice of sauce',
        price: 16.99,
        category: 'Appetizer',
        image: '🍗',
        isAvailable: false,
        rating: 4.7,
        orders: 89,
        prepTime: 12
      }
    ];
    
    setMerchant(mockMerchant);
    setMenuItems(mockMenuItems);
  }, [merchantId]);

  const categories = ['all', 'Pizza', 'Salad', 'Appetizer', 'Dessert', 'Beverage'];
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">{merchant?.logo}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{merchant?.name}</h1>
                <p className="text-sm text-gray-500">Menu Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                onClick={() => {/* Add new item logic */}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = `https://merchant.oishimenu.com/${merchantId}/dashboard`}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 
                    "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : 
                    "hover:bg-gray-50"
                  }
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id}
              className={`bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                !item.isAvailable ? 'opacity-60' : ''
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">{item.image}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {item.category}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={item.isAvailable ? "default" : "secondary"}
                    className={item.isAvailable ? 
                      "bg-green-100 text-green-800" : 
                      "bg-red-100 text-red-800"
                    }
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${item.price}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.prepTime}min
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {item.rating}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {item.orders} orders
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAvailability(item.id)}
                      className={item.isAvailable ? 
                        "text-red-600 hover:text-red-700 hover:bg-red-50" : 
                        "text-green-600 hover:text-green-700 hover:bg-green-50"
                      }
                    >
                      {item.isAvailable ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {/* Edit item logic */}}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No menu items found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first menu item'}
            </p>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
              onClick={() => {/* Add new item logic */}}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
