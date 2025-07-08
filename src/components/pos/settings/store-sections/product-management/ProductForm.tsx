
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { Save, X } from 'lucide-react';

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
    wholesalePrice: 0,
    retailPrice: 0,
    stock: 0,
    minStock: 5,
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePrices = () => {
    const newErrors: Record<string, string> = {};
    
    if (quickProduct.buyingCost <= 0) {
      newErrors.buyingCost = 'Buying cost must be greater than 0';
    }
    
    if (quickProduct.wholesalePrice < quickProduct.buyingCost) {
      newErrors.wholesalePrice = 'Wholesale price must be at least the buying cost';
    }
    
    if (quickProduct.retailPrice < quickProduct.wholesalePrice) {
      newErrors.retailPrice = 'Retail price must be at least the wholesale price';
    }
    
    if (quickProduct.retailPrice <= 0) {
      newErrors.retailPrice = 'Retail price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePriceChange = (field: string, value: number) => {
    setQuickProduct(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-adjust dependent prices
      if (field === 'buyingCost' && value > updated.wholesalePrice) {
        updated.wholesalePrice = value;
      }
      
      if ((field === 'buyingCost' || field === 'wholesalePrice') && updated.wholesalePrice > updated.retailPrice) {
        updated.retailPrice = updated.wholesalePrice;
      }
      
      return updated;
    });
    
    // Clear errors when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveProduct = () => {
    if (!quickProduct.name.trim()) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive"
      });
      return;
    }

    if (!validatePrices()) {
      toast({
        title: "Error",
        description: "Please correct the price errors",
        variant: "destructive"
      });
      return;
    }

    onAddProduct({
      name: quickProduct.name.trim(),
      category: quickProduct.category || 'General',
      buyingCost: quickProduct.buyingCost,
      wholesalePrice: quickProduct.wholesalePrice,
      retailPrice: quickProduct.retailPrice,
      price: quickProduct.retailPrice, // Set price to retail price
      stock: quickProduct.stock,
      minStock: quickProduct.minStock,
      supplierId: '',
      description: quickProduct.description.trim(),
      barcode: `${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Reset form
    setQuickProduct({
      name: '',
      category: '',
      buyingCost: 0,
      wholesalePrice: 0,
      retailPrice: 0,
      stock: 0,
      minStock: 5,
      description: ''
    });
    setErrors({});
    onClose();
    
    toast({
      title: "Product Saved",
      description: `${quickProduct.name} has been added to ${storeName}`,
    });
  };

  const handleCancel = () => {
    setQuickProduct({
      name: '',
      category: '',
      buyingCost: 0,
      wholesalePrice: 0,
      retailPrice: 0,
      stock: 0,
      minStock: 5,
      description: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="relative z-50 bg-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Quick Add Product to {storeName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={quickProduct.name}
              onChange={(e) => setQuickProduct(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={quickProduct.category}
                onChange={(e) => setQuickProduct(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Product category"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={quickProduct.stock}
                onChange={(e) => setQuickProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="buyingCost">Buying Cost *</Label>
              <Input
                id="buyingCost"
                type="number"
                min="0"
                step="0.01"
                value={quickProduct.buyingCost}
                onChange={(e) => handlePriceChange('buyingCost', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.buyingCost ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.buyingCost && (
                <p className="text-red-500 text-sm mt-1">{errors.buyingCost}</p>
              )}
            </div>

            <div>
              <Label htmlFor="wholesalePrice">Wholesale Price *</Label>
              <Input
                id="wholesalePrice"
                type="number"
                min={quickProduct.buyingCost}
                step="0.01"
                value={quickProduct.wholesalePrice}
                onChange={(e) => handlePriceChange('wholesalePrice', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.wholesalePrice ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.wholesalePrice && (
                <p className="text-red-500 text-sm mt-1">{errors.wholesalePrice}</p>
              )}
            </div>

            <div>
              <Label htmlFor="retailPrice">Retail Price (Sale Price) *</Label>
              <Input
                id="retailPrice"
                type="number"
                min={quickProduct.wholesalePrice}
                step="0.01"
                value={quickProduct.retailPrice}
                onChange={(e) => handlePriceChange('retailPrice', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.retailPrice ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.retailPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.retailPrice}</p>
              )}
            </div>

            <div>
              <Label htmlFor="minStock">Minimum Stock Level</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={quickProduct.minStock}
                onChange={(e) => setQuickProduct(prev => ({ ...prev, minStock: parseInt(e.target.value) || 5 }))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={quickProduct.description}
              onChange={(e) => setQuickProduct(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Product description..."
              rows={3}
              className="mt-1 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSaveProduct}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Save Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
