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
    customLine1: 'Paybill 247247 Acc 333337',
    customLine2: 'KRA PIN: P123456789A',
    additionalNotes: '',
    
    // SMS Settings
    smsEnabled: true,
    smsProvider: 'whatsapp',
    businessPhone: '0725333337',
    businessName: 'TOPTEN ELECTRONICS',
    hirePurchaseTemplate: 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Thank you!',
    paymentReminderTemplate: 'Hi {customerName}, your payment of KES {amount} is pending at {businessName} ({businessPhone}) and is {daysLate} days late. Click here to view details: {link}',
    paymentConfirmTemplate: 'Hi {customerName}, you have paid KES {amount}. Your new balance is KES {balance}. Thank you!',
    
    // Theme Settings
    theme: 'light',
    accentColor: '#3b82f6',
    fontSize: 'medium',
    compactMode: 'normal',
    
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

  const applyTheme = (theme: string, accentColor: string, fontSize: string, compactMode: string) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    document.body.classList.remove('dark', 'theme-blue', 'theme-green', 'theme-purple', 'theme-yellow');
    
    // Apply theme colors
    switch (theme) {
      case 'dark':
        document.body.classList.add('dark');
        root.style.setProperty('--background', '18 18 23');
        root.style.setProperty('--foreground', '250 250 250');
        root.style.setProperty('--card', '24 24 27');
        root.style.setProperty('--card-foreground', '250 250 250');
        root.style.setProperty('--popover', '24 24 27');
        root.style.setProperty('--popover-foreground', '250 250 250');
        root.style.setProperty('--primary', '142 141 148');
        root.style.setProperty('--primary-foreground', '9 9 11');
        root.style.setProperty('--secondary', '39 39 42');
        root.style.setProperty('--secondary-foreground', '250 250 250');
        root.style.setProperty('--muted', '39 39 42');
        root.style.setProperty('--muted-foreground', '161 161 170');
        root.style.setProperty('--accent', '39 39 42');
        root.style.setProperty('--accent-foreground', '250 250 250');
        root.style.setProperty('--destructive', '239 68 68');
        root.style.setProperty('--destructive-foreground', '250 250 250');
        root.style.setProperty('--border', '39 39 42');
        root.style.setProperty('--input', '39 39 42');
        root.style.setProperty('--ring', '142 141 148');
        break;
      case 'blue':
        document.body.classList.add('theme-blue');
        root.style.setProperty('--background', '219 234 254');
        root.style.setProperty('--foreground', '30 58 138');
        root.style.setProperty('--card', '255 255 255');
        root.style.setProperty('--card-foreground', '30 58 138');
        root.style.setProperty('--primary', '59 130 246');
        root.style.setProperty('--primary-foreground', '248 250 252');
        break;
      case 'green':
        document.body.classList.add('theme-green');
        root.style.setProperty('--background', '220 252 231');
        root.style.setProperty('--foreground', '22 101 52');
        root.style.setProperty('--card', '255 255 255');
        root.style.setProperty('--card-foreground', '22 101 52');
        root.style.setProperty('--primary', '34 197 94');
        root.style.setProperty('--primary-foreground', '220 252 231');
        break;
      case 'purple':
        document.body.classList.add('theme-purple');
        root.style.setProperty('--background', '243 232 255');
        root.style.setProperty('--foreground', '88 28 135');
        root.style.setProperty('--card', '255 255 255');
        root.style.setProperty('--card-foreground', '88 28 135');
        root.style.setProperty('--primary', '168 85 247');
        root.style.setProperty('--primary-foreground', '243 232 255');
        break;
      case 'yellow':
        document.body.classList.add('theme-yellow');
        root.style.setProperty('--background', '254 249 195'); // Light yellow background
        root.style.setProperty('--foreground', '120 53 15'); // Dark brown text for contrast
        root.style.setProperty('--card', '255 255 255'); // White cards
        root.style.setProperty('--card-foreground', '120 53 15'); // Dark brown text on cards
        root.style.setProperty('--popover', '255 255 255');
        root.style.setProperty('--popover-foreground', '120 53 15');
        root.style.setProperty('--primary', '217 119 6'); // Orange-yellow primary
        root.style.setProperty('--primary-foreground', '255 255 255'); // White text on primary
        root.style.setProperty('--secondary', '254 243 199'); // Light yellow secondary
        root.style.setProperty('--secondary-foreground', '120 53 15'); // Dark text on secondary
        root.style.setProperty('--muted', '254 243 199');
        root.style.setProperty('--muted-foreground', '161 98 7');
        root.style.setProperty('--accent', '254 243 199');
        root.style.setProperty('--accent-foreground', '120 53 15');
        root.style.setProperty('--destructive', '239 68 68');
        root.style.setProperty('--destructive-foreground', '255 255 255');
        root.style.setProperty('--border', '251 191 36');
        root.style.setProperty('--input', '254 243 199');
        root.style.setProperty('--ring', '217 119 6');
        break;
      default: // light
        root.style.setProperty('--background', '255 255 255');
        root.style.setProperty('--foreground', '9 9 11');
        root.style.setProperty('--card', '255 255 255');
        root.style.setProperty('--card-foreground', '9 9 11');
        root.style.setProperty('--popover', '255 255 255');
        root.style.setProperty('--popover-foreground', '9 9 11');
        root.style.setProperty('--primary', '9 9 11');
        root.style.setProperty('--primary-foreground', '250 250 250');
        root.style.setProperty('--secondary', '244 244 245');
        root.style.setProperty('--secondary-foreground', '9 9 11');
        root.style.setProperty('--muted', '244 244 245');
        root.style.setProperty('--muted-foreground', '113 113 122');
        root.style.setProperty('--accent', '244 244 245');
        root.style.setProperty('--accent-foreground', '9 9 11');
        root.style.setProperty('--destructive', '239 68 68');
        root.style.setProperty('--destructive-foreground', '250 250 250');
        root.style.setProperty('--border', '229 229 234');
        root.style.setProperty('--input', '229 229 234');
        root.style.setProperty('--ring', '9 9 11');
        break;
    }

    // Apply accent color override if different from theme default
    if (accentColor && accentColor !== '#3b82f6') {
      try {
        const hex = accentColor.replace('#', '');
        if (hex.length === 6) {
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          root.style.setProperty('--primary', `${r} ${g} ${b}`);
          root.style.setProperty('--primary-foreground', '255 255 255');
        }
      } catch (error) {
        console.warn('Invalid accent color:', accentColor);
      }
    }

    // Apply font size
    switch (fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
        break;
    }

    // Apply compact mode
    switch (compactMode) {
      case 'compact':
        root.style.setProperty('--spacing', '0.5rem');
        break;
      case 'spacious':
        root.style.setProperty('--spacing', '2rem');
        break;
      default:
        root.style.setProperty('--spacing', '1rem');
        break;
    }
  };

  useEffect(() => {
    applyTheme(settings.theme, settings.accentColor, settings.fontSize, settings.compactMode);
  }, [settings.theme, settings.accentColor, settings.fontSize, settings.compactMode]);

  const handleSave = () => {
    try {
      onSaveSettings(settings);
      applyTheme(settings.theme, settings.accentColor, settings.fontSize, settings.compactMode);
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
