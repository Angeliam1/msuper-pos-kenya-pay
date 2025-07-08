
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoyaltySettingsData {
  pointsPerPurchase: number;
  pointsValue: number;
  minimumRedemption: number;
  bonusThreshold: number;
  bonusMultiplier: number;
}

export const LoyaltySettings: React.FC = () => {
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettingsData>({
    pointsPerPurchase: 1,
    pointsValue: 1,
    minimumRedemption: 100,
    bonusThreshold: 1000,
    bonusMultiplier: 2
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Program Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Points per KES 100 spent</Label>
            <Input
              type="number"
              value={loyaltySettings.pointsPerPurchase}
              onChange={(e) => setLoyaltySettings({
                ...loyaltySettings,
                pointsPerPurchase: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <Label>Point Value (KES)</Label>
            <Input
              type="number"
              value={loyaltySettings.pointsValue}
              onChange={(e) => setLoyaltySettings({
                ...loyaltySettings,
                pointsValue: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <Label>Minimum Redemption Points</Label>
            <Input
              type="number"
              value={loyaltySettings.minimumRedemption}
              onChange={(e) => setLoyaltySettings({
                ...loyaltySettings,
                minimumRedemption: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <Label>Bonus Threshold (KES)</Label>
            <Input
              type="number"
              value={loyaltySettings.bonusThreshold}
              onChange={(e) => setLoyaltySettings({
                ...loyaltySettings,
                bonusThreshold: Number(e.target.value)
              })}
            />
          </div>
        </div>
        <Button className="w-full">Save Settings</Button>
      </CardContent>
    </Card>
  );
};
