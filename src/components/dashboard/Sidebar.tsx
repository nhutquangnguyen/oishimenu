'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Menu, 
  ShoppingCart, 
  Table, 
  Settings, 
  BarChart3,
  Smartphone,
  LogOut,
  CreditCard,
  Building2,
  Shield,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Restaurants', href: '/dashboard/restaurants', icon: Building2 },
  { name: 'Menu Builder', href: '/dashboard/menu', icon: Menu },
  { name: 'POS', href: '/dashboard/pos', icon: CreditCard },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Tables', href: '/dashboard/tables', icon: Table },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { currentRestaurant, restaurants, setCurrentRestaurant } = useRestaurant();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Smart Menu AI</span>
        </div>
      </div>
      
      {/* Restaurant Selection */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Current Restaurant
          </label>
          {currentRestaurant ? (
            <Select 
              value={currentRestaurant.id} 
              onValueChange={(restaurantId) => {
                const restaurant = restaurants.find(r => r.id === restaurantId);
                if (restaurant) {
                  setCurrentRestaurant(restaurant);
                }
              }}
            >
              <SelectTrigger className="w-full h-9 text-sm">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{currentRestaurant.logo}</span>
                    <span className="truncate">{currentRestaurant.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{restaurant.logo}</span>
                      <div>
                        <div className="font-medium text-sm">{restaurant.name}</div>
                        {restaurant.address && (
                          <div className="text-xs text-gray-500 truncate max-w-32">
                            {restaurant.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500 py-2">
              No restaurant selected
            </div>
          )}
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500">Restaurant Owner</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
