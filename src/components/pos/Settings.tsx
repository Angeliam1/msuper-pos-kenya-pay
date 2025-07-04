
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Receipt, Printer, Smartphone, Palette, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReceiptSettings } from './settings/ReceiptSettings';
import { PrinterSettings } from './settings/PrinterSettings';
import { SMSSettings } from './settings/SMSSettings';
import { ThemeSelector } from './ThemeSelector';
import { useStore } from '@/contexts/StoreContext';

interface SettingsProps {
  onSaveSettings: (settings: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const { toast } = useToast();
  const { currentStore, updateStore, getStoreSettings, updateStoreSettings } = useStore();
  
  // Get store-specific settings
  const storeSettings = currentStore ? getStoreSettings(currentStore.id) : {};
  
  const [settings, setSettings] = useState({
    // Store-independent basic settings
    currency: storeSettings.currency || 'KES',
    taxRate: storeSettings.taxRate || 16,
    lowStockThreshold: storeSettings.lowStockThreshold || 10,
    enableLoyaltyProgram: storeSettings.enableLoyaltyProgram || true,
    loyaltyPointsPerShilling: storeSettings.loyaltyPointsPerShilling || 0.01,
    autoBackup: storeSettings.autoBackup || true,
    showProductImages: storeSettings.showProductImages || true,
    enableBarcode: storeSettings.enableBarcode || true,
    requireCustomerInfo: storeSettings.requireCustomerInfo || false,
    allowNegativeStock: storeSettings.allowNegativeStock || false,
    defaultPaymentMethod: storeSettings.defaultPaymentMethod || 'cash',
    theme: storeSettings.theme || 'light',
    fontSize: storeSettings.fontSize || 'medium',
    
    // Store-specific settings from current store
    receiptHeader: currentStore?.receiptSettings?.header || 'Thank you for shopping with us!',
    receiptFooter: currentStore?.receiptSettings?.footer || 'Visit us again soon!',
    businessName: currentStore?.name || 'Store Name',
    businessPhone: currentStore?.phone || '',
    printerEnabled: true,
    printerConnectionType: 'bluetooth',
    bluetoothPrinterName: '',
    bluetoothPrinterAddress: '',
    ethernetPrinterIP: '',
    ethernetPrinterPort: '9100',
    usbPrinterName: '',
    printCopies: 1,
    printTimeout: 30,
    autoPrint: currentStore?.receiptSettings?.autoprint || true,
    smsEnabled: false,
    smsProvider: 'phone',
    hirePurchaseTemplate: `Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - ${currentStore?.name || 'Store'}`,
    paymentReminderTemplate: `Hi {customerName}, your payment of KES {amount} is pending at ${currentStore?.name || 'Store'} (${currentStore?.phone || ''}) and is {daysLate} days late. Pay now: {paymentLink}`,
    paymentConfirmTemplate: `Hi {customerName}, payment received! Amount: KES {amount}. New balance: KES {balance}. Thank you! - ${currentStore?.name || 'Store'}`
  });

  // Update settings when store changes
  useEffect(() => {
    if (currentStore) {
      const storeSettings = getStoreSettings(currentStore.id);
      setSettings(prev => ({
        ...prev,
        ...storeSettings,
        receiptHeader: currentStore.receiptSettings?.header || 'Thank you for shopping with us!',
        receiptFooter: currentStore.receiptSettings?.footer || 'Visit us again soon!',
        businessName: currentStore.name,
        businessPhone: currentStore.phone,
        autoPrint: currentStore.receiptSettings?.autoprint || true,
      }));
    }
  }, [currentStore]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    if (!currentStore) {
      toast({
        title: "No Store Selected",
        description: "Please select a store to save settings",
        variant: "destructive"
      });
      return;
    }

    // Save store-specific receipt settings to the current store
    updateStore(currentStore.id, {
      receiptSettings: {
        ...currentStore.receiptSettings,
        header: settings.receiptHeader,
        footer: settings.receiptFooter,
        autoprint: settings.autoPrint,
      }
    });

    // Save other store-specific settings
    updateStoreSettings(currentStore.id, {
      currency: settings.currency,
      taxRate: settings.taxRate,
      lowStockThreshold: settings.lowStockThreshold,
      enableLoyaltyProgram: settings.enableLoyaltyProgram,
      loyaltyPointsPerShilling: settings.loyaltyPointsPerShilling,
      autoBackup: settings.autoBackup,
      showProductImages: settings.showProductImages,
      enableBarcode: settings.enableBarcode,
      requireCustomerInfo: settings.requireCustomerInfo,
      allowNegativeStock: settings.allowNegativeStock,
      defaultPaymentMethod: settings.defaultPaymentMethod,
      theme: settings.theme,
      fontSize: settings.fontSize
    });

    onSaveSettings(settings);
    toast({
      title: "Settings Saved",
      description: `Settings have been saved for ${currentStore.name}`,
    });
  };

  const handleTestPrint = () => {
    if (!currentStore) return;
    toast({
      title: "Test Print",
      description: `Sending test receipt to ${currentStore.name} printer...`,
    });
    console.log('Testing printer for store:', currentStore.name, 'with settings:', {
      connectionType: settings.printerConnectionType,
      printerName: settings.bluetoothPrinterName || settings.usbPrinterName,
      ip: settings.ethernetPrinterIP
    });
  };

  const handleTestSMS = () => {
    if (!currentStore) return;
    toast({
      title: "Test SMS",
      description: `Testing SMS configuration for ${currentStore.name}...`,
    });
    console.log('Testing SMS for store:', currentStore.name, 'with settings:', {
      provider: settings.smsProvider,
      businessPhone: settings.businessPhone,
      businessName: settings.businessName
    });
  };

  if (!currentStore) {
    return (
      <div className="text-center py-8">
        <Store className="mx-auto h-12 w-12 mb-4 text-gray-300" />
        <p className="text-gray-500">Please select a store to configure its independent settings</p>
        <p className="text-xs text-gray-400 mt-2">Each store has its own separate configuration</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-blue-600" />
            {currentStore.name} Settings
          </h2>
          <p className="text-gray-600">Independent store configuration</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Store ID: {currentStore.id}
            </span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Independent Settings
            </span>
          </div>
        </div>
        <Button onClick={handleSaveSettings}>
          Save Store Settings
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
            Store
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
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                {currentStore.name} Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Store Independence</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• This store operates independently from MSUPER-POS</li>
                  <li>• Settings apply only to this store location</li>
                  <li>• Products, customers, and transactions are separate</li>
                  <li>• Each store has its own receipt and printer configuration</li>
                </ul>
              </div>

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
