
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Shield, Package, DollarSign } from 'lucide-react';

interface StoreOverviewStatsProps {
  stores: any[];
  getStoreProducts: (storeId: string) => any[];
  getStoreCashBalance: (storeId: string) => number;
}

export const StoreOverviewStats: React.FC<StoreOverviewStatsProps> = ({
  stores,
  getStoreProducts,
  getStoreCashBalance
}) => {
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Store className="h-4 w-4 text-blue-600" />
            <div className="text-2xl font-bold">{stores.length}</div>
          </div>
          <p className="text-xs text-muted-foreground">Total Stores</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-600" />
            <div className="text-2xl font-bold">{stores.filter(s => s.isActive).length}</div>
          </div>
          <p className="text-xs text-muted-foreground">Active Stores</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-purple-600" />
            <div className="text-2xl font-bold">
              {stores.reduce((total, store) => total + getStoreProducts(store.id).length, 0)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Total Products</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-orange-600" />
            <div className="text-2xl font-bold">
              {formatPrice(stores.reduce((total, store) => total + getStoreCashBalance(store.id), 0))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Total Revenue</p>
        </CardContent>
      </Card>
    </div>
  );
};
