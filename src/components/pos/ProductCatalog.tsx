
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Edit, Search, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/database';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const ProductCatalog: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    buyingCost: 0,
    wholesalePrice: 0,
    retailPrice: 0,
    price: 0,
    stock: 0,
    barcode: '',
    description: ''
  });

  const { data: products = [], refetch } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const categories = ['Electronics', 'Computers', 'Phones', 'Accessories', 'Gaming', 'Audio'];

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return product.name.toLowerCase().includes(searchLower) ||
           product.category.toLowerCase().includes(searchLower) ||
           product.barcode?.includes(searchTerm);
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const productData: Product = {
      id: `product-${Date.now()}`,
      ...newProduct,
      supplierId: '',
      description: newProduct.description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await addProduct(productData);
      setShowAddDialog(false);
      setNewProduct({
        name: '',
        category: '',
        buyingCost: 0,
        wholesalePrice: 0,
        retailPrice: 0,
        price: 0,
        stock: 0,
        barcode: '',
        description: ''
      });
      refetch();
      toast({
        title: "Product Added",
        description: "Product has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
      refetch();
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      refetch();
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => `KSh${price.toLocaleString()}.00`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Catalog</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Buying Cost</Label>
                  <Input
                    type="number"
                    value={newProduct.buyingCost}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, buyingCost: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Wholesale Price</Label>
                  <Input
                    type="number"
                    value={newProduct.wholesalePrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, wholesalePrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Retail Price</Label>
                  <Input
                    type="number"
                    value={newProduct.retailPrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, retailPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Selling Price</Label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div>
                <Label>Barcode (Optional)</Label>
                <Input
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, barcode: e.target.value }))}
                  placeholder="Enter barcode"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description"
                />
              </div>
              <Button onClick={handleAddProduct} className="w-full">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Buy:</span>
                    <div className="font-medium">{formatPrice(product.buyingCost)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Wholesale:</span>
                    <div className="font-medium">{formatPrice(product.wholesalePrice || product.buyingCost)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Retail:</span>
                    <div className="font-medium">{formatPrice(product.retailPrice)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Current:</span>
                    <div className="font-bold text-green-600">{formatPrice(product.price)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <Badge variant={product.stock > 10 ? 'default' : 'destructive'}>
                    {product.stock} units
                  </Badge>
                </div>
                {product.barcode && (
                  <div className="text-xs text-gray-500">
                    Barcode: {product.barcode}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Buying Cost</Label>
                  <Input
                    type="number"
                    value={editingProduct.buyingCost}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, buyingCost: parseFloat(e.target.value) || 0 } : null)}
                  />
                </div>
                <div>
                  <Label>Wholesale Price</Label>
                  <Input
                    type="number"
                    value={editingProduct.wholesalePrice || 0}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, wholesalePrice: parseFloat(e.target.value) || 0 } : null)}
                  />
                </div>
                <div>
                  <Label>Retail Price</Label>
                  <Input
                    type="number"
                    value={editingProduct.retailPrice}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, retailPrice: parseFloat(e.target.value) || 0 } : null)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Price</Label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : null)}
                  />
                </div>
              </div>
              <Button onClick={handleUpdateProduct} className="w-full">
                Update Product
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
