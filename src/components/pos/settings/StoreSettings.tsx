
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Store } from 'lucide-react';

interface StoreSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Store Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={settings.storeName}
              onChange={(e) => onSettingChange('storeName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="storePhone">Phone Number</Label>
            <Input
              id="storePhone"
              value={settings.storePhone}
              onChange={(e) => onSettingChange('storePhone', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="storeAddress">Address</Label>
          <Input
            id="storeAddress"
            value={settings.storeAddress}
            onChange={(e) => onSettingChange('storeAddress', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="storeEmail">Email</Label>
          <Input
            id="storeEmail"
            type="email"
            value={settings.storeEmail}
            onChange={(e) => onSettingChange('storeEmail', e.target.value)}
          />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              value={settings.taxRate}
              onChange={(e) => onSettingChange('taxRate', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={settings.currency} onValueChange={(value) => onSettingChange('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
