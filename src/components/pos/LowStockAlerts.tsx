
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { AlertTriangle, Package, Bell } from 'lucide-react';

interface LowStockAlertsProps {
  products: Product[];
  onRestock?: (productId: string) => void;
}

export const LowStockAlerts: React.FC<LowStockAlertsProps> = ({
  products,
  onRestock
}) => {
  const lowStockProducts = products.filter(product => {
    const threshold = product.lowStockThreshold || 10;
    return product.stock <= threshold && product.stock > 0;
  });

  const outOfStockProducts = products.filter(product => product.stock === 0);

  if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Stock Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-green-600">
            <Bell className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">All products are well stocked!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Stock Alerts ({lowStockProducts.length + outOfStockProducts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {outOfStockProducts.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Out of Stock ({outOfStockProducts.length})
            </h3>
            <div className="space-y-2">
              {outOfStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Out of Stock</Badge>
                    {onRestock && (
                      <Button size="sm" onClick={() => onRestock(product.id)}>
                        Restock
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lowStockProducts.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-orange-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Low Stock ({lowStockProducts.length})
            </h3>
            <div className="space-y-2">
              {lowStockProducts.map(product => {
                const threshold = product.lowStockThreshold || 10;
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {product.stock} left (min: {threshold})
                      </Badge>
                      {onRestock && (
                        <Button size="sm" onClick={() => onRestock(product.id)}>
                          Restock
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
