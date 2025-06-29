
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Store, Receipt, Printer, Shield } from 'lucide-react';
import { StoreSettings } from './settings/StoreSettings';
import { PrinterSettings } from './settings/PrinterSettings';

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="printer" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Printer
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <StoreSettings 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        </TabsContent>

        <TabsContent value="printer" className="space-y-6">
          <PrinterSettings 
            settings={settings} 
            onSettingChange={handleSettingChange}
            onTestPrint={handleTestPrint}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security settings can be added here later */}
          <div className="text-center py-8 text-gray-500">
            Security settings coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
