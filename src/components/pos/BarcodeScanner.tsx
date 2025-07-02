
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Scan, Search, Package, Camera } from 'lucide-react';
import { CameraScanner } from './CameraScanner';

interface BarcodeScannerProps {
  products: Product[];
  onProductFound: (product: Product) => void;
  onClose?: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  products,
  onProductFound,
  onClose
}) => {
  const [barcode, setBarcode] = useState('');
  const [searchResult, setSearchResult] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const handleSearch = () => {
    if (!barcode.trim()) {
      setError('Please enter a barcode');
      return;
    }

    const product = products.find(p => p.barcode === barcode.trim());
    
    if (product) {
      setSearchResult(product);
      setError('');
    } else {
      setSearchResult(null);
      setError('Product not found');
    }
  };

  const handleAddToCart = () => {
    if (searchResult) {
      onProductFound(searchResult);
      setBarcode('');
      setSearchResult(null);
      setError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  if (showCamera) {
    return (
      <CameraScanner
        products={products}
        onProductFound={onProductFound}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          Barcode Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          
          <Button 
            onClick={() => setShowCamera(true)} 
            variant="outline" 
            className="w-full"
          >
            <Camera className="h-4 w-4 mr-2" />
            Use Camera
          </Button>
          
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
                <div className="flex justify-between items-center text-sm">
                  <span>Price:</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(searchResult.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Category:</span>
                  <span>{searchResult.category}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Stock:</span>
                  <Badge variant={searchResult.stock > 0 ? "default" : "destructive"}>
                    {searchResult.stock > 0 ? `${searchResult.stock} available` : 'Out of stock'}
                  </Badge>
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

        <div className="text-center text-sm text-gray-500">
          <p>Scan barcode with camera or enter manually</p>
        </div>

        {onClose && (
          <Button onClick={onClose} variant="outline" className="w-full">
            Close Scanner
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
