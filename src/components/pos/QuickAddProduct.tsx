
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface QuickAddProductProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

export const QuickAddProduct: React.FC<QuickAddProductProps> = ({ onAddProduct, onClose }) => {
  const { toast } = useToast();
  const [product, setProduct] = useState({
    name: '',
    buyingCost: 0,
    wholesalePrice: 0,
    retailPrice: 0,
    category: 'General',
    stock: 0,
    unit: 'pcs' as "pcs" | "kg" | "bundle" | "litre" | "meter" | "box"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePrices = () => {
    const newErrors: Record<string, string> = {};
    
    if (product.buyingCost <= 0) {
      newErrors.buyingCost = 'Buying cost must be greater than 0';
    }
    
    if (product.wholesalePrice < product.buyingCost) {
      newErrors.wholesalePrice = 'Wholesale price must be at least the buying cost';
    }
    
    if (product.retailPrice < product.wholesalePrice) {
      newErrors.retailPrice = 'Retail price must be at least the wholesale price';
    }
    
    if (product.retailPrice <= 0) {
      newErrors.retailPrice = 'Retail price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePriceChange = (field: string, value: number) => {
    setProduct(prev => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product.name.trim()) {
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
    
    const productToAdd = {
      name: product.name.trim(),
      buyingCost: product.buyingCost,
      wholesalePrice: product.wholesalePrice,
      retailPrice: product.retailPrice,
      price: product.retailPrice, // Set price to retail price
      category: product.category,
      stock: product.stock,
      unit: product.unit,
      supplierId: 'default',
      description: '',
      barcode: '',
      minStock: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onAddProduct(productToAdd);
    onClose();
    
    toast({
      title: "Product Saved",
      description: `${product.name} has been added successfully`,
    });
  };

  const handleCancel = () => {
    setProduct({
      name: '',
      buyingCost: 0,
      wholesalePrice: 0,
      retailPrice: 0,
      category: 'General',
      stock: 0,
      unit: 'pcs'
    });
    setErrors({});
    onClose();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Quick Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={product.category} onValueChange={(value) => setProduct({ ...product, category: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="buyingCost">Buying Cost *</Label>
              <Input
                type="number"
                id="buyingCost"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={product.buyingCost}
                onChange={(e) => handlePriceChange('buyingCost', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.buyingCost ? 'border-red-500' : ''}`}
                required
              />
              {errors.buyingCost && (
                <p className="text-red-500 text-sm mt-1">{errors.buyingCost}</p>
              )}
            </div>

            <div>
              <Label htmlFor="wholesalePrice">Wholesale Price *</Label>
              <Input
                type="number"
                id="wholesalePrice"
                placeholder="0.00"
                min={product.buyingCost}
                step="0.01"
                value={product.wholesalePrice}
                onChange={(e) => handlePriceChange('wholesalePrice', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.wholesalePrice ? 'border-red-500' : ''}`}
                required
              />
              {errors.wholesalePrice && (
                <p className="text-red-500 text-sm mt-1">{errors.wholesalePrice}</p>
              )}
            </div>

            <div>
              <Label htmlFor="retailPrice">Retail Price (Sale Price) *</Label>
              <Input
                type="number"
                id="retailPrice"
                placeholder="0.00"
                min={product.wholesalePrice}
                step="0.01"
                value={product.retailPrice}
                onChange={(e) => handlePriceChange('retailPrice', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.retailPrice ? 'border-red-500' : ''}`}
                required
              />
              {errors.retailPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.retailPrice}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                placeholder="0"
                min="0"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select value={product.unit} onValueChange={(value) => setProduct({ ...product, unit: value as "pcs" | "kg" | "bundle" | "litre" | "meter" | "box" })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pcs</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                  <SelectItem value="litre">Litre</SelectItem>
                  <SelectItem value="meter">Meter</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save Product
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
