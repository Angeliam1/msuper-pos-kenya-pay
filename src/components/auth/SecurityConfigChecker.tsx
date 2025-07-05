
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const SecurityConfigChecker: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const checkConnection = async () => {
    console.log('Checking Supabase connection...');
    
    try {
      if (supabase) {
        // Try to make a simple query to test connection
        const { error } = await supabase.auth.getSession();
        if (!error) {
          console.log('Supabase connection successful');
          setIsConnected(true);
          return true;
        }
      }
    } catch (error) {
      console.log('Supabase connection failed:', error);
    }
    
    setIsConnected(false);
    return false;
  };

  useEffect(() => {
    const initialCheck = async () => {
      const connected = await checkConnection();
      setLastCheck(new Date());
      
      if (connected) {
        // If connected, reload the page to restart the app
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    initialCheck();

    // Auto-retry every 5 seconds for the first minute
    if (retryCount < 12) {
      const timeoutId = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        initialCheck();
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [retryCount]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Manual refresh triggered...');
    
    // Wait a moment to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const connected = await checkConnection();
    setLastCheck(new Date());
    
    if (connected) {
      // If connected now, reload the page
      window.location.reload();
    } else {
      setIsRefreshing(false);
    }
  };

  if (isConnected) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Connection Established
            </Badge>
            <CardTitle className="text-xl text-green-800">Supabase Connected</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-green-700 mb-4">
              Your application is now properly configured and secure.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600">Initializing application...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-red-600" />
            <Badge variant="destructive">Configuration Required</Badge>
          </div>
          <CardTitle className="text-xl text-red-800">Supabase Setup Required</CardTitle>
          {lastCheck && (
            <p className="text-xs text-gray-500 mt-2">
              Last checked: {lastCheck.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your POS system needs to connect to Supabase for secure operation.
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-blue-900">Quick Setup:</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>1. Click the <strong>green Supabase button</strong> in the top right of Lovable</li>
              <li>2. Connect to your existing Supabase project or create a new one</li>
              <li>3. Wait for the automatic configuration to complete</li>
              <li>4. Your POS system will automatically restart</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Checking Connection...' : 'Check Connection'}
            </Button>
            
            <Button 
              className="w-full" 
              onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Setup Guide
            </Button>
          </div>

          {retryCount > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-600">
                Auto-checking connection... (Attempt {retryCount}/12)
              </p>
            </div>
          )}

          <div className="text-xs text-gray-600 space-y-1 border-t pt-3">
            <p>• This system requires Supabase for secure authentication</p>
            <p>• All data is encrypted and stored securely</p>
            <p>• Setup takes less than 2 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
