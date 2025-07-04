
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Store, TestTube2 } from 'lucide-react';
import { StoreSettings } from './settings/StoreSettings';
import { ThemeSettings } from './settings/ThemeSettings';
import { PrinterSettings } from './settings/PrinterSettings';
import { ReceiptSettings } from './settings/ReceiptSettings';
import { SMSSettings } from './settings/SMSSettings';
import { DemoModeToggle } from './DemoModeToggle';

interface SettingsProps {
  onSaveSettings: (settings: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const [settings, setSettings] = useState({
    storeName: 'MSUPER POS',
    currency: 'KES',
    taxRate: 16,
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Come again soon!',
    printerEnabled: false,
    smsEnabled: false,
    kraPin: '',
    mpesaPaybill: '',
    mpesaAccount: '',
    mpesaTill: '',
    bankAccount: '',
    paymentInstructions: ''
  });

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSaveSettings(newSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="printer">Printer</TabsTrigger>
          <TabsTrigger value="receipt">Receipt</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="demo">Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <StoreSettings settings={settings} onSettingChange={handleSettingChange} />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeSettings />
        </TabsContent>

        <TabsContent value="printer">
          <PrinterSettings 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        </TabsContent>

        <TabsContent value="receipt">
          <ReceiptSettings 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        </TabsContent>

        <TabsContent value="sms">
          <SMSSettings 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        </TabsContent>

        <TabsContent value="demo">
          <DemoModeToggle />
        </TabsContent>
      </Tabs>
    </div>
  );
};
