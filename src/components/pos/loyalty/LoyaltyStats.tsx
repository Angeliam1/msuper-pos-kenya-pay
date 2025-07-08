
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Star, Gift, TrendingUp } from 'lucide-react';
import { Customer } from '@/types';

interface LoyaltyStatsProps {
  customers: Customer[];
}

export const LoyaltyStats: React.FC<LoyaltyStatsProps> = ({ customers }) => {
  const getCustomerLoyaltyPoints = (customer: Customer) => {
    return customer.loyaltyPoints || 0;
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => getCustomerLoyaltyPoints(c) > 0).length;
  const totalPointsIssued = customers.reduce((sum, c) => sum + getCustomerLoyaltyPoints(c), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold">{totalCustomers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Members</p>
              <p className="text-2xl font-bold">{activeCustomers}</p>
            </div>
            <Star className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Points Issued</p>
              <p className="text-2xl font-bold">{totalPointsIssued.toLocaleString()}</p>
            </div>
            <Gift className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold">{totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
