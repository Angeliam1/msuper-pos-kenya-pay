
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface ReceiptSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const ReceiptSettings: React.FC<ReceiptSettingsProps> = ({
  settings,
  onSettingChange
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Receipt Display Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showStoreName" className="text-sm">Show Store Name</Label>
              <Switch
                id="showStoreName"
                checked={settings.showStoreName}
                onCheckedChange={(checked) => onSettingChange('showStoreName', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showStoreAddress" className="text-sm">Show Store Address</Label>
              <Switch
                id="showStoreAddress"
                checked={settings.showStoreAddress}
                onCheckedChange={(checked) => onSettingChange('showStoreAddress', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showStorePhone" className="text-sm">Show Store Phone</Label>
              <Switch
                id="showStorePhone"
                checked={settings.showStorePhone}
                onCheckedChange={(checked) => onSettingChange('showStorePhone', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showCustomerName" className="text-sm">Show Customer Name</Label>
              <Switch
                id="showCustomerName"
                checked={settings.showCustomerName}
                onCheckedChange={(checked) => onSettingChange('showCustomerName', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showCustomerPhone" className="text-sm">Show Customer Phone</Label>
              <Switch
                id="showCustomerPhone"
                checked={settings.showCustomerPhone}
                onCheckedChange={(checked) => onSettingChange('showCustomerPhone', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showBarcode" className="text-sm">Show Barcode</Label>
              <Switch
                id="showBarcode"
                checked={settings.showBarcode}
                onCheckedChange={(checked) => onSettingChange('showBarcode', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Receipt Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="receiptHeader" className="text-sm">Receipt Header</Label>
            <Input
              id="receiptHeader"
              value={settings.receiptHeader}
              onChange={(e) => onSettingChange('receiptHeader', e.target.value)}
              placeholder="Thank you for shopping with us!"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="receiptFooter" className="text-sm">Receipt Footer</Label>
            <Input
              id="receiptFooter"
              value={settings.receiptFooter}
              onChange={(e) => onSettingChange('receiptFooter', e.target.value)}
              placeholder="Visit us again soon!"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="customLine1" className="text-sm">Custom Line 1 (e.g., Paybill Info)</Label>
            <Input
              id="customLine1"
              value={settings.customLine1 || ''}
              onChange={(e) => onSettingChange('customLine1', e.target.value)}
              placeholder="Paybill 247247 Acc 333337"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="customLine2" className="text-sm">Custom Line 2 (e.g., KRA Details)</Label>
            <Input
              id="customLine2"
              value={settings.customLine2 || ''}
              onChange={(e) => onSettingChange('customLine2', e.target.value)}
              placeholder="KRA PIN: P123456789A"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="additionalNotes" className="text-sm">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={settings.additionalNotes || ''}
              onChange={(e) => onSettingChange('additionalNotes', e.target.value)}
              placeholder="Any additional information you want to appear on receipts..."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
