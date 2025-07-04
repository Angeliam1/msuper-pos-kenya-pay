
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bluetooth } from 'lucide-react';

interface BluetoothPrinterProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const BluetoothPrinter: React.FC<BluetoothPrinterProps> = ({
  settings,
  onSettingChange
}) => {
  return (
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
  );
};
