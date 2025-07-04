
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface USBPrinterProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const USBPrinter: React.FC<USBPrinterProps> = ({
  settings,
  onSettingChange
}) => {
  return (
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
  );
};
