
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Product } from '@/types';

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Product Catalog</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredProducts.map(product => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{product.name}</h4>
                <p className="text-xs text-gray-600">{product.category}</p>
                <p className="text-green-600 font-semibold text-sm">{formatPrice(product.price)}</p>
              </div>
              <div className="text-right">
                <Badge variant={product.stock > product.lowStockThreshold ? "default" : "destructive"}>
                  Stock: {product.stock}
                </Badge>
                {product.barcode && (
                  <p className="text-xs text-gray-500 mt-1">{product.barcode}</p>
                )}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8">No products found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
