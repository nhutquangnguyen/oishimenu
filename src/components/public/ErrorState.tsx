'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {error}
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={handleRefresh}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
