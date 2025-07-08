
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, Lock, AlertTriangle, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface SubscriptionGateProps {
  feature: string;
  requiredPlan?: 'basic' | 'premium' | 'enterprise';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  feature,
  requiredPlan = 'basic',
  children,
  fallback
}) => {
  const { canAccessFeature, subscriptionStatus, subscriptionPlan, isSubscriptionActive } = useAuth();

  const hasAccess = canAccessFeature(feature);

  // Show children if user has access
  if (hasAccess && isSubscriptionActive) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default subscription upgrade prompt
  const getUpgradeMessage = () => {
    const status = subscriptionStatus as string;
    
    if (status === 'past_due') {
      return {
        title: 'Payment Required',
        description: 'Your subscription payment is overdue. Please update your payment method to continue using premium features.',
        icon: <CreditCard className="h-5 w-5 text-orange-500" />,
        variant: 'destructive' as const
      };
    }

    if (status === 'suspended' || status === 'cancelled') {
      return {
        title: 'Subscription Suspended',
        description: 'Your subscription has been suspended. Please contact support or reactivate your subscription.',
        icon: <Lock className="h-5 w-5 text-red-500" />,
        variant: 'destructive' as const
      };
    }

    return {
      title: 'Premium Feature',
      description: `This feature requires a ${requiredPlan} plan or higher. Upgrade your subscription to unlock this functionality.`,
      icon: <Crown className="h-5 w-5 text-yellow-500" />,
      variant: 'default' as const
    };
  };

  const upgradeInfo = getUpgradeMessage();

  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          {upgradeInfo.icon}
        </div>
        <CardTitle className="text-lg">{upgradeInfo.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          {upgradeInfo.description}
        </p>
        
        {subscriptionPlan && (
          <Badge variant="outline">
            Current Plan: {subscriptionPlan.toUpperCase()}
          </Badge>
        )}

        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="outline">
            View Plans
          </Button>
          <Button size="sm">
            Upgrade Now
          </Button>
        </div>

        {subscriptionStatus === 'past_due' && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Access will be restored immediately after payment
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
