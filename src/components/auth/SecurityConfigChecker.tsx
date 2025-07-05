
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { validateEnvironment, refreshSupabaseClient } from '@/lib/supabase';

export const SecurityConfigChecker: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [envValidation, setEnvValidation] = useState(() => validateEnvironment());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Manual refresh triggered...');
    
    // Wait a moment to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh the Supabase client and validate environment
    refreshSupabaseClient();
    const newValidation = validateEnvironment();
    setEnvValidation(newValidation);
    setLastCheck(new Date());
    
    console.log('Manual refresh completed, validation result:', newValidation);
    
    if (newValidation.isValid) {
      // If valid now, reload the page to reinitialize the app
      window.location.reload();
    }
    
    setIsRefreshing(false);
  };

  if (envValidation.isValid) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Security configuration is properly set up.
        </AlertDescription>
      </Alert>
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
          <CardTitle className="text-xl text-red-800">Security Setup Required</CardTitle>
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
              Your application requires proper Supabase configuration to ensure security.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Missing Configuration:</h3>
            <ul className="space-y-2">
              {envValidation.issues.map((issue, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-blue-900">Setup Instructions:</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>1. Click the green Supabase button in the top right of Lovable</li>
              <li>2. Connect to your Supabase project or create a new one</li>
              <li>3. The environment variables will be automatically configured</li>
              <li>4. Click "Check Configuration" below to verify the setup</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Checking Configuration...' : 'Check Configuration Again'}
            </Button>
            
            <Button 
              className="w-full" 
              onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Supabase Integration Guide
            </Button>
          </div>

          <div className="text-xs text-gray-600 space-y-1 border-t pt-3">
            <p>• Environment variables are securely managed by Lovable</p>
            <p>• No sensitive data is stored in your codebase</p>
            <p>• All authentication is handled securely by Supabase</p>
            <p>• Configuration is checked automatically every 2 seconds initially</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
