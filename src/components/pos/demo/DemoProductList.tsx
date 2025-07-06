
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { Product } from '@/types';

interface DemoProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  formatPrice: (price: number) => string;
}

export const DemoProductList: React.FC<DemoProductListProps> = ({
  products,
  onAddToCart,
  formatPrice
}) => {
  return (
    <div className="p-4">
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Wholesale: {formatPrice(product.wholesalePrice || product.buyingCost)}
                </div>
                <p className="text-sm font-semibold text-green-600 mt-1">
                  Retail: {formatPrice(product.retailPrice)}
                </p>
              </div>
              
              <Button
                onClick={() => onAddToCart(product)}
                size="sm"
                disabled={product.stock <= 0}
                className="h-10 w-10 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No products found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
