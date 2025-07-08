
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Calendar, 
  RefreshCw, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const SubscriptionManager: React.FC = () => {
  const { 
    user, 
    subscriptionStatus, 
    subscriptionPlan, 
    isSubscriptionActive 
  } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const refreshSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      toast({
        title: "Subscription refreshed",
        description: "Your subscription status has been updated",
      });
      
      // Refresh the page to update the auth context
      window.location.reload();
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Refresh failed",
        description: "Unable to refresh subscription status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;
    
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Portal access failed",
        description: "Unable to access customer portal",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const getStatusIcon = () => {
    const status = subscriptionStatus as string;
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'past_due':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'trial':
        return <Crown className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    const status = subscriptionStatus as string;
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'past_due':
        return 'bg-orange-100 text-orange-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Please log in to view your subscription</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {subscriptionPlan ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1) : 'No Plan'}
                  </span>
                  {subscriptionPlan && (
                    <Badge className={getStatusColor()}>
                      {subscriptionStatus?.replace('_', ' ').toUpperCase() || 'INACTIVE'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {isSubscriptionActive 
                    ? 'Your subscription is active' 
                    : 'No active subscription'}
                </p>
              </div>
            </div>
            <Button
              onClick={refreshSubscription}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Refreshing...
                </div>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>

          {(subscriptionStatus as string) === 'past_due' && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Your subscription payment is overdue. Please update your payment method to continue using premium features.
              </AlertDescription>
            </Alert>
          )}

          {((subscriptionStatus as string) === 'cancelled' || !subscriptionStatus) && (
            <Alert>
              <AlertDescription>
                You don't have an active subscription. Subscribe to a plan to unlock premium features.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isSubscriptionActive && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Update your payment method, change your plan, or cancel your subscription through the customer portal.
            </p>
            <Button
              onClick={openCustomerPortal}
              disabled={portalLoading}
              className="w-full"
            >
              {portalLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Opening Portal...
                </div>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Customer Portal
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
