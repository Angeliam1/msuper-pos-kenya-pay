
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Store, Receipt, Printer, Shield, Palette, Globe, Clock, Bluetooth, Wifi } from 'lucide-react';

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
    printerConnectionType: 'bluetooth',
    bluetoothPrinterName: '',
    bluetoothPrinterAddress: '',
    ethernetPrinterIP: '192.168.1.100',
    ethernetPrinterPort: '9100',
    usbPrinterName: 'Default Printer',
    paperSize: '80mm',
    printCopies: 1,
    autoPrint: false,
    printTimeout: 30
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSaveSettings(settings);
  };

  const handleTestPrint = () => {
    console.log('Testing printer connection with settings:', {
      connectionType: settings.printerConnectionType,
      bluetooth: {
        name: settings.bluetoothPrinterName,
        address: settings.bluetoothPrinterAddress
      },
      ethernet: {
        ip: settings.ethernetPrinterIP,
        port: settings.ethernetPrinterPort
      },
      usb: {
        name: settings.usbPrinterName
      }
    });
    // Here you would implement actual printer testing
    alert('Test print sent to printer!');
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="receipt" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Receipt
          </TabsTrigger>
          <TabsTrigger value="printer" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Printer
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="printer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Printer Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="printerEnabled">Enable Printer</Label>
                <Switch
                  id="printerEnabled"
                  checked={settings.printerEnabled}
                  onCheckedChange={(checked) => handleSettingChange('printerEnabled', checked)}
                />
              </div>
              
              {settings.printerEnabled && (
                <>
                  <Separator />
                  <div>
                    <Label htmlFor="printerConnectionType">Connection Type</Label>
                    <Select value={settings.printerConnectionType} onValueChange={(value) => handleSettingChange('printerConnectionType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bluetooth">
                          <div className="flex items-center gap-2">
                            <Bluetooth className="h-4 w-4" />
                            Bluetooth
                          </div>
                        </SelectItem>
                        <SelectItem value="ethernet">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4" />
                            Ethernet/WiFi
                          </div>
                        </SelectItem>
                        <SelectItem value="usb">USB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.printerConnectionType === 'bluetooth' && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Bluetooth className="h-4 w-4" />
                        Bluetooth Settings
                      </h4>
                      <div>
                        <Label htmlFor="bluetoothPrinterName">Printer Name</Label>
                        <Input
                          id="bluetoothPrinterName"
                          placeholder="e.g., POS-80, Thermal Printer"
                          value={settings.bluetoothPrinterName}
                          onChange={(e) => handleSettingChange('bluetoothPrinterName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bluetoothPrinterAddress">Bluetooth Address (MAC)</Label>
                        <Input
                          id="bluetoothPrinterAddress"
                          placeholder="e.g., 00:11:22:33:44:55"
                          value={settings.bluetoothPrinterAddress}
                          onChange={(e) => handleSettingChange('bluetoothPrinterAddress', e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Bluetooth className="h-4 w-4 mr-2" />
                        Scan for Bluetooth Printers
                      </Button>
                    </div>
                  )}

                  {settings.printerConnectionType === 'ethernet' && (
                    <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        Network Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ethernetPrinterIP">IP Address</Label>
                          <Input
                            id="ethernetPrinterIP"
                            placeholder="192.168.1.100"
                            value={settings.ethernetPrinterIP}
                            onChange={(e) => handleSettingChange('ethernetPrinterIP', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ethernetPrinterPort">Port</Label>
                          <Input
                            id="ethernetPrinterPort"
                            placeholder="9100"
                            value={settings.ethernetPrinterPort}
                            onChange={(e) => handleSettingChange('ethernetPrinterPort', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Wifi className="h-4 w-4 mr-2" />
                        Test Network Connection
                      </Button>
                    </div>
                  )}

                  {settings.printerConnectionType === 'usb' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">USB Settings</h4>
                      <div>
                        <Label htmlFor="usbPrinterName">USB Printer Name</Label>
                        <Input
                          id="usbPrinterName"
                          value={settings.usbPrinterName}
                          onChange={(e) => handleSettingChange('usbPrinterName', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <Label htmlFor="printTimeout">Print Timeout (seconds)</Label>
                      <Input
                        id="printTimeout"
                        type="number"
                        min="10"
                        max="120"
                        value={settings.printTimeout}
                        onChange={(e) => handleSettingChange('printTimeout', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoPrint">Auto Print Receipts</Label>
                    <Switch
                      id="autoPrint"
                      checked={settings.autoPrint}
                      onCheckedChange={(checked) => handleSettingChange('autoPrint', checked)}
                    />
                  </div>

                  <Separator />
                  <Button onClick={handleTestPrint} className="w-full">
                    <Printer className="h-4 w-4 mr-2" />
                    Test Print
                  </Button>
                </>
              )}
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
