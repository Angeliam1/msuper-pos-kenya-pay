
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer, Bluetooth, Wifi } from 'lucide-react';

interface PrinterSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
  onTestPrint: () => void;
}

export const PrinterSettings: React.FC<PrinterSettingsProps> = ({ settings, onSettingChange, onTestPrint }) => {
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
                      Ethernet/WiFi
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
                <h4 className="font-medium flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Network Settings
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ethernetPrinterIP">IP Address</Label>
                    <Input
                      id="ethernetPrinterIP"
                      placeholder="192.168.1.100"
                      value={settings.ethernetPrinterIP}
                      onChange={(e) => onSettingChange('ethernetPrinterIP', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ethernetPrinterPort">Port</Label>
                    <Input
                      id="ethernetPrinterPort"
                      placeholder="9100"
                      value={settings.ethernetPrinterPort}
                      onChange={(e) => onSettingChange('ethernetPrinterPort', e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Wifi className="h-4 w-4 mr-2" />
                  Test Network Connection
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
            <Button onClick={onTestPrint} className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              Test Print
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
