
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    priceId: 'price_basic_monthly', // Replace with actual Stripe price ID
    icon: <Zap className="h-6 w-6" />,
    description: 'Perfect for small businesses getting started',
    features: [
      'Single store management',
      'Basic inventory tracking',
      'Standard reports',
      'Email support',
      'Up to 1,000 products',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 59,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    icon: <Crown className="h-6 w-6" />,
    description: 'Best for growing businesses',
    features: [
      'Multi-store management',
      'Advanced inventory tracking',
      'Advanced reports & analytics',
      'Priority support',
      'Up to 5,000 products',
      'API access',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    priceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
    icon: <Building className="h-6 w-6" />,
    description: 'For large businesses with advanced needs',
    features: [
      'Unlimited stores',
      'Custom integrations',
      'White-label options',
      'Dedicated support',
      'Unlimited products',
      'Custom reporting',
      'Priority feature requests',
    ],
  },
];

export const PaymentPlans: React.FC = () => {
  const { user, subscriptionPlan } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    setLoading(plan.id);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: plan.priceId,
          plan: plan.id,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "Unable to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your business needs. All plans include our core POS features
          with varying levels of advanced functionality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id || subscriptionPlan === plan.id}
                className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              >
                {loading === plan.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : subscriptionPlan === plan.id ? (
                  'Current Plan'
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
