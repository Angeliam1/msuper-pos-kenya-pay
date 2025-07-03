
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Product } from '@/types';

interface QuickAddProductProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
  categories: string[];
}

export const QuickAddProduct: React.FC<QuickAddProductProps> = ({
  onAddProduct,
  onClose,
  categories
}) => {
  const [formData, setFormData] = useState({
    name: '',
    buyingCost: '',
    wholesalePrice: '',
    retailPrice: '',
    category: '',
    stock: '',
    unit: 'pcs',
    barcode: '',
    lowStockThreshold: ''
  });

  const units = ['pcs', 'kg', 'bundle', 'litre', 'meter', 'box'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.retailPrice || !formData.category || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    const buyingCost = parseFloat(formData.buyingCost) || 0;
    const wholesalePrice = parseFloat(formData.wholesalePrice) || parseFloat(formData.retailPrice);
    const retailPrice = parseFloat(formData.retailPrice);

    // Validation: buying cost <= wholesale <= retail
    if (buyingCost > wholesalePrice) {
      alert('Wholesale price must be greater than or equal to buying cost');
      return;
    }
    if (wholesalePrice > retailPrice) {
      alert('Retail price must be greater than or equal to wholesale price');
      return;
    }

    const productData: Omit<Product, 'id'> = {
      name: formData.name,
      buyingCost,
      wholesalePrice,
      retailPrice,
      price: retailPrice, // Default selling price is retail
      category: formData.category,
      stock: parseInt(formData.stock),
      unit: formData.unit as 'pcs' | 'kg' | 'bundle' | 'litre' | 'meter' | 'box',
      barcode: formData.barcode || undefined,
      lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : 5,
      supplierId: '',
      description: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onAddProduct(productData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Quick Add Product</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="buyingCost" className="text-sm">Buying Cost</Label>
                <Input
                  id="buyingCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.buyingCost}
                  onChange={(e) => handleInputChange('buyingCost', e.target.value)}
                  className="text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="wholesalePrice" className="text-sm">Wholesale</Label>
                <Input
                  id="wholesalePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.wholesalePrice}
                  onChange={(e) => handleInputChange('wholesalePrice', e.target.value)}
                  className="text-sm"
                  placeholder="Auto"
                />
              </div>
              <div>
                <Label htmlFor="retailPrice" className="text-sm">Retail (KSh) *</Label>
                <Input
                  id="retailPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.retailPrice}
                  onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                  className="text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="stock" className="text-sm">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  className="text-sm"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="unit" className="text-sm">Unit</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => handleInputChange('unit', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit} className="text-sm">
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-sm">
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other" className="text-sm">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="barcode" className="text-sm">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="lowStockThreshold" className="text-sm">Low Stock Alert</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                placeholder="5"
                className="text-sm"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
