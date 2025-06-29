
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Store, Receipt, Printer, Shield } from 'lucide-react';
import { StoreSettings } from './settings/StoreSettings';
import { PrinterSettings } from './settings/PrinterSettings';
import { ReceiptSettings } from './settings/ReceiptSettings';

interface SettingsProps {
  onSaveSettings: (settings: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: 'TOPTEN ELECTRONICS LTD',
    storeAddress: 'Githunguri Town Next To Main Market',
    storePhone: '0725333337',
    storeEmail: 'info@topten.com',
    paybill: 'Paybill 247247 Acc 333337',
    taxRate: 16,
    currency: 'KES',
    
    // Receipt Settings
    showStoreName: true,
    showStoreAddress: true,
    showStorePhone: true,
    showCustomerName: true,
    showCustomerPhone: true,
    showCustomerAddress: true,
    showNotes: true,
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          <h2 className="text-xl sm:text-2xl font-bold">Settings</h2>
        </div>
        <Button onClick={handleSave} className="text-sm sm:text-base">Save Changes</Button>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="store" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Store className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Store</span>
            <span className="sm:hidden">Store</span>
          </TabsTrigger>
          <TabsTrigger value="receipt" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Receipt className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Receipt</span>
            <span className="sm:hidden">Receipt</span>
          </TabsTrigger>
          <TabsTrigger value="printer" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Printer</span>
            <span className="sm:hidden">Printer</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4 sm:space-y-6">
          <StoreSettings 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        </TabsContent>

        <TabsContent value="receipt" className="space-y-4 sm:space-y-6">
          <ReceiptSettings 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
        </TabsContent>

        <TabsContent value="printer" className="space-y-4 sm:space-y-6">
          <PrinterSettings 
            settings={settings} 
            onSettingChange={handleSettingChange}
            onTestPrint={handleTestPrint}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-4 sm:space-y-6">
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            Security settings coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
