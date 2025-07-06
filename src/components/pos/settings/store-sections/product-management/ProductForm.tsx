
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  storeName: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  storeName
}) => {
  const { toast } = useToast();
  const [quickProduct, setQuickProduct] = useState({
    name: '',
    category: '',
    buyingCost: 0,
    retailPrice: 0,
    stock: 0,
    minStock: 5,
    description: ''
  });

  const handleAddProduct = () => {
    if (!quickProduct.name || !quickProduct.retailPrice) {
      toast({
        title: "Error",
        description: "Please fill in required fields (name and price)",
        variant: "destructive"
      });
      return;
    }

    onAddProduct({
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
    onClose();
    
    toast({
      title: "Product Added",
      description: `${quickProduct.name} has been added to ${storeName}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="relative z-50 bg-white">
        <DialogHeader>
          <DialogTitle>Quick Add Product to {storeName}</DialogTitle>
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
          <Button onClick={handleAddProduct} className="w-full">
            Add Product to Store
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
