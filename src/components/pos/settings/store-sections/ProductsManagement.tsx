
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Package, Plus, ChevronRight } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { ProductForm } from './product-management/ProductForm';
import { ProductTable } from './product-management/ProductTable';
import { EmptyProductsState } from './product-management/EmptyProductsState';

export const ProductsManagement: React.FC = () => {
  const { currentStore, getStoreProducts, addProductToStore } = useStore();
  const [showQuickAddProduct, setShowQuickAddProduct] = useState(false);

  if (!currentStore) return null;

  const storeProducts = getStoreProducts(currentStore.id);

  const handleAddProduct = (product: any) => {
    addProductToStore(currentStore.id, product);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products ({storeProducts.length})
              </div>
              <ChevronRight className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
        </Card>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Store Products ({storeProducts.length})
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog open={showQuickAddProduct} onOpenChange={setShowQuickAddProduct}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Add Product
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
          
          {storeProducts.length === 0 ? (
            <EmptyProductsState onAddFirstProduct={() => setShowQuickAddProduct(true)} />
          ) : (
            <ProductTable products={storeProducts} />
          )}
        </div>
        
        <ProductForm
          isOpen={showQuickAddProduct}
          onClose={() => setShowQuickAddProduct(false)}
          onAddProduct={handleAddProduct}
          storeName={currentStore.name}
        />
      </SheetContent>
    </Sheet>
  );
};
