
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Printer, Bluetooth, Wifi, CheckCircle, XCircle, AlertCircle, Network, Info, Globe, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { testXprinterConnection, pingXprinter, isNativeApp, getPrintingInstructions } from '@/utils/xprinterUtils';

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

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
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
        <Alert>
          <div className="flex items-center gap-2">
            {isNative ? <Smartphone className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            <Info className="h-4 w-4" />
          </div>
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                {isNative ? "🔧 Mobile App Mode - Full Printer Support" : "🌐 Web Browser Mode - Limited Printer Support"}
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                {printingInstructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>

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
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Xprinter Network Setup
                  </h4>
                  {getConnectionStatusIcon()}
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-2">📋 Setup Instructions:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>1. Press and hold FEED button on Xprinter for 3 seconds</li>
                    <li>2. Configuration page will print showing network settings</li>
                    <li>3. Find the IP address (e.g., 192.168.0.214)</li>
                    <li>4. Enter this IP below and test connection</li>
                    <li>5. Both devices must be on same WiFi network</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ethernetPrinterIP">Xprinter IP Address</Label>
                    <Input
                      id="ethernetPrinterIP"
                      placeholder="192.168.0.214"
                      value={settings.ethernetPrinterIP}
                      onChange={(e) => onSettingChange('ethernetPrinterIP', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ethernetPrinterPort">Port</Label>
                    <Select 
                      value={settings.ethernetPrinterPort || "9100"} 
                      onValueChange={(value) => onSettingChange('ethernetPrinterPort', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9100">9100 (Standard)</SelectItem>
                        <SelectItem value="515">515 (LPR)</SelectItem>
                        <SelectItem value="631">631 (IPP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    variant="default"
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={testNetworkConnection}
                    disabled={connectionStatus === 'testing' || !settings.ethernetPrinterIP}
                  >
                    <Network className="h-4 w-4 mr-2" />
                    {connectionStatus === 'testing' ? 'Testing Connection...' : 'Test Print to Xprinter'}
                  </Button>
                  
                  {testingStep && (
                    <div className="text-xs text-gray-600 text-center p-2 bg-yellow-50 rounded">
                      🔄 {testingStep}
                    </div>
                  )}

                  {connectionStatus === 'connected' && (
                    <Badge variant="default" className="w-full justify-center bg-green-600">
                      ✅ {isNative ? 'Test Print Sent - Check Your Xprinter' : 'Print Dialog Opened - Check Browser'}
                    </Badge>
                  )}

                  {connectionStatus === 'failed' && (
                    <div className="text-xs text-red-600 space-y-2 p-3 bg-red-50 rounded border border-red-200">
                      <p className="font-medium">❌ Print Test Failed - Try These Steps:</p>
                      <ul className="space-y-1">
                        <li>• Print network config from Xprinter (hold FEED button)</li>
                        <li>• Verify IP address matches exactly (currently: {settings.ethernetPrinterIP || 'not set'})</li>
                        <li>• Check both devices are on same WiFi network</li>
                        <li>• {isNative ? 'Try restarting the Xprinter' : 'Set browser default printer to Xprinter'}</li>
                        <li>• {isNative ? 'Ensure port 9100 is not blocked by firewall' : 'Use browser print dialog (Ctrl+P) as alternative'}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                    onChange={(e) => onSettingChange('bluetoothPrinterName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bluetoothPrinterAddress">Bluetooth Address (MAC)</Label>
                  <Input
                    id="bluetoothPrinterAddress"
                    placeholder="e.g., 00:11:22:33:44:55"
                    value={settings.bluetoothPrinterAddress}
                    onChange={(e) => onSettingChange('bluetoothPrinterAddress', e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Bluetooth className="h-4 w-4 mr-2" />
                  Scan for Bluetooth Printers
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
                    onChange={(e) => onSettingChange('usbPrinterName', e.target.value)}
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
                  onChange={(e) => onSettingChange('printCopies', parseInt(e.target.value))}
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
                  onChange={(e) => onSettingChange('printTimeout', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="autoPrint">Auto Print Receipts</Label>
              <Switch
                id="autoPrint"
                checked={settings.autoPrint}
                onCheckedChange={(checked) => onSettingChange('autoPrint', checked)}
              />
            </div>

            <Separator />
            <Button onClick={onTestPrint} className="w-full" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Test Print Sample Receipt
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
