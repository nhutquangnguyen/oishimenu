'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Trash2, 
  Eye, 
  Shield, 
  Mail, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { collection, query, getDocs, deleteDoc, doc, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getAllUsers, UserInfo, disableUserProfile, enableUserProfile } from '@/lib/userManagement';

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastSignIn?: string;
  emailVerified: boolean;
  disabled: boolean;
  restaurantCount: number;
  orderCount: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { admin: currentAdmin, isAdmin, isLoading: authLoading } = useAdminAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (isAdmin) {
        loadUsers();
      } else {
        // Redirect to admin login if not authenticated
        router.push('/admin/login');
      }
    }
  }, [isAdmin, authLoading, router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Get all users from the users collection (real data from database)
      const allUsers = await getAllUsers();
      
      // Get all restaurants to count per user
      const restaurantsRef = collection(db, 'restaurants');
      const restaurantsSnapshot = await getDocs(restaurantsRef);
      const restaurantCounts: Record<string, number> = {};
      
      restaurantsSnapshot.forEach((doc) => {
        const data = doc.data();
        const ownerId = data.ownerId;
        restaurantCounts[ownerId] = (restaurantCounts[ownerId] || 0) + 1;
      });

      // Get all orders to count per user
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      const orderCounts: Record<string, number> = {};
      
      ordersSnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.userId;
        orderCounts[userId] = (orderCounts[userId] || 0) + 1;
      });

      // Convert UserInfo to UserData format (include all users for admin management)
      const realUsers: UserData[] = allUsers
        .map((userInfo) => ({
          uid: userInfo.uid,
          email: userInfo.email,
          displayName: userInfo.displayName,
          createdAt: userInfo.createdAt.toISOString(),
          lastSignIn: userInfo.lastSignIn?.toISOString() || new Date().toISOString(),
          emailVerified: userInfo.emailVerified,
          disabled: userInfo.disabled,
          restaurantCount: restaurantCounts[userInfo.uid] || 0,
          orderCount: orderCounts[userInfo.uid] || 0,
        }));

      setUsers(realUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableUser = async () => {
    if (!selectedUser) return;

    // Prevent admin session issues
    if (!currentAdmin) {
      alert('❌ Admin session expired!\n\nPlease log in again to perform admin actions.');
      router.push('/admin/login');
      return;
    }

    try {
      setDisableLoading(true);

      console.log(`🚫 Admin: Starting disable process for: ${selectedUser.email}`);
      console.log(`🚫 Admin: User UID to disable: ${selectedUser.uid}`);
      console.log(`🚫 Admin: Current admin user: ${currentAdmin.email} (${currentAdmin.id})`);

      // Disable user profile in Firestore
      await disableUserProfile(selectedUser.uid);
      
      // Reload users to show updated status
      await loadUsers();
      setIsDisableDialogOpen(false);
      setSelectedUser(null);
      
      console.log('User disabled successfully');
      alert(`User ${selectedUser.email} has been disabled.\n\nThey can still login but will have limited access. Their data remains intact.`);
      
    } catch (error) {
      console.error('Error disabling user:', error);
    } finally {
      setDisableLoading(false);
    }
  };

  const handleEnableUser = async (user: UserData) => {
    try {
      console.log(`Enabling user: ${user.email}`);
      
      // Enable user profile in Firestore
      await enableUserProfile(user.uid);
      
      // Reload users to show updated status
      await loadUsers();
      
      console.log('User enabled successfully');
      alert(`User ${user.email} has been enabled.\n\nThey now have full access to the system.`);
      
    } catch (error) {
      console.error('Error enabling user:', error);
    }
  };


  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">Manage users, restaurants, and system access</p>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{users.filter(u => !u.disabled).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Disabled Users</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.disabled).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.emailVerified).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Search className="w-8 h-8 text-purple-600" />
                <div className="flex-1">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                  <div key={user.uid} className={`border rounded-lg p-4 hover:bg-gray-50 ${user.disabled ? 'bg-gray-50 border-gray-200' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{user.displayName || 'No Name'}</h3>
                          {user.emailVerified ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          {user.disabled && (
                            <Badge variant="destructive" className="text-xs">
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            Last sign in: {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {user.restaurantCount} restaurant{user.restaurantCount !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.orderCount} order{user.orderCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.disabled ? "destructive" : "default"}>
                          {user.disabled ? 'Disabled' : 'Active'}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        
                        {user.disabled ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEnableUser(user)}
                            className="text-green-600 hover:text-green-700 border-green-200"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Enable
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDisableDialogOpen(true);
                            }}
                            className="text-orange-600 hover:text-orange-700 border-orange-200"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Disable
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disable User Confirmation Dialog */}
        <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Disable User Account</span>
              </DialogTitle>
              <DialogDescription>
                This will disable <strong>{selectedUser?.email}</strong> from accessing the system.
              </DialogDescription>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="font-medium text-blue-900 mb-2">What happens when disabled:</div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• User can still login but with limited access</li>
                  <li>• All their data (restaurants, orders, menus) remains intact</li>
                  <li>• They can be re-enabled at any time</li>
                  <li>• This action is reversible</li>
                </ul>
              </div>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDisableDialogOpen(false)}
                disabled={disableLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDisableUser}
                disabled={disableLoading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {disableLoading ? 'Disabling...' : 'Disable User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
