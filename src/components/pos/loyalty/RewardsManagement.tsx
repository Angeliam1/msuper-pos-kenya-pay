
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift } from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  isActive: boolean;
}

export const RewardsManagement: React.FC = () => {
  const [rewards] = useState<Reward[]>([
    { id: '1', name: '5% Discount', pointsCost: 100, description: '5% off next purchase', isActive: true },
    { id: '2', name: '10% Discount', pointsCost: 200, description: '10% off next purchase', isActive: true },
    { id: '3', name: 'Free Item', pointsCost: 500, description: 'One free item up to KES 100', isActive: true },
    { id: '4', name: 'VIP Status', pointsCost: 1000, description: 'VIP customer status for 30 days', isActive: true }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map(reward => (
            <Card key={reward.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{reward.name}</h4>
                <Badge variant={reward.isActive ? "default" : "secondary"}>
                  {reward.pointsCost} pts
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                disabled={!reward.isActive}
              >
                <Gift className="h-4 w-4 mr-2" />
                Redeem
              </Button>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
