import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Edit, Eye, ChevronRight } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

export const ProductsManagement: React.FC = () => {
  const { currentStore, getStoreProducts, addProductToStore } = useStore();
  const { toast } = useToast();

  const [showQuickAddProduct, setShowQuickAddProduct] = useState(false);
  const [quickProduct, setQuickProduct] = useState({
    name: '',
    category: '',
    buyingCost: 0,
    retailPrice: 0,
    stock: 0,
    minStock: 5,
    description: ''
  });

  const handleQuickAddProduct = () => {
    if (!currentStore || !quickProduct.name || !quickProduct.retailPrice) {
      toast({
        title: "Error",
        description: "Please fill in required fields (name and price)",
        variant: "destructive"
      });
      return;
    }

    addProductToStore(currentStore.id, {
      name: quickProduct.name,
      category: quickProduct.category || 'General',
      buyingCost: quickProduct.buyingCost,
      wholesalePrice: quickProduct.buyingCost,
      retailPrice: quickProduct.retailPrice,
      price: quickProduct.retailPrice,
      stock: quickProduct.stock,
      minStock: quickProduct.minStock,
      supplierId: '',
      description: quickProduct.description,
      barcode: `${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setQuickProduct({
      name: '',
      category: '',
      buyingCost: 0,
      retailPrice: 0,
      stock: 0,
      minStock: 5,
      description: ''
    });
    setShowQuickAddProduct(false);
    
    toast({
      title: "Product Added",
      description: `${quickProduct.name} has been added to ${currentStore.name}`,
    });
  };

  if (!currentStore) return null;

  const storeProducts = getStoreProducts(currentStore.id);

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
              <DialogContent className="relative z-50 bg-white">
                <DialogHeader>
                  <DialogTitle>Quick Add Product to {currentStore.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Product Name *</Label>
                    <Input
                      value={quickProduct.name}
                      onChange={(e) => setQuickProduct(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={quickProduct.category}
                        onChange={(e) => setQuickProduct(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Product category"
                      />
                    </div>
                    <div>
                      <Label>Stock Quantity</Label>
                      <Input
                        type="number"
                        value={quickProduct.stock}
                        onChange={(e) => setQuickProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Buying Cost</Label>
                      <Input
                        type="number"
                        value={quickProduct.buyingCost}
                        onChange={(e) => setQuickProduct(prev => ({ ...prev, buyingCost: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label>Retail Price *</Label>
                      <Input
                        type="number"
                        value={quickProduct.retailPrice}
                        onChange={(e) => setQuickProduct(prev => ({ ...prev, retailPrice: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label>Min Stock</Label>
                      <Input
                        type="number"
                        value={quickProduct.minStock}
                        onChange={(e) => setQuickProduct(prev => ({ ...prev, minStock: parseInt(e.target.value) || 5 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={quickProduct.description}
                      onChange={(e) => setQuickProduct(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Product description..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleQuickAddProduct} className="w-full">
                    Add Product to Store
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {storeProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">No products in this store yet</p>
              <Button onClick={() => setShowQuickAddProduct(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock < 10 ? "destructive" : "default"}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>KES {product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
