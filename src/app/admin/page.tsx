'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Building2, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getAllUsers } from '@/lib/userManagement';

interface AdminStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  activeUsers: number;
  recentSignups: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { admin, isAdmin, isLoading: authLoading, logout } = useAdminAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    activeUsers: 0,
    recentSignups: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (isAdmin) {
        loadAdminStats();
      } else {
        // Redirect to admin login if not authenticated
        router.push('/admin/login');
      }
    }
  }, [isAdmin, authLoading, router]);

  const loadAdminStats = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading admin stats...');
      
      // Initialize stats with default values
      let totalUsers = 0;
      let totalRestaurants = 0;
      let totalOrders = 0;
      let totalRevenue = 0;
      let activeUsers = 0;
      let recentSignups = 0;

      // Try to get users data
      try {
        console.log('📊 Loading users data...');
        const allUsers = await getAllUsers();
        totalUsers = allUsers.length;
        activeUsers = allUsers.filter(user => !user.disabled).length;
        
        // Calculate recent signups (users created in last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        recentSignups = allUsers.filter(user => 
          user.createdAt > oneWeekAgo
        ).length;
        
        console.log(`✅ Users loaded: ${totalUsers} total, ${activeUsers} active`);
      } catch (error: any) {
        console.error('❌ Error loading users:', error.message);
        // Continue with other data
      }
      
      // Try to get restaurants data
      try {
        console.log('🏪 Loading restaurants data...');
        const restaurantsRef = collection(db, 'restaurants');
        const restaurantsSnapshot = await getDocs(restaurantsRef);
        totalRestaurants = restaurantsSnapshot.size;
        console.log(`✅ Restaurants loaded: ${totalRestaurants}`);
      } catch (error: any) {
        console.error('❌ Error loading restaurants:', error.message);
        // Continue with other data
      }

      // Try to get orders data
      try {
        console.log('🛒 Loading orders data...');
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        totalOrders = ordersSnapshot.size;

        // Calculate total revenue
        ordersSnapshot.forEach((doc) => {
          const data = doc.data();
          totalRevenue += data.total || 0;
        });
        
        console.log(`✅ Orders loaded: ${totalOrders}, Revenue: $${totalRevenue.toFixed(2)}`);
      } catch (error: any) {
        console.error('❌ Error loading orders:', error.message);
        // Continue with other data
      }

      const realStats: AdminStats = {
        totalUsers,
        totalRestaurants,
        totalOrders,
        activeUsers,
        recentSignups,
        totalRevenue,
      };

      console.log('📈 Final stats:', realStats);
      setStats(realStats);
    } catch (error: any) {
      console.error('❌ Error loading admin stats:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Set default stats even if there's an error
      setStats({
        totalUsers: 0,
        totalRestaurants: 0,
        totalOrders: 0,
        activeUsers: 0,
        recentSignups: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

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
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin panel.</p>
            <Button onClick={() => router.push('/admin/login')} className="mt-4">
              Go to Login
            </Button>
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
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">System overview and management tools</p>
                {admin && (
                  <p className="text-sm text-gray-500">Logged in as: {admin.email} ({admin.role})</p>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-green-600">+{stats.recentSignups} this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Building2 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Restaurants</p>
                  <p className="text-2xl font-bold">{stats.totalRestaurants}</p>
                  <p className="text-xs text-gray-500">Active locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-xs text-gray-500">All time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Generated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Active Users</p>
                    <p className="text-sm text-gray-600">{stats.activeUsers} of {stats.totalUsers} users</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Healthy</span>
                  </div>
                </div>
                <Link href="/admin/users">
                  <Button className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Restaurant Overview
              </CardTitle>
              <CardDescription>Monitor restaurant activity and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Total Restaurants</p>
                    <p className="text-sm text-gray-600">{stats.totalRestaurants} active locations</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600">Active</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Authentication</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">New User Signups</p>
                  <p className="text-gray-600">+{stats.recentSignups} this week</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Orders Processed</p>
                  <p className="text-gray-600">{stats.totalOrders} total</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Revenue Generated</p>
                  <p className="text-gray-600">${stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
                <Link href="/admin/debug">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Debug Admin Access
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
