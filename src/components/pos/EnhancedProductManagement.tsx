
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Package, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  TrendingUp,
  BarChart3,
  Archive
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface EnhancedProductManagementProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

export const EnhancedProductManagement: React.FC<EnhancedProductManagementProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    name: '',
    barcode: '',
    category: '',
    retailPrice: '',
    wholesalePrice: '',
    buyingCost: '',
    stock: '',
    minStockLevel: '',
    description: ''
  });

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low' && product.stock <= product.minStockLevel) ||
                        (stockFilter === 'out' && product.stock === 0) ||
                        (stockFilter === 'in' && product.stock > 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.minStockLevel && p.stock > 0);
  };

  const getOutOfStockProducts = () => {
    return products.filter(p => p.stock === 0);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.retailPrice || !newProduct.buyingCost) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const product = {
      name: newProduct.name,
      barcode: newProduct.barcode || undefined,
      category: newProduct.category || 'General',
      retailPrice: parseFloat(newProduct.retailPrice),
      wholesalePrice: parseFloat(newProduct.wholesalePrice) || parseFloat(newProduct.retailPrice),
      buyingCost: parseFloat(newProduct.buyingCost),
      stock: parseInt(newProduct.stock) || 0,
      minStockLevel: parseInt(newProduct.minStockLevel) || 5,
      description: newProduct.description || undefined
    };

    onAddProduct(product);
    setNewProduct({
      name: '', barcode: '', category: '', retailPrice: '', wholesalePrice: '',
      buyingCost: '', stock: '', minStockLevel: '', description: ''
    });
    setShowAddDialog(false);
    
    toast({
      title: "Product Added",
      description: `${product.name} added successfully`,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      barcode: product.barcode || '',
      category: product.category,
      retailPrice: product.retailPrice.toString(),
      wholesalePrice: product.wholesalePrice?.toString() || '',
      buyingCost: product.buyingCost.toString(),
      stock: product.stock.toString(),
      minStockLevel: product.minStockLevel.toString(),
      description: product.description || ''
    });
    setShowAddDialog(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updates = {
      name: newProduct.name,
      barcode: newProduct.barcode || undefined,
      category: newProduct.category || 'General',
      retailPrice: parseFloat(newProduct.retailPrice),
      wholesalePrice: parseFloat(newProduct.wholesalePrice) || parseFloat(newProduct.retailPrice),
      buyingCost: parseFloat(newProduct.buyingCost),
      stock: parseInt(newProduct.stock) || 0,
      minStockLevel: parseInt(newProduct.minStockLevel) || 5,
      description: newProduct.description || undefined
    };

    onUpdateProduct(editingProduct.id, updates);
    setEditingProduct(null);
    setNewProduct({
      name: '', barcode: '', category: '', retailPrice: '', wholesalePrice: '',
      buyingCost: '', stock: '', minStockLevel: '', description: ''
    });
    setShowAddDialog(false);
    
    toast({
      title: "Product Updated",
      description: `${updates.name} updated successfully`,
    });
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const lowStockCount = getLowStockProducts().length;
  const outOfStockCount = getOutOfStockProducts().length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <Archive className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Button */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label>Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, barcode, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stock Status</Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProduct(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <Label>Product Name *</Label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label>Barcode</Label>
                    <Input
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                      placeholder="Scan or enter barcode"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      placeholder="Product category"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Buying Cost *</Label>
                      <Input
                        type="number"
                        value={newProduct.buyingCost}
                        onChange={(e) => setNewProduct({...newProduct, buyingCost: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Wholesale Price</Label>
                      <Input
                        type="number"
                        value={newProduct.wholesalePrice}
                        onChange={(e) => setNewProduct({...newProduct, wholesalePrice: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Retail Price *</Label>
                    <Input
                      type="number"
                      value={newProduct.retailPrice}
                      onChange={(e) => setNewProduct({...newProduct, retailPrice: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Stock Quantity</Label>
                      <Input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Min Stock Level</Label>
                      <Input
                        type="number"
                        value={newProduct.minStockLevel}
                        onChange={(e) => setNewProduct({...newProduct, minStockLevel: e.target.value})}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Product description"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="flex-1"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddDialog(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{product.name}</h4>
                    {product.stock <= product.minStockLevel && (
                      <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                        {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {product.category} • Stock: {product.stock} • Min: {product.minStockLevel}
                  </div>
                  <div className="text-sm mt-1">
                    <span className="text-gray-600">Cost: {formatPrice(product.buyingCost)}</span>
                    {product.wholesalePrice && (
                      <span className="text-gray-600 ml-3">Wholesale: {formatPrice(product.wholesalePrice)}</span>
                    )}
                    <span className="text-green-600 ml-3 font-medium">Retail: {formatPrice(product.retailPrice)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Delete ${product.name}?`)) {
                        onDeleteProduct(product.id);
                        toast({
                          title: "Product Deleted",
                          description: `${product.name} has been deleted`,
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found matching your filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
