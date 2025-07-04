
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Settings as SettingsIcon, Store, Palette, Printer, Receipt, MessageSquare, TestTube2 } from 'lucide-react';
import { StoreSettings } from './settings/StoreSettings';
import { ThemeSettings } from './settings/ThemeSettings';
import { PrinterSettings } from './settings/PrinterSettings';
import { ReceiptSettings } from './settings/ReceiptSettings';
import { SMSSettings } from './settings/SMSSettings';
import { DemoModeToggle } from './DemoModeToggle';

interface SettingsProps {
  onSaveSettings: (settings: any) => void;
}

type SettingsSectionType = 'store' | 'theme' | 'printer' | 'receipt' | 'sms' | 'demo';

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
    paymentInstructions: '',
    theme: 'light',
    fontSize: 'medium'
  });

  const [activeSection, setActiveSection] = useState<SettingsSectionType>('store');
  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSaveSettings(newSettings);
  };

  const handleTestPrint = () => {
    console.log('Testing printer connection...');
    // Add actual print test logic here
  };

  const handleTestSMS = () => {
    console.log('Testing SMS configuration...');
    // Add actual SMS test logic here
  };

  const settingsMenuItems = [
    { id: 'store' as SettingsSectionType, label: 'Store Settings', icon: Store },
    { id: 'theme' as SettingsSectionType, label: 'Theme', icon: Palette },
    { id: 'printer' as SettingsSectionType, label: 'Printer', icon: Printer },
    { id: 'receipt' as SettingsSectionType, label: 'Receipt', icon: Receipt },
    { id: 'sms' as SettingsSectionType, label: 'SMS', icon: MessageSquare },
    { id: 'demo' as SettingsSectionType, label: 'Demo Mode', icon: TestTube2 },
  ];

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'store':
        return <StoreSettings settings={settings} onSettingChange={handleSettingChange} />;
      case 'theme':
        return <ThemeSettings settings={settings} onSettingChange={handleSettingChange} />;
      case 'printer':
        return <PrinterSettings 
          settings={settings} 
          onSettingChange={handleSettingChange}
          onTestPrint={handleTestPrint}
        />;
      case 'receipt':
        return <ReceiptSettings 
          settings={settings} 
          onSettingChange={handleSettingChange} 
        />;
      case 'sms':
        return <SMSSettings 
          settings={settings} 
          onSettingChange={handleSettingChange}
          onTestSMS={handleTestSMS}
        />;
      case 'demo':
        return <DemoModeToggle />;
      default:
        return <StoreSettings settings={settings} onSettingChange={handleSettingChange} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Sheet key={item.id} open={isOpen && activeSection === item.id} 
                   onOpenChange={(open) => {
                     setIsOpen(open);
                     if (open) setActiveSection(item.id);
                   }}>
              <SheetTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  {renderSettingsContent()}
                </div>
              </SheetContent>
            </Sheet>
          );
        })}
      </div>
    </div>
  );
};
