
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Plus, Edit, Users } from 'lucide-react';
import { Customer } from '@/types';

interface LoyaltyManagementProps {
  customers: Customer[];
  onUpdateCustomer: (id: string, data: Partial<Customer>) => void;
}

export const LoyaltyManagement: React.FC<LoyaltyManagementProps> = ({
  customers,
  onUpdateCustomer
}) => {
  const [pointsRate, setPointsRate] = useState(100); // 100 KES = 1 point
  const [rewardRate, setRewardRate] = useState(10); // 10 points = 1 KES

  const handleAdjustPoints = (customerId: string, points: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const currentPoints = (customer as any).loyaltyPoints || 0;
      onUpdateCustomer(customerId, { 
        ...customer,
        loyaltyPoints: Math.max(0, currentPoints + points)
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Loyalty Points Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Points Rate (KES per point)</Label>
              <Input
                type="number"
                value={pointsRate}
                onChange={(e) => setPointsRate(Number(e.target.value))}
                placeholder="100"
              />
              <p className="text-xs text-gray-500 mt-1">Customer earns 1 point for every {pointsRate} KES spent</p>
            </div>
            <div>
              <Label>Reward Rate (Points per KES)</Label>
              <Input
                type="number"
                value={rewardRate}
                onChange={(e) => setRewardRate(Number(e.target.value))}
                placeholder="10"
              />
              <p className="text-xs text-gray-500 mt-1">{rewardRate} points = 1 KES discount</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Loyalty Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map(customer => {
              const loyaltyPoints = (customer as any).loyaltyPoints || 0;
              return (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{customer.name}</h4>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                    <p className="text-sm font-semibold text-green-600">{loyaltyPoints} points</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAdjustPoints(customer.id, -10)}
                      disabled={loyaltyPoints < 10}
                    >
                      -10
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAdjustPoints(customer.id, 10)}
                    >
                      +10
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
