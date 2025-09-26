'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminUserHeader } from '@/components/admin/AdminUserHeader';
import { AdminUserInfo } from '@/components/admin/AdminUserInfo';
import { AdminUserRestaurants } from '@/components/admin/AdminUserRestaurants';
import { AdminUserOrders } from '@/components/admin/AdminUserOrders';

interface UserDetail {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastSignIn?: string;
  emailVerified: boolean;
  disabled: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  createdAt: string;
}

interface Order {
  id: string;
  tableId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminUserDetailPageRefactored() {
  const params = useParams();
  const userId = params.userId as string;
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Load user's restaurants first to get user info
        const restaurantsRef = collection(db, 'restaurants');
        const restaurantsQuery = query(
          restaurantsRef,
          where('ownerId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const restaurantsSnapshot = await getDocs(restaurantsQuery);
        const userRestaurants: Restaurant[] = [];
        
        restaurantsSnapshot.forEach((doc) => {
          const data = doc.data();
          userRestaurants.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            address: data.address,
            phone: data.phone,
            createdAt: data.createdAt.toDate().toISOString(),
          });
        });

        // Create user detail from restaurant data
        if (userRestaurants.length > 0) {
          const firstRestaurant = userRestaurants[0];
          const realUser: UserDetail = {
            uid: userId,
            email: `${userId}@example.com`,
            displayName: firstRestaurant.name || 'Unknown User',
            createdAt: firstRestaurant.createdAt || new Date().toISOString(),
            lastSignIn: new Date().toISOString(),
            emailVerified: true, // Assume verified for existing users
            disabled: false,
          };

          setUserDetail(realUser);
        }

        setRestaurants(userRestaurants);

        // Load user's orders
        const ordersRef = collection(db, 'orders');
        const ordersQuery = query(
          ordersRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        const userOrders: Order[] = [];
        
        ordersSnapshot.forEach((doc) => {
          const data = doc.data();
          userOrders.push({
            id: doc.id,
            tableId: data.tableId,
            customerName: data.customerName,
            total: data.total,
            status: data.status,
            createdAt: data.createdAt.toDate().toISOString(),
          });
        });

        setOrders(userOrders);

      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600">The requested user could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminUserHeader userDetail={userDetail} />
        <AdminUserInfo userDetail={userDetail} />
        <AdminUserRestaurants restaurants={restaurants} />
        <AdminUserOrders orders={orders} />
      </div>
    </div>
  );
}
