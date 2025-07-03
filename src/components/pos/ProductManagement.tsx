
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export const ProductManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  // Queries
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // Mutations
  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Success", description: "Product added successfully" });
      resetForm();
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) => 
      updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Success", description: "Product updated successfully" });
      resetForm();
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Success", description: "Product deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

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
      toast({ title: "Validation Error", description: "Wholesale price must be greater than or equal to buying cost", variant: "destructive" });
      return;
    }
    if (wholesalePrice > retailPrice) {
      toast({ title: "Validation Error", description: "Retail price must be greater than or equal to wholesale price", variant: "destructive" });
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
      updateProductMutation.mutate({ id: editingProduct.id, updates: productData });
    } else {
      addProductMutation.mutate(productData);
    }
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

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getStockStatus = (product: Product) => {
    const threshold = product.lowStockThreshold || 10;
    if (product.stock === 0) return { variant: 'destructive' as const, text: 'Out of stock' };
    if (product.stock <= threshold) return { variant: 'secondary' as const, text: `Low stock (${product.stock})` };
    return { variant: 'default' as const, text: `${product.stock} in stock` };
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading products...</div>;
  }

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
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={addProductMutation.isPending || updateProductMutation.isPending}
                >
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
                      onClick={() => handleDelete(product.id)}
                      className="flex-1"
                      disabled={deleteProductMutation.isPending}
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
