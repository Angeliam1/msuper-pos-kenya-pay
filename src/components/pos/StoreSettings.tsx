
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, Store, CreditCard, Receipt, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoreSettingsProps {
  businessName: string;
  onBusinessNameChange: (name: string) => void;
}

interface StoreConfig {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
  currency: string;
  taxRate: number;
  receiptHeader: string;
  receiptFooter: string;
  mpesaPaybill: string;
  mpesaAccount: string;
  mpesaTill: string;
  enableLowStockAlert: boolean;
  lowStockThreshold: number;
  enableReceipts: boolean;
  autoBackup: boolean;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({ 
  businessName, 
  onBusinessNameChange 
}) => {
  const { toast } = useToast();

  const [config, setConfig] = useState<StoreConfig>({
    businessName: businessName,
    address: '',
    phone: '',
    email: '',
    taxNumber: '',
    currency: 'KES',
    taxRate: 16,
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Please visit again',
    mpesaPaybill: '',
    mpesaAccount: '',
    mpesaTill: '',
    enableLowStockAlert: true,
    lowStockThreshold: 10,
    enableReceipts: true,
    autoBackup: false
  });

  const handleSave = () => {
    // Save configuration to localStorage
    localStorage.setItem('storeConfig', JSON.stringify(config));
    
    // Update business name in parent component
    onBusinessNameChange(config.businessName);
    
    toast({
      title: "Settings Saved",
      description: "Store configuration has been updated successfully",
    });
  };

  const handleConfigChange = (key: keyof StoreConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Load saved configuration on component mount
  React.useEffect(() => {
    const savedConfig = localStorage.getItem('storeConfig');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Store Settings</h2>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={config.businessName}
                onChange={(e) => handleConfigChange('businessName', e.target.value)}
                placeholder="Enter business name"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={config.address}
                onChange={(e) => handleConfigChange('address', e.target.value)}
                placeholder="Enter business address"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={config.phone}
                  onChange={(e) => handleConfigChange('phone', e.target.value)}
                  placeholder="+254..."
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={config.email}
                  onChange={(e) => handleConfigChange('email', e.target.value)}
                  placeholder="business@example.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="taxNumber">Tax Number (KRA PIN)</Label>
              <Input
                id="taxNumber"
                value={config.taxNumber}
                onChange={(e) => handleConfigChange('taxNumber', e.target.value)}
                placeholder="P123456789A"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={config.currency} onValueChange={(value) => handleConfigChange('currency', value)}>
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
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={config.taxRate}
                  onChange={(e) => handleConfigChange('taxRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="mpesaPaybill">M-Pesa Paybill</Label>
              <Input
                id="mpesaPaybill"
                value={config.mpesaPaybill}
                onChange={(e) => handleConfigChange('mpesaPaybill', e.target.value)}
                placeholder="247247"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mpesaAccount">M-Pesa Account</Label>
                <Input
                  id="mpesaAccount"
                  value={config.mpesaAccount}
                  onChange={(e) => handleConfigChange('mpesaAccount', e.target.value)}
                  placeholder="Account number"
                />
              </div>
              <div>
                <Label htmlFor="mpesaTill">M-Pesa Till</Label>
                <Input
                  id="mpesaTill"
                  value={config.mpesaTill}
                  onChange={(e) => handleConfigChange('mpesaTill', e.target.value)}
                  placeholder="Till number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Receipt Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableReceipts">Enable Receipts</Label>
                <p className="text-sm text-gray-500">Print receipts for transactions</p>
              </div>
              <Switch
                id="enableReceipts"
                checked={config.enableReceipts}
                onCheckedChange={(checked) => handleConfigChange('enableReceipts', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="receiptHeader">Receipt Header</Label>
              <Input
                id="receiptHeader"
                value={config.receiptHeader}
                onChange={(e) => handleConfigChange('receiptHeader', e.target.value)}
                placeholder="Thank you for shopping with us!"
              />
            </div>
            
            <div>
              <Label htmlFor="receiptFooter">Receipt Footer</Label>
              <Input
                id="receiptFooter"
                value={config.receiptFooter}
                onChange={(e) => handleConfigChange('receiptFooter', e.target.value)}
                placeholder="Please visit again"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableLowStockAlert">Low Stock Alerts</Label>
                <p className="text-sm text-gray-500">Get notified when products are running low</p>
              </div>
              <Switch
                id="enableLowStockAlert"
                checked={config.enableLowStockAlert}
                onCheckedChange={(checked) => handleConfigChange('enableLowStockAlert', checked)}
              />
            </div>
            
            {config.enableLowStockAlert && (
              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={config.lowStockThreshold}
                  onChange={(e) => handleConfigChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                  min="1"
                  placeholder="10"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoBackup">Auto Backup</Label>
                <p className="text-sm text-gray-500">Automatically backup data daily</p>
              </div>
              <Switch
                id="autoBackup"
                checked={config.autoBackup}
                onCheckedChange={(checked) => handleConfigChange('autoBackup', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
