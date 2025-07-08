
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Printer, 
  Wifi, 
  Usb, 
  Bluetooth, 
  Settings, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  FileText,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrinterConfig {
  name: string;
  type: 'usb' | 'bluetooth' | 'network';
  address: string;
  port?: number;
  isConnected: boolean;
  status: 'online' | 'offline' | 'error' | 'busy';
}

interface ThermalPrinterProps {
  onPrintReceipt?: (receiptData: any) => void;
}

export const ThermalPrinter: React.FC<ThermalPrinterProps> = ({ onPrintReceipt }) => {
  const [printers, setPrinters] = useState<PrinterConfig[]>([
    {
      name: 'Thermal Printer 1',
      type: 'usb',
      address: 'USB001',
      isConnected: true,
      status: 'online'
    },
    {
      name: 'Network Printer',
      type: 'network',
      address: '192.168.1.100',
      port: 9100,
      isConnected: false,
      status: 'offline'
    }
  ]);

  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [showAddPrinter, setShowAddPrinter] = useState(false);
  const [newPrinter, setNewPrinter] = useState({
    name: '',
    type: 'usb' as 'usb' | 'bluetooth' | 'network',
    address: '',
    port: 9100
  });

  const [printSettings, setPrintSettings] = useState({
    autoCut: true,
    buzzer: false,
    copies: 1,
    fontSize: 'normal' as 'small' | 'normal' | 'large',
    density: 'medium' as 'light' | 'medium' | 'dark'
  });

  const { toast } = useToast();

  const handleTestPrint = async (printerId?: string) => {
    try {
      // Simulate printer communication
      const printer = printers.find(p => p.name === (printerId || selectedPrinter));
      if (!printer) {
        toast({
          title: "No Printer Selected",
          description: "Please select a printer first",
          variant: "destructive"
        });
        return;
      }

      if (!printer.isConnected) {
        toast({
          title: "Printer Offline",
          description: `${printer.name} is not connected`,
          variant: "destructive"
        });
        return;
      }

      // Update printer status to busy
      setPrinters(prev => prev.map(p => 
        p.name === printer.name ? { ...p, status: 'busy' } : p
      ));

      // Simulate printing delay
      setTimeout(() => {
        setPrinters(prev => prev.map(p => 
          p.name === printer.name ? { ...p, status: 'online' } : p
        ));

        toast({
          title: "Test Print Successful",
          description: `Test receipt printed on ${printer.name}`,
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "Print Failed",
        description: "Failed to print test receipt",
        variant: "destructive"
      });
    }
  };

  const handleConnectPrinter = (printerName: string) => {
    setPrinters(prev => prev.map(p => 
      p.name === printerName 
        ? { ...p, isConnected: !p.isConnected, status: !p.isConnected ? 'online' : 'offline' }
        : p
    ));

    const printer = printers.find(p => p.name === printerName);
    toast({
      title: printer?.isConnected ? "Printer Disconnected" : "Printer Connected",
      description: `${printerName} ${printer?.isConnected ? 'disconnected' : 'connected'} successfully`,
    });
  };

  const handleAddPrinter = () => {
    if (!newPrinter.name || !newPrinter.address) {
      toast({
        title: "Missing Information",
        description: "Name and address are required",
        variant: "destructive"
      });
      return;
    }

    const printer: PrinterConfig = {
      ...newPrinter,
      isConnected: false,
      status: 'offline'
    };

    setPrinters(prev => [...prev, printer]);
    setNewPrinter({ name: '', type: 'usb', address: '', port: 9100 });
    setShowAddPrinter(false);

    toast({
      title: "Printer Added",
      description: `${printer.name} added successfully`,
    });
  };

  const getStatusIcon = (status: string, isConnected: boolean) => {
    if (!isConnected) return <XCircle className="h-4 w-4 text-red-500" />;
    
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'usb':
        return <Usb className="h-4 w-4" />;
      case 'bluetooth':
        return <Bluetooth className="h-4 w-4" />;
      case 'network':
        return <Wifi className="h-4 w-4" />;
      default:
        return <Printer className="h-4 w-4" />;
    }
  };

  const sampleReceipt = {
    storeName: "M-Super POS",
    address: "123 Business St, Nairobi",
    phone: "+254 700 000 000",
    transactionId: "TXN-001",
    items: [
      { name: "Bread", qty: 2, price: 50, total: 100 },
      { name: "Milk", qty: 1, price: 80, total: 80 }
    ],
    subtotal: 180,
    tax: 28.8,
    total: 208.8,
    payment: "Cash",
    change: 91.2
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Printer className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Thermal Printer Management</h1>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected Printers</p>
                <p className="text-2xl font-bold">{printers.filter(p => p.isConnected).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Printers</p>
                <p className="text-2xl font-bold">{printers.length}</p>
              </div>
              <Printer className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Print Jobs Today</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printer List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Available Printers</CardTitle>
            <Button onClick={() => setShowAddPrinter(!showAddPrinter)}>
              Add Printer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddPrinter && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-4">Add New Printer</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Printer Name</Label>
                  <Input
                    value={newPrinter.name}
                    onChange={(e) => setNewPrinter({...newPrinter, name: e.target.value})}
                    placeholder="e.g., Main Counter Printer"
                  />
                </div>
                <div>
                  <Label>Connection Type</Label>
                  <Select
                    value={newPrinter.type}
                    onValueChange={(value: 'usb' | 'bluetooth' | 'network') => 
                      setNewPrinter({...newPrinter, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usb">USB</SelectItem>
                      <SelectItem value="bluetooth">Bluetooth</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Address/IP</Label>
                  <Input
                    value={newPrinter.address}
                    onChange={(e) => setNewPrinter({...newPrinter, address: e.target.value})}
                    placeholder={newPrinter.type === 'network' ? '192.168.1.100' : newPrinter.type === 'bluetooth' ? 'AA:BB:CC:DD:EE:FF' : 'USB001'}
                  />
                </div>
                {newPrinter.type === 'network' && (
                  <div>
                    <Label>Port</Label>
                    <Input
                      type="number"
                      value={newPrinter.port}
                      onChange={(e) => setNewPrinter({...newPrinter, port: Number(e.target.value)})}
                      placeholder="9100"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddPrinter}>Add Printer</Button>
                <Button variant="outline" onClick={() => setShowAddPrinter(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {printers.map(printer => (
              <div key={printer.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {getTypeIcon(printer.type)}
                  <div>
                    <h4 className="font-medium">{printer.name}</h4>
                    <p className="text-sm text-gray-600">
                      {printer.address} {printer.port && `:${printer.port}`}
                    </p>
                  </div>
                  <Badge variant={printer.isConnected ? "default" : "secondary"}>
                    {printer.type.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(printer.status, printer.isConnected)}
                    <span className="text-sm capitalize">{printer.status}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConnectPrinter(printer.name)}
                  >
                    {printer.isConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => handleTestPrint(printer.name)}
                    disabled={!printer.isConnected || printer.status === 'busy'}
                  >
                    Test Print
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Print Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Print Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Auto Cut Paper</Label>
                <Switch
                  checked={printSettings.autoCut}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, autoCut: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Sound Buzzer</Label>
                <Switch
                  checked={printSettings.buzzer}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, buzzer: checked})}
                />
              </div>
              
              <div>
                <Label>Number of Copies</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={printSettings.copies}
                  onChange={(e) => setPrintSettings({...printSettings, copies: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Font Size</Label>
                <Select
                  value={printSettings.fontSize}
                  onValueChange={(value: 'small' | 'normal' | 'large') => 
                    setPrintSettings({...printSettings, fontSize: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Print Density</Label>
                <Select
                  value={printSettings.density}
                  onValueChange={(value: 'light' | 'medium' | 'dark') => 
                    setPrintSettings({...printSettings, density: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex gap-4">
              <Button onClick={() => handleTestPrint()} className="flex-1">
                Print Test Receipt
              </Button>
              <Button variant="outline" className="flex-1">
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white border-2 border-dashed border-gray-300 p-4 font-mono text-sm max-w-xs mx-auto">
            <div className="text-center mb-4">
              <div className="font-bold">{sampleReceipt.storeName}</div>
              <div>{sampleReceipt.address}</div>
              <div>{sampleReceipt.phone}</div>
              <div className="border-b border-gray-300 my-2"></div>
            </div>
            
            <div className="mb-4">
              <div>TXN: {sampleReceipt.transactionId}</div>
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Time: {new Date().toLocaleTimeString()}</div>
              <div className="border-b border-gray-300 my-2"></div>
            </div>

            <div className="mb-4">
              {sampleReceipt.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} x{item.qty}</span>
                  <span>{item.total}</span>
                </div>
              ))}
              <div className="border-b border-gray-300 my-2"></div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>KES {sampleReceipt.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (16%):</span>
                <span>KES {sampleReceipt.tax}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>KES {sampleReceipt.total}</span>
              </div>
            </div>

            <div className="text-center">
              <div>Payment: {sampleReceipt.payment}</div>
              <div>Change: KES {sampleReceipt.change}</div>
              <div className="mt-4 text-xs">Thank you for your business!</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
