import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Product } from '@/types';

interface QuickAddProductProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

export const QuickAddProduct: React.FC<QuickAddProductProps> = ({ onAddProduct, onClose }) => {
  const [product, setProduct] = useState({
    name: '',
    buyingCost: 0,
    wholesalePrice: 0,
    retailPrice: 0,
    price: 0,
    category: 'General',
    stock: 0,
    unit: 'pcs'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product.name && product.retailPrice > 0) {
      const productToAdd = {
        name: product.name,
        buyingCost: product.buyingCost,
        wholesalePrice: product.wholesalePrice,
        retailPrice: product.retailPrice,
        price: product.retailPrice,
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
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buyingCost">Buying Cost</Label>
              <Input
                type="number"
                id="buyingCost"
                placeholder="0.00"
                value={product.buyingCost}
                onChange={(e) => setProduct({ ...product, buyingCost: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="wholesalePrice">Wholesale Price</Label>
              <Input
                type="number"
                id="wholesalePrice"
                placeholder="0.00"
                value={product.wholesalePrice}
                onChange={(e) => setProduct({ ...product, wholesalePrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="retailPrice">Retail Price</Label>
            <Input
              type="number"
              id="retailPrice"
              placeholder="0.00"
              value={product.retailPrice}
              onChange={(e) => setProduct({ ...product, retailPrice: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={product.category} onValueChange={(value) => setProduct({ ...product, category: value })}>
              <SelectTrigger>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                placeholder="0"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select value={product.unit} onValueChange={(value) => setProduct({ ...product, unit: value as "pcs" | "kg" | "bundle" | "litre" | "meter" | "box" })}>
                <SelectTrigger>
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
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
