import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface ProductCatalogProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    buyingCost: 0,
    wholesalePrice: 0,
    retailPrice: 0,
    price: 0,
    stock: 0,
    barcode: '',
    supplierId: '',
    description: '',
    minStock: 5
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      const productToAdd = {
        supplierId: newProduct.supplierId || 'default-supplier',
        description: newProduct.description || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: newProduct.name,
        category: newProduct.category,
        buyingCost: newProduct.buyingCost,
        wholesalePrice: newProduct.wholesalePrice,
        retailPrice: newProduct.retailPrice,
        price: newProduct.price,
        stock: newProduct.stock,
        barcode: newProduct.barcode,
        minStock: newProduct.minStock || 5,
        id: generateId()
      };
      
      onAddProduct(productToAdd);
      setNewProduct({
        name: '',
        category: '',
        buyingCost: 0,
        wholesalePrice: 0,
        retailPrice: 0,
        price: 0,
        stock: 0,
        barcode: '',
        supplierId: '',
        description: '',
        minStock: 5
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Product Added",
        description: "New product added to catalog",
      });
    }
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    onUpdateProduct(id, updates);
    toast({
      title: "Product Updated",
      description: "Product details updated successfully",
    });
  };

  const handleDeleteProduct = (id: string) => {
    onDeleteProduct(id);
    toast({
      title: "Product Deleted",
      description: "Product removed from catalog",
      variant: "destructive",
    });
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Catalog</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Category"
                  />
                </div>
                <div>
                  <Label>Barcode</Label>
                  <Input
                    value={newProduct.barcode}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, barcode: e.target.value }))}
                    placeholder="Barcode"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Buying Cost</Label>
                  <Input
                    type="number"
                    value={newProduct.buyingCost}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, buyingCost: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Wholesale Price</Label>
                  <Input
                    type="number"
                    value={newProduct.wholesalePrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, wholesalePrice: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Retail Price</Label>
                  <Input
                    type="number"
                    value={newProduct.retailPrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, retailPrice: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
                 <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                  placeholder="Stock quantity"
                />
              </div>
              <Button onClick={handleAddProduct} className="w-full">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newPrice = prompt('Enter new price', product.price.toString());
                          if (newPrice) {
                            handleUpdateProduct(product.id, { price: parseFloat(newPrice) });
                          }
                        }}
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
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
