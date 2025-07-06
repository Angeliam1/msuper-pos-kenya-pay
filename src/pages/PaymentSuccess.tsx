
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!user || !sessionId) {
        setVerifying(false);
        return;
      }

      try {
        const { error } = await supabase.functions.invoke('check-subscription');
        if (error) throw error;
        
        setVerified(true);
        toast({
          title: "Payment successful!",
          description: "Your subscription has been activated",
        });
      } catch (error) {
        console.error('Verification error:', error);
        toast({
          title: "Verification failed",
          description: "Payment received but verification failed. Contact support if issues persist.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [user, sessionId, toast]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {verifying ? (
              <RefreshCw className="h-12 w-12 text-blue-500 animate-spin" />
            ) : (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {verifying ? 'Verifying Payment...' : 'Payment Successful!'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {verifying ? (
            <p className="text-gray-600">
              Please wait while we verify your payment and activate your subscription.
            </p>
          ) : (
            <>
              <p className="text-gray-600">
                {verified 
                  ? 'Your subscription has been successfully activated. You now have access to all premium features!'
                  : 'Your payment has been processed. It may take a few minutes for your subscription to be fully activated.'
                }
              </p>
              
              <Button onClick={handleGoHome} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
