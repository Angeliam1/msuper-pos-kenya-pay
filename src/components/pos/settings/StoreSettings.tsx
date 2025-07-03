
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
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
        
        <div>
          <Label htmlFor="kraPin">KRA PIN</Label>
          <Input
            id="kraPin"
            value={settings.kraPin || ''}
            onChange={(e) => onSettingChange('kraPin', e.target.value)}
            placeholder="P123456789A"
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h4 className="font-medium">Payment Options</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mpesaPaybill">M-Pesa Paybill</Label>
              <Input
                id="mpesaPaybill"
                value={settings.mpesaPaybill || ''}
                onChange={(e) => onSettingChange('mpesaPaybill', e.target.value)}
                placeholder="247247"
              />
            </div>
            <div>
              <Label htmlFor="mpesaAccount">M-Pesa Account</Label>
              <Input
                id="mpesaAccount"
                value={settings.mpesaAccount || ''}
                onChange={(e) => onSettingChange('mpesaAccount', e.target.value)}
                placeholder="333337"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mpesaTill">M-Pesa Till Number</Label>
              <Input
                id="mpesaTill"
                value={settings.mpesaTill || ''}
                onChange={(e) => onSettingChange('mpesaTill', e.target.value)}
                placeholder="123456"
              />
            </div>
            <div>
              <Label htmlFor="bankAccount">Bank Account</Label>
              <Input
                id="bankAccount"
                value={settings.bankAccount || ''}
                onChange={(e) => onSettingChange('bankAccount', e.target.value)}
                placeholder="Bank Account Details"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="paymentInstructions">Payment Instructions</Label>
            <Textarea
              id="paymentInstructions"
              value={settings.paymentInstructions || ''}
              onChange={(e) => onSettingChange('paymentInstructions', e.target.value)}
              placeholder="Additional payment instructions..."
              rows={3}
            />
          </div>
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
