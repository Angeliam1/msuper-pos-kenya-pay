
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types';
import { Plus, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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

  const categories = ['Beverages', 'Bakery', 'Dairy', 'Groceries', 'Electronics', 'Clothing'];
  const units = ['pcs', 'kg', 'bundle', 'litre', 'meter', 'box'];

  const resetForm = () => {
    setFormData({ 
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
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const buyingCost = parseFloat(formData.buyingCost);
    const wholesalePrice = parseFloat(formData.wholesalePrice);
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

    const productData = {
      name: formData.name,
      buyingCost,
      wholesalePrice,
      retailPrice,
      price: retailPrice, // Default selling price is retail
      category: formData.category,
      stock: parseInt(formData.stock),
      unit: formData.unit as 'pcs' | 'kg' | 'bundle' | 'litre' | 'meter' | 'box',
      barcode: formData.barcode || undefined,
      lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : 10
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
    } else {
      onAddProduct(productData);
    }

    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      buyingCost: product.buyingCost.toString(),
      wholesalePrice: product.wholesalePrice.toString(),
      retailPrice: product.retailPrice.toString(),
      category: product.category,
      stock: product.stock.toString(),
      unit: product.unit,
      barcode: product.barcode || '',
      lowStockThreshold: (product.lowStockThreshold || 10).toString()
    });
    setIsOpen(true);
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getStockStatus = (product: Product) => {
    const threshold = product.lowStockThreshold || 10;
    if (product.stock === 0) return { variant: 'destructive' as const, text: 'Out of stock' };
    if (product.stock <= threshold) return { variant: 'secondary' as const, text: `Low stock (${product.stock})` };
    return { variant: 'default' as const, text: `${product.stock} in stock` };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="buyingCost">Buying Cost</Label>
                  <Input
                    id="buyingCost"
                    type="number"
                    step="0.01"
                    value={formData.buyingCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, buyingCost: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="wholesalePrice">Wholesale</Label>
                  <Input
                    id="wholesalePrice"
                    type="number"
                    step="0.01"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, wholesalePrice: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="retailPrice">Retail</Label>
                  <Input
                    id="retailPrice"
                    type="number"
                    step="0.01"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, retailPrice: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="barcode">Barcode (Optional)</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                  placeholder="Enter product barcode"
                />
              </div>

              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Alert (Default: 10)</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, lowStockThreshold: e.target.value }))}
                  placeholder="10"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingProduct ? 'Update' : 'Add'} Product
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => {
          const stockStatus = getStockStatus(product);
          return (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      {stockStatus.variant !== 'default' && (
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                      )}
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.text}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-green-600">{formatPrice(product.retailPrice)}</p>
                    <p className="text-sm text-gray-600">Wholesale: {formatPrice(product.wholesalePrice)}</p>
                    <p className="text-sm text-gray-600">Buying: {formatPrice(product.buyingCost)}</p>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{product.category} • {product.unit}</p>
                    {product.barcode && (
                      <p className="font-mono text-xs">Barcode: {product.barcode}</p>
                    )}
                    <p>Alert threshold: {product.lowStockThreshold || 10}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteProduct(product.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
