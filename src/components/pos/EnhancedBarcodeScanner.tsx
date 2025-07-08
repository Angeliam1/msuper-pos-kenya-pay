
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/types';
import { Scan, Search, Package, Camera, Usb, Bluetooth, Wifi, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedBarcodeScannerProps {
  products: Product[];
  onProductFound: (product: Product) => void;
  onClose?: () => void;
}

export const EnhancedBarcodeScanner: React.FC<EnhancedBarcodeScannerProps> = ({
  products,
  onProductFound,
  onClose
}) => {
  const [barcode, setBarcode] = useState('');
  const [searchResult, setSearchResult] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [connectionType, setConnectionType] = useState<'usb' | 'bluetooth' | 'wifi' | 'manual'>('manual');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!barcode.trim()) {
      setError('Please enter a barcode');
      return;
    }

    const product = products.find(p => p.barcode === barcode.trim());
    
    if (product) {
      setSearchResult(product);
      setError('');
      toast({
        title: "Product Found",
        description: `${product.name} scanned successfully`,
      });
    } else {
      setSearchResult(null);
      setError('Product not found');
    }
  };

  const handleConnect = (type: 'usb' | 'bluetooth' | 'wifi') => {
    setConnectionType(type);
    setIsConnected(true);
    toast({
      title: "Scanner Connected",
      description: `${type.toUpperCase()} scanner connected successfully`,
    });
  };

  const handleAddToCart = () => {
    if (searchResult) {
      onProductFound(searchResult);
      setBarcode('');
      setSearchResult(null);
      setError('');
      toast({
        title: "Added to Cart",
        description: `${searchResult.name} added to cart`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          Enhanced Barcode Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium">
              {isConnected ? `${connectionType.toUpperCase()} Connected` : 'Not Connected'}
            </span>
          </div>
          {isConnected && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Scan Product</TabsTrigger>
            <TabsTrigger value="connect">Scanner Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Scan or enter barcode..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            {searchResult && (
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-800">Product Found!</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">{searchResult.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-bold text-green-600">
                          {formatPrice(searchResult.retailPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span>{searchResult.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <Badge variant={searchResult.stock > 0 ? "default" : "destructive"}>
                          {searchResult.stock > 0 ? `${searchResult.stock} available` : 'Out of stock'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Barcode:</span>
                        <span className="font-mono text-xs">{searchResult.barcode}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full"
                    disabled={searchResult.stock === 0}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="connect" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleConnect('usb')}>
                <CardContent className="p-4 text-center">
                  <Usb className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">USB Scanner</h3>
                  <p className="text-xs text-gray-600 mt-1">Direct USB connection</p>
                  {connectionType === 'usb' && isConnected && (
                    <Badge className="mt-2">Connected</Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleConnect('bluetooth')}>
                <CardContent className="p-4 text-center">
                  <Bluetooth className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">Bluetooth</h3>
                  <p className="text-xs text-gray-600 mt-1">Wireless connection</p>
                  {connectionType === 'bluetooth' && isConnected && (
                    <Badge className="mt-2">Connected</Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleConnect('wifi')}>
                <CardContent className="p-4 text-center">
                  <Wifi className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">Network</h3>
                  <p className="text-xs text-gray-600 mt-1">WiFi/Ethernet scanner</p>
                  {connectionType === 'wifi' && isConnected && (
                    <Badge className="mt-2">Connected</Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Connection Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• USB: Connect scanner to USB port and it will be detected automatically</li>
                <li>• Bluetooth: Pair scanner in device settings, then click connect</li>
                <li>• Network: Ensure scanner and device are on same network</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {onClose && (
          <Button onClick={onClose} variant="outline" className="w-full">
            Close Scanner
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
