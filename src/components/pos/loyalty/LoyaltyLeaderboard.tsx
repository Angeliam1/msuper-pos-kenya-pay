
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, Award, Crown } from 'lucide-react';
import { Customer } from '@/types';

interface LoyaltyLeaderboardProps {
  customers: Customer[];
}

export const LoyaltyLeaderboard: React.FC<LoyaltyLeaderboardProps> = ({ customers }) => {
  const getCustomerLoyaltyPoints = (customer: Customer) => {
    return customer.loyaltyPoints || 0;
  };

  const getCustomerTier = (points: number) => {
    if (points >= 5000) return { name: 'Platinum', color: 'bg-purple-100 text-purple-800', icon: Crown };
    if (points >= 2000) return { name: 'Gold', color: 'bg-yellow-100 text-yellow-800', icon: Trophy };
    if (points >= 500) return { name: 'Silver', color: 'bg-gray-100 text-gray-800', icon: Award };
    return { name: 'Bronze', color: 'bg-orange-100 text-orange-800', icon: Star };
  };

  const topCustomers = [...customers]
    .sort((a, b) => getCustomerLoyaltyPoints(b) - getCustomerLoyaltyPoints(a))
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topCustomers.map((customer, index) => {
            const points = getCustomerLoyaltyPoints(customer);
            const tier = getCustomerTier(points);
            const TierIcon = tier.icon;

            return (
              <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{customer.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={tier.color}>
                        <TierIcon className="h-3 w-3 mr-1" />
                        {tier.name}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{points} pts</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
