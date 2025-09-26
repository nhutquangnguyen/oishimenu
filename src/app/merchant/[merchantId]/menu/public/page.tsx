'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PublicMenuHeader } from '@/components/merchant/PublicMenuHeader';
import { PublicMenuSearch } from '@/components/merchant/PublicMenuSearch';
import { PublicMenuItemCard } from '@/components/merchant/PublicMenuItemCard';
import { PublicMenuCart } from '@/components/merchant/PublicMenuCart';
import { Search } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  rating: number;
  prepTime: number;
  isFavorite?: boolean;
}

export default function PublicMenuPageRefactored() {
  const params = useParams();
  const merchantId = params.merchantId as string;
  const [merchant, setMerchant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMerchant = {
      id: merchantId,
      name: merchantId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      shortName: merchantId,
      description: 'Authentic Italian cuisine with fresh ingredients',
      location: '123 Main St, Your City, State 12345',
      phone: '(555) 123-4567',
      rating: 4.8,
      deliveryTime: '30-45 min',
      logo: '🍕'
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
        prepTime: 15,
        isFavorite: false
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
        prepTime: 15,
        isFavorite: true
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
        prepTime: 8,
        isFavorite: false
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
        prepTime: 12,
        isFavorite: false
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

  const handleAddToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCart(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  const handleToggleFavorite = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleCheckout = () => {
    // Implement checkout logic
    console.log('Proceeding to checkout...');
    setShowCart(false);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicMenuHeader merchant={merchant} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PublicMenuSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <PublicMenuItemCard
              key={item.id}
              item={item}
              cartQuantity={cart[item.id] || 0}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onToggleFavorite={handleToggleFavorite}
            />
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
            <p className="text-gray-600">
              Try adjusting your search terms or browse all categories
            </p>
          </div>
        )}
      </div>

      {/* Cart */}
      <PublicMenuCart
        cart={cart}
        menuItems={menuItems}
        showCart={showCart}
        setShowCart={setShowCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
