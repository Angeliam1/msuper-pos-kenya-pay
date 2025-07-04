
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Printer, Bluetooth, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { testXprinterConnection, isNativeApp, getPrintingInstructions } from '@/utils/xprinterUtils';
import { PlatformInfo } from './printer-sections/PlatformInfo';
import { NetworkPrinter } from './printer-sections/NetworkPrinter';
import { BluetoothPrinter } from './printer-sections/BluetoothPrinter';
import { USBPrinter } from './printer-sections/USBPrinter';
import { PrinterGeneralSettings } from './printer-sections/PrinterGeneralSettings';

interface PrinterSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
  onTestPrint: () => void;
}

export const PrinterSettings: React.FC<PrinterSettingsProps> = ({ settings, onSettingChange, onTestPrint }) => {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'failed'>('idle');
  const [testingStep, setTestingStep] = useState('');

  const isNative = isNativeApp();
  const printingInstructions = getPrintingInstructions();

  // Test network connectivity to Xprinter
  const testNetworkConnection = async () => {
    if (!settings.ethernetPrinterIP) {
      toast({
        title: "Missing IP Address",
        description: "Please enter the Xprinter IP address first",
        variant: "destructive"
      });
      return;
    }

    setConnectionStatus('testing');
    setTestingStep('Testing Xprinter connection...');

    try {
      const testPort = parseInt(settings.ethernetPrinterPort || '9100');
      
      setTestingStep(`Attempting to connect to ${settings.ethernetPrinterIP}:${testPort}...`);
      
      // Send test print (will use browser fallback in web environment)
      const printSuccess = await testXprinterConnection(settings.ethernetPrinterIP, testPort);
      
      if (printSuccess) {
        setConnectionStatus('connected');
        setTestingStep('');
        
        if (isNative) {
          toast({
            title: "Test Print Sent!",
            description: `Test receipt sent to Xprinter at ${settings.ethernetPrinterIP}:${testPort}`,
          });
        } else {
          toast({
            title: "Print Dialog Opened",
            description: "A print window opened. Set your browser's default printer to the Xprinter and print.",
          });
        }
        
        setTimeout(() => setConnectionStatus('idle'), 5000);
      } else {
        throw new Error('Print test failed');
      }
      
    } catch (error) {
      setConnectionStatus('failed');
      setTestingStep('');
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: "Print Test Failed",
        description: `Error: ${errorMessage}`,
        variant: "destructive"
      });
      
      setTimeout(() => setConnectionStatus('idle'), 3000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Xprinter Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Platform Information */}
        <PlatformInfo isNative={isNative} printingInstructions={printingInstructions} />

        <div className="flex items-center justify-between">
          <Label htmlFor="printerEnabled">Enable Printer</Label>
          <Switch
            id="printerEnabled"
            checked={settings.printerEnabled}
            onCheckedChange={(checked) => onSettingChange('printerEnabled', checked)}
          />
        </div>
        
        {settings.printerEnabled && (
          <>
            <Separator />
            <div>
              <Label htmlFor="printerConnectionType">Connection Type</Label>
              <Select value={settings.printerConnectionType} onValueChange={(value) => onSettingChange('printerConnectionType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethernet">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Network (WiFi/Ethernet) - Recommended
                    </div>
                  </SelectItem>
                  <SelectItem value="bluetooth">
                    <div className="flex items-center gap-2">
                      <Bluetooth className="h-4 w-4" />
                      Bluetooth
                    </div>
                  </SelectItem>
                  <SelectItem value="usb">USB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.printerConnectionType === 'ethernet' && (
              <NetworkPrinter
                settings={settings}
                onSettingChange={onSettingChange}
                connectionStatus={connectionStatus}
                testingStep={testingStep}
                isNative={isNative}
                onTestConnection={testNetworkConnection}
              />
            )}

            {settings.printerConnectionType === 'bluetooth' && (
              <BluetoothPrinter
                settings={settings}
                onSettingChange={onSettingChange}
              />
            )}

            {settings.printerConnectionType === 'usb' && (
              <USBPrinter
                settings={settings}
                onSettingChange={onSettingChange}
              />
            )}

            <Separator />
            <PrinterGeneralSettings
              settings={settings}
              onSettingChange={onSettingChange}
              onTestPrint={onTestPrint}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
