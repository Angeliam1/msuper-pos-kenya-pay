
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Receipt } from 'lucide-react';

interface ReceiptSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const ReceiptSettings: React.FC<ReceiptSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Receipt Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h4 className="font-medium">Receipt Header & Footer</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="receiptHeader">Header Message</Label>
              <Input
                id="receiptHeader"
                value={settings.receiptHeader}
                onChange={(e) => onSettingChange('receiptHeader', e.target.value)}
                placeholder="Thank you for shopping with us!"
              />
            </div>
            <div>
              <Label htmlFor="receiptFooter">Footer Message</Label>
              <Input
                id="receiptFooter"
                value={settings.receiptFooter}
                onChange={(e) => onSettingChange('receiptFooter', e.target.value)}
                placeholder="Visit us again soon!"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Store Information Display</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showStoreName">Show Store Name</Label>
              <Switch
                id="showStoreName"
                checked={settings.showStoreName}
                onCheckedChange={(checked) => onSettingChange('showStoreName', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showStoreAddress">Show Store Address</Label>
              <Switch
                id="showStoreAddress"
                checked={settings.showStoreAddress}
                onCheckedChange={(checked) => onSettingChange('showStoreAddress', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showStorePhone">Show Store Phone</Label>
              <Switch
                id="showStorePhone"
                checked={settings.showStorePhone}
                onCheckedChange={(checked) => onSettingChange('showStorePhone', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Customer Information Display</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showCustomerName">Show Customer Name</Label>
              <Switch
                id="showCustomerName"
                checked={settings.showCustomerName}
                onCheckedChange={(checked) => onSettingChange('showCustomerName', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showCustomerPhone">Show Customer Phone</Label>
              <Switch
                id="showCustomerPhone"
                checked={settings.showCustomerPhone}
                onCheckedChange={(checked) => onSettingChange('showCustomerPhone', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showCustomerAddress">Show Customer Address</Label>
              <Switch
                id="showCustomerAddress"
                checked={settings.showCustomerAddress}
                onCheckedChange={(checked) => onSettingChange('showCustomerAddress', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Additional Elements</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showNotes">Show Transaction Notes</Label>
              <Switch
                id="showNotes"
                checked={settings.showNotes}
                onCheckedChange={(checked) => onSettingChange('showNotes', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showBarcode">Show QR Code/Barcode</Label>
              <Switch
                id="showBarcode"
                checked={settings.showBarcode}
                onCheckedChange={(checked) => onSettingChange('showBarcode', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
