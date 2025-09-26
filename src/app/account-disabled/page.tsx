'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  XCircle,
  Mail,
  ArrowLeft,
  Phone,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function AccountDisabledPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'Unknown';
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'checking' | 'disabled' | 'enabled' | 'error'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check account status on component mount
  useEffect(() => {
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    setIsRefreshing(true);
    setAccountStatus('checking');
    try {
      const { getUserByEmail } = await import('@/lib/userManagement');
      const userProfile = await getUserByEmail(email);

      if (!userProfile) {
        setAccountStatus('error');
        toast.error('Unable to find user account. Please contact admin.');
        return;
      }

      if (userProfile.disabled) {
        setAccountStatus('disabled');
        toast.info('Account status checked. Still disabled. Contact admin if this is incorrect.');
      } else {
        setAccountStatus('enabled');
        toast.success('Good news! Your account has been reactivated. Please try logging in again.');
        // Give user time to see the message before redirecting
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking account status:', error);
      setAccountStatus('error');
      toast.error('Unable to check account status. Please try again later.');
    } finally {
      setIsRefreshing(false);
      setLastChecked(new Date());
    }
  };

  const handleContactAdmin = () => {
    // Copy admin email to clipboard
    navigator.clipboard.writeText('nguyenquang.btr@gmail.com');
    toast.success('Admin email copied to clipboard!');
  };

  const handleRefreshStatus = async () => {
    await checkAccountStatus();
  };

  const handleReturnToLogin = () => {
    router.push('/auth/signin');
  };

  const supportOptions = [
    {
      title: 'Email Admin',
      description: 'Send an email to request account reactivation',
      icon: Mail,
      action: handleContactAdmin,
      primary: true
    },
    {
      title: 'Call Support',
      description: 'Speak directly with our support team',
      icon: Phone,
      action: () => {
        navigator.clipboard.writeText('+1 (555) 123-4567');
        toast.success('Support phone number copied to clipboard!');
      },
      primary: false
    },
    {
      title: 'Live Chat',
      description: 'Chat with support (Available 9AM-5PM)',
      icon: MessageSquare,
      action: () => toast.info('Live chat coming soon!'),
      primary: false
    }
  ];

  const getStatusIcon = () => {
    switch (accountStatus) {
      case 'checking':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'disabled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'enabled':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (accountStatus) {
      case 'checking':
        return 'Checking account status...';
      case 'disabled':
        return 'Account is currently disabled';
      case 'enabled':
        return 'Account has been reactivated!';
      case 'error':
        return 'Unable to check account status';
      default:
        return 'Account status unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600 font-bold">Account Disabled</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Your account has been temporarily disabled by an administrator
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Account Status */}
          <Alert className={accountStatus === 'enabled' ? 'border-green-200 bg-green-50' : accountStatus === 'error' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span><strong>Account:</strong> {email}</span>
                  <Badge variant={accountStatus === 'enabled' ? 'default' : accountStatus === 'error' ? 'secondary' : 'destructive'}>
                    {getStatusMessage()}
                  </Badge>
                </div>
              </AlertDescription>
            </div>
          </Alert>

          {/* Last Checked Info */}
          {lastChecked && (
            <div className="text-xs text-gray-500 text-center">
              <Clock className="w-3 h-3 inline mr-1" />
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}

          {/* Why this happened */}
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Common reasons for account disabling:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Violation of terms of service</li>
              <li>Suspicious activity detected</li>
              <li>Administrative review in progress</li>
              <li>Account security concerns</li>
            </ul>
          </div>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Notice:</strong> Your account has been disabled for security reasons. 
              Contact support to resolve this issue and restore access to your account.
            </AlertDescription>
          </Alert>

          {/* Support Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Get Help:</h3>
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={index}
                  variant={option.primary ? "default" : "outline"}
                  className="w-full justify-start h-auto p-3"
                  onClick={option.action}
                >
                  <IconComponent className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{option.title}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isRefreshing ? 'Checking Status...' : 'Check Account Status'}
            </Button>

            {accountStatus === 'enabled' && (
              <Button
                variant="default"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleReturnToLogin}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Account Reactivated - Try Login Again
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full border-blue-200 hover:bg-blue-50"
              onClick={handleReturnToLogin}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>

          {/* Footer */}
          <div className="text-xs text-center text-gray-500 pt-4 border-t">
            <p>Your data is safe and will be restored when your account is reactivated.</p>
            <p className="mt-1">Reference ID: {email.split('@')[0]}-{Date.now()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
