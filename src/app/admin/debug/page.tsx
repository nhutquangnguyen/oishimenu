'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAllUsers } from '@/lib/userManagement';

export default function AdminDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    runDebugTests();
  }, []);

  const runDebugTests = async () => {
    const debugResults: any = {};
    const errorList: string[] = [];

    try {
      console.log('🔍 Starting admin debug tests...');

      // Test 1: Check Firebase Auth state
      console.log('1. Checking Firebase Auth state...');
      debugResults.firebaseAuth = {
        currentUser: null,
        isAuthenticated: false
      };

      // Test 2: Try to access users collection directly
      console.log('2. Testing direct users collection access...');
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        debugResults.usersCollection = {
          success: true,
          count: usersSnapshot.size,
          error: null
        };
        console.log(`✅ Users collection: ${usersSnapshot.size} documents`);
      } catch (error: any) {
        debugResults.usersCollection = {
          success: false,
          count: 0,
          error: error.message
        };
        errorList.push(`Users collection: ${error.message}`);
        console.error(`❌ Users collection error:`, error);
      }

      // Test 3: Try to access restaurants collection
      console.log('3. Testing restaurants collection access...');
      try {
        const restaurantsRef = collection(db, 'restaurants');
        const restaurantsSnapshot = await getDocs(restaurantsRef);
        debugResults.restaurantsCollection = {
          success: true,
          count: restaurantsSnapshot.size,
          error: null
        };
        console.log(`✅ Restaurants collection: ${restaurantsSnapshot.size} documents`);
      } catch (error: any) {
        debugResults.restaurantsCollection = {
          success: false,
          count: 0,
          error: error.message
        };
        errorList.push(`Restaurants collection: ${error.message}`);
        console.error(`❌ Restaurants collection error:`, error);
      }

      // Test 4: Try to access orders collection
      console.log('4. Testing orders collection access...');
      try {
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        debugResults.ordersCollection = {
          success: true,
          count: ordersSnapshot.size,
          error: null
        };
        console.log(`✅ Orders collection: ${ordersSnapshot.size} documents`);
      } catch (error: any) {
        debugResults.ordersCollection = {
          success: false,
          count: 0,
          error: error.message
        };
        errorList.push(`Orders collection: ${error.message}`);
        console.error(`❌ Orders collection error:`, error);
      }

      // Test 5: Try getAllUsers function
      console.log('5. Testing getAllUsers function...');
      try {
        const allUsers = await getAllUsers();
        debugResults.getAllUsers = {
          success: true,
          count: allUsers.length,
          error: null
        };
        console.log(`✅ getAllUsers: ${allUsers.length} users`);
      } catch (error: any) {
        debugResults.getAllUsers = {
          success: false,
          count: 0,
          error: error.message
        };
        errorList.push(`getAllUsers: ${error.message}`);
        console.error(`❌ getAllUsers error:`, error);
      }

      // Test 6: Check admin collection
      console.log('6. Testing admins collection access...');
      try {
        const adminsRef = collection(db, 'admins');
        const adminsSnapshot = await getDocs(adminsRef);
        debugResults.adminsCollection = {
          success: true,
          count: adminsSnapshot.size,
          error: null
        };
        console.log(`✅ Admins collection: ${adminsSnapshot.size} documents`);
      } catch (error: any) {
        debugResults.adminsCollection = {
          success: false,
          count: 0,
          error: error.message
        };
        errorList.push(`Admins collection: ${error.message}`);
        console.error(`❌ Admins collection error:`, error);
      }

    } catch (error: any) {
      console.error('❌ Debug test failed:', error);
      errorList.push(`General error: ${error.message}`);
    }

    setDebugInfo(debugResults);
    setErrors(errorList);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Running debug tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Debug Results</h1>
          <p className="text-gray-600">Testing admin system access to Firestore collections</p>
        </div>

        {/* Debug Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Collection Access Tests</CardTitle>
              <CardDescription>Direct Firestore collection access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(debugInfo).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-medium">{key}</span>
                    <div className="flex items-center space-x-2">
                      {value.success ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 text-sm">{value.count} docs</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-600 text-sm">Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Details</CardTitle>
              <CardDescription>Specific error messages</CardDescription>
            </CardHeader>
            <CardContent>
              {errors.length > 0 ? (
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {error}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-green-600 text-sm">No errors found!</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Based on debug results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {errors.length === 0 ? (
                <div className="text-green-600">
                  ✅ All tests passed! Admin system should work correctly.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-red-600 font-medium">Issues found:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="font-medium text-yellow-800">Next Steps:</div>
                    <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
                      <li>Check Firestore rules deployment</li>
                      <li>Verify admin email in rules</li>
                      <li>Check Firebase project configuration</li>
                      <li>Ensure admin system is properly initialized</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button onClick={runDebugTests} className="mr-4">
            Run Tests Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/admin'}>
            Back to Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
