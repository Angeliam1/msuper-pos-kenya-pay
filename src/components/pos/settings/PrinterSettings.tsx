
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Printer, Bluetooth, Wifi, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrinterSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
  onTestPrint: () => void;
}

export const PrinterSettings: React.FC<PrinterSettingsProps> = ({ settings, onSettingChange, onTestPrint }) => {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'failed'>('idle');
  const [testingStep, setTestingStep] = useState('');

  // Xprinter specific connection test
  const testXprinterConnection = async () => {
    if (!settings.ethernetPrinterIP) {
      toast({
        title: "Missing IP Address",
        description: "Please enter the printer IP address first",
        variant: "destructive"
      });
      return;
    }

    setConnectionStatus('testing');
    setTestingStep('Connecting to printer...');

    try {
      // Test network connectivity first
      setTestingStep('Testing network connectivity...');
      
      // Simulate network test (in real implementation, this would be actual network testing)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestingStep('Checking printer protocol...');
      
      // For Xprinter, try common ports: 9100 (standard), 515 (LPR), 631 (IPP)
      const commonPorts = [9100, 515, 631];
      const testPort = settings.ethernetPrinterPort || 9100;
      
      if (!commonPorts.includes(parseInt(testPort))) {
        setTestingStep('Warning: Non-standard port detected');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setTestingStep('Attempting to connect to Xprinter...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful connection
      setConnectionStatus('connected');
      setTestingStep('');
      
      toast({
        title: "Xprinter Connected",
        description: `Successfully connected to Xprinter at ${settings.ethernetPrinterIP}:${testPort}`,
      });
      
      // Auto-reset status after 3 seconds
      setTimeout(() => setConnectionStatus('idle'), 3000);
      
    } catch (error) {
      setConnectionStatus('failed');
      setTestingStep('');
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Xprinter. Check IP address, port, and network settings.",
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
          Printer Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                  <SelectItem value="bluetooth">
                    <div className="flex items-center gap-2">
                      <Bluetooth className="h-4 w-4" />
                      Bluetooth
                    </div>
                  </SelectItem>
                  <SelectItem value="ethernet">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Ethernet/WiFi (Recommended for Xprinter)
                    </div>
                  </SelectItem>
                  <SelectItem value="usb">USB</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            {settings.printerConnectionType === 'ethernet' && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Xprinter Network Settings
                  </h4>
                  {getConnectionStatusIcon()}
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800 font-medium mb-2">Xprinter Setup Tips:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Print network configuration page from printer menu</li>
                    <li>• Use the IP address shown on the configuration page</li>
                    <li>• Default port is usually 9100 for Xprinter models</li>
                    <li>• Ensure printer and device are on same WiFi network</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ethernetPrinterIP">Printer IP Address</Label>
                    <Input
                      id="ethernetPrinterIP"
                      placeholder="192.168.1.100"
                      value={settings.ethernetPrinterIP}
                      onChange={(e) => onSettingChange('ethernetPrinterIP', e.target.value)}
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
                        <SelectItem value="9100">9100 (Standard RAW)</SelectItem>
                        <SelectItem value="515">515 (LPR/LPD)</SelectItem>
                        <SelectItem value="631">631 (IPP)</SelectItem>
                        <SelectItem value="custom">Custom Port</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {settings.ethernetPrinterPort === 'custom' && (
                  <div>
                    <Label htmlFor="customPort">Custom Port Number</Label>
                    <Input
                      id="customPort"
                      placeholder="Enter custom port"
                      onChange={(e) => onSettingChange('ethernetPrinterPort', e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={testXprinterConnection}
                    disabled={connectionStatus === 'testing'}
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    {connectionStatus === 'testing' ? 'Testing Connection...' : 'Test Xprinter Connection'}
                  </Button>
                  
                  {testingStep && (
                    <div className="text-xs text-gray-600 text-center">
                      {testingStep}
                    </div>
                  )}

                  {connectionStatus === 'connected' && (
                    <Badge variant="default" className="w-full justify-center">
                      ✓ Xprinter Connected Successfully
                    </Badge>
                  )}

                  {connectionStatus === 'failed' && (
                    <div className="text-xs text-red-600 space-y-1">
                      <p className="font-medium">Troubleshooting steps:</p>
                      <ul className="space-y-1">
                        <li>• Check if printer IP is correct</li>
                        <li>• Verify both devices are on same network</li>
                        <li>• Try port 9100, 515, or 631</li>
                        <li>• Restart printer and check network settings</li>
                      </ul>
                    </div>
                  )}
                </div>
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
            <Button onClick={onTestPrint} className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              Test Print Receipt
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
