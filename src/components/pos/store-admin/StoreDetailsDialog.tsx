
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Users, Receipt, Settings } from 'lucide-react';

interface StoreDetailsDialogProps {
  store: any | null;
  isOpen: boolean;
  onClose: () => void;
  getStoreProducts: (storeId: string) => any[];
  getStoreCustomers: (storeId: string) => any[];
  getStoreTransactions: (storeId: string) => any[];
  getStoreCashBalance: (storeId: string) => number;
}

export const StoreDetailsDialog: React.FC<StoreDetailsDialogProps> = ({
  store,
  isOpen,
  onClose,
  getStoreProducts,
  getStoreCustomers,
  getStoreTransactions,
  getStoreCashBalance
}) => {
  if (!store) return null;

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{store.name} - Store Management</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Store Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Address:</strong> {store.address}</p>
                  <p><strong>Phone:</strong> {store.phone}</p>
                  <p><strong>Manager:</strong> {store.manager}</p>
                  <p><strong>Status:</strong> {store.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Quick Stats</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Products:</strong> {getStoreProducts(store.id).length}</p>
                  <p><strong>Customers:</strong> {getStoreCustomers(store.id).length}</p>
                  <p><strong>Transactions:</strong> {getStoreTransactions(store.id).length}</p>
                  <p><strong>Revenue:</strong> {formatPrice(getStoreCashBalance(store.id))}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Store-specific product management will be available here</p>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Store-specific customer management will be available here</p>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Store-specific transaction history will be available here</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Store-specific settings management will be available here</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
