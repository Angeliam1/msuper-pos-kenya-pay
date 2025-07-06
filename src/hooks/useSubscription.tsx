
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface SubscriptionData {
  subscriptionStatus: 'active' | 'past_due' | 'cancelled' | 'suspended' | 'trial' | null;
  subscriptionPlan: 'basic' | 'premium' | 'enterprise' | null;
  tenantId: string | null;
  userRole: string | null;
  subscriptionEnd: Date | null;
  daysOverdue: number;
  gracePeriodEnds: Date | null;
}

export const useSubscription = (user: User | null = null) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscriptionStatus: null,
    subscriptionPlan: null,
    tenantId: null,
    userRole: null,
    subscriptionEnd: null,
    daysOverdue: 0,
    gracePeriodEnds: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = async () => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // First check subscription status via Stripe
      const { error: stripeError } = await supabase.functions.invoke('check-subscription');
      if (stripeError) {
        console.error('Stripe check error:', stripeError);
      }

      // Then get updated data from database
      const { data: tenantUserData, error: tenantError } = await supabase
        .from('tenant_users')
        .select(`
          tenant_id,
          role,
          tenants (
            subscription_status,
            subscription_plan,
            next_billing_date,
            days_overdue,
            grace_period_ends
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (tenantError) {
        console.error('Error fetching tenant data:', tenantError);
        setError('Failed to fetch subscription data');
        return;
      }

      if (tenantUserData && tenantUserData.tenants) {
        // Handle both array and single object cases
        const tenantData = Array.isArray(tenantUserData.tenants) 
          ? tenantUserData.tenants[0] 
          : tenantUserData.tenants;

        setSubscriptionData({
          subscriptionStatus: tenantData.subscription_status,
          subscriptionPlan: tenantData.subscription_plan,
          tenantId: tenantUserData.tenant_id,
          userRole: tenantUserData.role,
          subscriptionEnd: tenantData.next_billing_date 
            ? new Date(tenantData.next_billing_date) 
            : null,
          daysOverdue: tenantData.days_overdue || 0,
          gracePeriodEnds: tenantData.grace_period_ends 
            ? new Date(tenantData.grace_period_ends) 
            : null,
        });
      }

      setError(null);
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError('An error occurred while fetching subscription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [user?.id]);

  const refreshSubscription = () => {
    fetchSubscriptionData();
  };

  const isSubscriptionActive = subscriptionData.subscriptionStatus === 'active' || 
                              subscriptionData.subscriptionStatus === 'trial';

  const isInGracePeriod = subscriptionData.gracePeriodEnds && 
                         new Date() < subscriptionData.gracePeriodEnds;

  return {
    ...subscriptionData,
    loading,
    error,
    refreshSubscription,
    isSubscriptionActive,
    isInGracePeriod,
  };
};
