
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer } from 'lucide-react';

interface PrinterGeneralSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
  onTestPrint: () => void;
}

export const PrinterGeneralSettings: React.FC<PrinterGeneralSettingsProps> = ({
  settings,
  onSettingChange,
  onTestPrint
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
