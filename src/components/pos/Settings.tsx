
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Receipt, Printer, Smartphone, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReceiptSettings } from './settings/ReceiptSettings';
import { PrinterSettings } from './settings/PrinterSettings';
import { SMSSettings } from './settings/SMSSettings';
import { ThemeSelector } from './ThemeSelector';

interface SettingsProps {
  onSaveSettings: (settings: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    currency: 'KES',
    taxRate: 16,
    receiptFooter: 'Thank you for shopping with Digital Den!',
    lowStockThreshold: 10,
    enableLoyaltyProgram: true,
    loyaltyPointsPerShilling: 0.01,
    autoBackup: true,
    printerName: 'Default Printer',
    receiptWidth: 80,
    showProductImages: true,
    enableBarcode: true,
    requireCustomerInfo: false,
    allowNegativeStock: false,
    enableMultiStore: false,
    defaultPaymentMethod: 'cash',
    enableSMS: false,
    smsApiKey: '',
    smsUsername: '',
    enableEmailReceipts: false,
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    theme: 'light',
    fontSize: 'medium',
    printerEnabled: true,
    printerConnectionType: 'bluetooth',
    bluetoothPrinterName: '',
    bluetoothPrinterAddress: '',
    ethernetPrinterIP: '',
    ethernetPrinterPort: '9100',
    usbPrinterName: '',
    printCopies: 1,
    printTimeout: 30,
    autoPrint: true,
    smsEnabled: false,
    smsProvider: 'phone',
    businessPhone: '0725333337',
    businessName: 'DIGITAL DEN',
    hirePurchaseTemplate: 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}',
    paymentReminderTemplate: 'Hi {customerName}, your payment of KES {amount} is pending at {businessName} ({businessPhone}) and is {daysLate} days late. Pay now: {paymentLink}',
    paymentConfirmTemplate: 'Hi {customerName}, payment received! Amount: KES {amount}. New balance: KES {balance}. Thank you! - {businessName}'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    onSaveSettings(settings);
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleTestPrint = () => {
    toast({
      title: "Test Print",
      description: "Sending test receipt to printer...",
    });
    console.log('Testing printer with settings:', {
      connectionType: settings.printerConnectionType,
      printerName: settings.bluetoothPrinterName || settings.usbPrinterName,
      ip: settings.ethernetPrinterIP
    });
  };

  const handleTestSMS = () => {
    toast({
      title: "Test SMS",
      description: "Testing SMS configuration...",
    });
    console.log('Testing SMS with settings:', {
      provider: settings.smsProvider,
      businessPhone: settings.businessPhone,
      businessName: settings.businessName
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Global Settings</h2>
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="receipt" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="receipt" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Receipt
          </TabsTrigger>
          <TabsTrigger value="printer" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Printer
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="receipt">
          <ReceiptSettings settings={settings} onSettingChange={handleSettingChange} />
        </TabsContent>

        <TabsContent value="printer">
          <PrinterSettings 
            settings={settings} 
            onSettingChange={handleSettingChange}
            onTestPrint={handleTestPrint}
          />
        </TabsContent>

        <TabsContent value="sms">
          <SMSSettings 
            settings={settings} 
            onSettingChange={handleSettingChange}
            onTestSMS={handleTestSMS}
          />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeSelector />
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loyaltyPoints">Loyalty Points per KES</Label>
                  <Input
                    id="loyaltyPoints"
                    type="number"
                    step="0.01"
                    value={settings.loyaltyPointsPerShilling}
                    onChange={(e) => handleSettingChange('loyaltyPointsPerShilling', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableLoyalty">Enable Loyalty Program</Label>
                  <Switch
                    id="enableLoyalty"
                    checked={settings.enableLoyaltyProgram}
                    onCheckedChange={(checked) => handleSettingChange('enableLoyaltyProgram', checked)}
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowNegativeStock">Allow Negative Stock</Label>
                  <Switch
                    id="allowNegativeStock"
                    checked={settings.allowNegativeStock}
                    onCheckedChange={(checked) => handleSettingChange('allowNegativeStock', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableBarcode">Enable Barcode Scanner</Label>
                  <Switch
                    id="enableBarcode"
                    checked={settings.enableBarcode}
                    onCheckedChange={(checked) => handleSettingChange('enableBarcode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
