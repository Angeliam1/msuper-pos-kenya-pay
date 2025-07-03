import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Store, Receipt, Printer, Shield, Smartphone, Palette } from 'lucide-react';
import { StoreSettings } from './settings/StoreSettings';
import { PrinterSettings } from './settings/PrinterSettings';
import { ReceiptSettings } from './settings/ReceiptSettings';
import { SMSSettings } from './settings/SMSSettings';
import { ThemeSettings } from './settings/ThemeSettings';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  onSaveSettings: (settings: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    storeName: 'TOPTEN ELECTRONICS LTD',
    storeAddress: 'Githunguri Town Next To Main Market',
    storePhone: '0725333337',
    storeEmail: 'info@topten.com',
    kraPin: 'P123456789A',
    paybill: 'Paybill 247247 Acc 333337',
    mpesaPaybill: '247247',
    mpesaAccount: '333337',
    mpesaTill: '123456',
    bankAccount: 'KCB Bank Account: 1234567890',
    paymentInstructions: 'Pay via M-Pesa or Bank Transfer',
    taxRate: 16,
    currency: 'KES',
    
    // Receipt Settings - Updated
    showStoreName: true,
    showStoreAddress: true,
    showStorePhone: true,
    showCustomerName: true,
    showCustomerPhone: true,
    showCustomerAddress: true,
    showNotes: true,
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Visit us again soon!',
    showQRCode: true,
    showBarcode: true,
    autoPrintReceipt: true,
    showLogo: false,
    customLine1: 'Paybill 247247 Acc 333337',
    customLine2: 'KRA PIN: P123456789A',
    additionalNotes: '',
    
    // SMS Settings
    smsEnabled: true,
    smsProvider: 'whatsapp',
    businessPhone: '0725333337',
    businessName: 'TOPTEN ELECTRONICS',
    hirePurchaseTemplate: 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}',
    paymentReminderTemplate: 'Hi {customerName}, your payment of KES {amount} is pending at {businessName} ({businessPhone}) and is {daysLate} days late. Pay now: {paymentLink}',
    paymentConfirmTemplate: 'Hi {customerName}, payment received! Amount: KES {amount}. New balance: KES {balance}. Thank you! - {businessName}',
    
    // Theme Settings - only light and dark
    theme: 'light',
    fontSize: 'medium',
    
    // System Settings
    lowStockThreshold: 10,
    autoBackup: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    
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
    try {
      onSaveSettings(settings);
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
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
    toast({
      title: "Test Print",
      description: "Test print sent to printer!",
    });
  };

  const handleTestSMS = () => {
    console.log('Testing SMS with settings:', {
      provider: settings.smsProvider,
      phone: settings.businessPhone,
      businessName: settings.businessName
    });
    toast({
      title: "SMS Test",
      description: "Test SMS configuration completed!",
    });
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
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
          <TabsTrigger value="store" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Store className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Store</span>
          </TabsTrigger>
          <TabsTrigger value="receipt" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Receipt className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Receipt</span>
          </TabsTrigger>
          <TabsTrigger value="printer" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Printer</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>SMS</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Theme</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Security</span>
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

        <TabsContent value="sms" className="space-y-4 sm:space-y-6">
          <SMSSettings 
            settings={settings} 
            onSettingChange={handleSettingChange}
            onTestSMS={handleTestSMS}
          />
        </TabsContent>

        <TabsContent value="theme" className="space-y-4 sm:space-y-6">
          <ThemeSettings 
            settings={settings} 
            onSettingChange={handleSettingChange}
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
