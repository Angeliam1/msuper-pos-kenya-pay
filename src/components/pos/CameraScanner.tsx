
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Camera, X, Scan, Package } from 'lucide-react';

interface CameraScannerProps {
  products: Product[];
  onProductFound: (product: Product) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  products,
  onProductFound,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Camera access denied or not available');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const simulateBarcodeScan = () => {
    // Simulate finding a product (in real implementation, this would use barcode detection)
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (randomProduct) {
      setFoundProduct(randomProduct);
      stopCamera();
    }
  };

  const handleAddToCart = () => {
    if (foundProduct) {
      onProductFound(foundProduct);
      onClose();
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Barcode Scanner
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={startCamera} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : foundProduct ? (
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800">Product Found!</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">{foundProduct.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span>Price:</span>
                    <span className="font-bold text-green-600">
                      {formatPrice(foundProduct.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Stock:</span>
                    <Badge variant={foundProduct.stock > 0 ? "default" : "destructive"}>
                      {foundProduct.stock > 0 ? `${foundProduct.stock} available` : 'Out of stock'}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full"
                  disabled={foundProduct.stock === 0}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white rounded-lg w-48 h-32 opacity-50"></div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Position the barcode within the frame
                </p>
                <Button onClick={simulateBarcodeScan} className="w-full">
                  <Scan className="h-4 w-4 mr-2" />
                  Simulate Scan (Demo)
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
