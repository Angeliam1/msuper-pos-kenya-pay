
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';

interface NetworkPrinterProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
  connectionStatus: 'idle' | 'testing' | 'connected' | 'failed';
  testingStep: string;
  isNative: boolean;
  onTestConnection: () => void;
}

export const NetworkPrinter: React.FC<NetworkPrinterProps> = ({
  settings,
  onSettingChange,
  connectionStatus,
  testingStep,
  isNative,
  onTestConnection
}) => {
  return (
    <div className="space-y-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <Network className="h-4 w-4" />
          Xprinter Network Setup
        </h4>
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
          onClick={onTestConnection}
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
  );
};
