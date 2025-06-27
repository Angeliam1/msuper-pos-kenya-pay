
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Store, Receipt, Printer, Shield, Palette, Globe, Clock } from 'lucide-react';

interface SettingsProps {
  onSaveSettings: (settings: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: 'MSUPER Store',
    storeAddress: '123 Main Street, Nairobi, Kenya',
    storePhone: '+254 700 000 000',
    storeEmail: 'info@msuper.com',
    taxRate: 16,
    currency: 'KES',
    
    // Receipt Settings
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Visit us again soon!',
    showBarcode: true,
    showLogo: false,
    
    // System Settings
    lowStockThreshold: 10,
    autoBackup: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    
    // Appearance
    theme: 'light',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Security
    requirePasswordChange: false,
    twoFactorAuth: false,
    maxLoginAttempts: 5,
    
    // Printer Settings
    printerEnabled: true,
    printerName: 'Default Printer',
    paperSize: '80mm',
    printCopies: 1
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSaveSettings(settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="receipt" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Receipt
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => handleSettingChange('storeName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => handleSettingChange('storePhone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="storeAddress">Address</Label>
                <Input
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => handleSettingChange('storeAddress', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="storeEmail">Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleSettingChange('storeEmail', e.target.value)}
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
                    onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
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
        </TabsContent>

        <TabsContent value="receipt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="receiptHeader">Receipt Header</Label>
                <Input
                  id="receiptHeader"
                  value={settings.receiptHeader}
                  onChange={(e) => handleSettingChange('receiptHeader', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="receiptFooter">Receipt Footer</Label>
                <Input
                  id="receiptFooter"
                  value={settings.receiptFooter}
                  onChange={(e) => handleSettingChange('receiptFooter', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showBarcode">Show Barcode on Receipt</Label>
                <Switch
                  id="showBarcode"
                  checked={settings.showBarcode}
                  onCheckedChange={(checked) => handleSettingChange('showBarcode', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showLogo">Show Logo on Receipt</Label>
                <Switch
                  id="showLogo"
                  checked={settings.showLogo}
                  onCheckedChange={(checked) => handleSettingChange('showLogo', checked)}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paperSize">Paper Size</Label>
                  <Select value={settings.paperSize} onValueChange={(value) => handleSettingChange('paperSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58mm">58mm</SelectItem>
                      <SelectItem value="80mm">80mm</SelectItem>
                      <SelectItem value="A4">A4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="printCopies">Print Copies</Label>
                  <Input
                    id="printCopies"
                    type="number"
                    min="1"
                    max="5"
                    value={settings.printCopies}
                    onChange={(e) => handleSettingChange('printCopies', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lowStockThreshold">Default Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoBackup">Auto Backup</Label>
                <Switch
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                />
              </div>
              <div>
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every Hour</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="requirePasswordChange">Require Password Change</Label>
                <Switch
                  id="requirePasswordChange"
                  checked={settings.requirePasswordChange}
                  onCheckedChange={(checked) => handleSettingChange('requirePasswordChange', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>
              <div>
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
