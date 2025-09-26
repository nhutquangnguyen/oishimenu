'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { generateDemoOrders } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function GenerateDataPage() {
  const { admin, isAdmin, isLoading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleGenerateData = async () => {
    if (!admin?.email) {
      setResult({ success: false, message: 'Admin not authenticated' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Generate demo orders for admin testing
      await generateDemoOrders('admin-demo', 'admin-user', admin.email);
      setResult({ 
        success: true, 
        message: `Successfully generated 50 demo orders for admin testing` 
      });
    } catch (error) {
      console.error('Error generating demo data:', error);
      setResult({ 
        success: false, 
        message: `Error generating demo data: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please sign in as admin to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Demo Data</CardTitle>
            <CardDescription>
              This page generates 50 demo orders for testing purposes.
              Generate demo data for analytics and testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Current Admin</h3>
              <p className="text-blue-800">Email: {admin?.email}</p>
              <p className="text-blue-800">Role: {admin?.role}</p>
            </div>

            {result && (
              <div className={`p-4 rounded-lg border ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                  )}
                  <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                    {result.message}
                  </p>
                </div>
              </div>
            )}

            <Button 
              onClick={handleGenerateData} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Demo Data...
                </>
              ) : (
                'Generate 50 Demo Orders'
              )}
            </Button>


            <div className="text-sm text-gray-600">
              <p><strong>Note:</strong> This will generate 50 realistic orders with:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Random menu items from different categories</li>
                <li>Various order statuses (pending, preparing, ready, delivered, cancelled)</li>
                <li>Different payment methods and customer names</li>
                <li>Orders spread over the last 30 days</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
