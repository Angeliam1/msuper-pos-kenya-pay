
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Store, Search, Users, DollarSign, Package, Crown } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

interface StoreSelectorProps {
  onStoreSelect: (storeId: string) => void;
  onBack: () => void;
}

export const StoreSelector: React.FC<StoreSelectorProps> = ({ onStoreSelect, onBack }) => {
  const { stores, getStoreProducts, getStoreCashBalance, getStoreCustomers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getStatusColor = (status: string, isActive: boolean) => {
    if (!isActive) return 'destructive';
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 border-red-200">
          <CardHeader className="bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-red-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-red-600" />
                  <div>
                    <CardTitle className="text-red-800">Super Admin Dashboard</CardTitle>
                    <p className="text-red-600 text-sm">Select a store to manage</p>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-red-600 border-red-300">
                {filteredStores.length} stores
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search stores by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => {
            const products = getStoreProducts(store.id);
            const customers = getStoreCustomers(store.id);
            const revenue = getStoreCashBalance(store.id);

            return (
              <Card 
                key={store.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedStore === store.id ? 'ring-2 ring-red-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedStore(store.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        <p className="text-sm text-gray-600">{store.address}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(store.status || 'active', store.isActive)}>
                      {store.status || (store.isActive ? 'Active' : 'Inactive')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <Package className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="text-lg font-bold">{products.length}</div>
                      <div className="text-xs text-gray-500">Products</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-lg font-bold">{customers.length}</div>
                      <div className="text-xs text-gray-500">Customers</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="text-sm font-bold">{formatPrice(revenue)}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>

                  {store.managerId && (
                    <div className="text-sm text-gray-600">
                      <strong>Manager ID:</strong> {store.managerId}
                    </div>
                  )}

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStoreSelect(store.id);
                    }}
                    className="w-full"
                    variant={selectedStore === store.id ? "default" : "outline"}
                    disabled={!store.isActive}
                  >
                    {store.isActive ? 'Access Store' : 'Store Suspended'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredStores.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No stores match "${searchTerm}". Try adjusting your search.`
                  : 'No stores have been registered yet.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
