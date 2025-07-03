
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit3, Trash2, Upload, X, Star, Tag, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnlineProduct {
  id: string;
  name: string;
  description: string;
  features: string[];
  category: string;
  originalPrice: number;
  salesPrice: number;
  offerPrice?: number;
  stock: number;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
}

export const OnlineStoreProductManagement: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<OnlineProduct[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
      features: ['A17 Pro Chip', '256GB Storage', 'Pro Camera System', '5G Connectivity'],
      category: 'Smartphones',
      originalPrice: 150000,
      salesPrice: 135000,
      offerPrice: 125000,
      stock: 25,
      images: ['iphone1.jpg', 'iphone2.jpg'],
      isActive: true,
      isFeatured: true,
      tags: ['Apple', 'Premium', 'Latest'],
      createdAt: new Date()
    }
  ]);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<OnlineProduct | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<OnlineProduct>>({
    name: '',
    description: '',
    features: [],
    category: '',
    originalPrice: 0,
    salesPrice: 0,
    offerPrice: 0,
    stock: 0,
    images: [],
    isActive: true,
    isFeatured: false,
    tags: []
  });

  const categories = ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Audio', 'Gaming'];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.salesPrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in product name and sales price",
        variant: "destructive",
      });
      return;
    }

    const product: OnlineProduct = {
      id: `product-${Date.now()}`,
      name: newProduct.name!,
      description: newProduct.description || '',
      features: newProduct.features || [],
      category: newProduct.category || 'General',
      originalPrice: newProduct.originalPrice || newProduct.salesPrice!,
      salesPrice: newProduct.salesPrice!,
      offerPrice: newProduct.offerPrice,
      stock: newProduct.stock || 0,
      images: newProduct.images || [],
      isActive: newProduct.isActive ?? true,
      isFeatured: newProduct.isFeatured ?? false,
      tags: newProduct.tags || [],
      createdAt: new Date()
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({
      name: '',
      description: '',
      features: [],
      category: '',
      originalPrice: 0,
      salesPrice: 0,
      offerPrice: 0,
      stock: 0,
      images: [],
      isActive: true,
      isFeatured: false,
      tags: []
    });
    setIsAddingProduct(false);

    toast({
      title: "Product Added",
      description: `${product.name} has been added to your online store`,
    });
  };

  const handleImageUpload = (files: FileList | null, isEditing: boolean = false) => {
    if (!files) return;

    const currentImages = isEditing ? editingProduct?.images || [] : newProduct.images || [];
    
    if (currentImages.length + files.length > 10) {
      toast({
        title: "Too Many Images",
        description: "Maximum 10 images allowed per product",
        variant: "destructive",
      });
      return;
    }

    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...currentImages, ...newImages]
      });
    } else {
      setNewProduct(prev => ({
        ...prev,
        images: [...currentImages, ...newImages]
      }));
    }
  };

  const removeImage = (index: number, isEditing: boolean = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: editingProduct.images.filter((_, i) => i !== index)
      });
    } else {
      setNewProduct(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index) || []
      }));
    }
  };

  const addFeature = (feature: string, isEditing: boolean = false) => {
    if (!feature.trim()) return;

    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        features: [...editingProduct.features, feature.trim()]
      });
    } else {
      setNewProduct(prev => ({
        ...prev,
        features: [...(prev.features || []), feature.trim()]
      }));
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Online Store Products</h2>
          <p className="text-gray-600">Manage products for your online store</p>
        </div>
        <Button onClick={() => setIsAddingProduct(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant={product.isActive ? 'default' : 'secondary'} className="mt-1">
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  {product.isFeatured && (
                    <Badge variant="default" className="bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Original:</span>
                    <span className="line-through">{formatPrice(product.originalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sales:</span>
                    <span className="font-semibold text-green-600">{formatPrice(product.salesPrice)}</span>
                  </div>
                  {product.offerPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Offer:</span>
                      <span className="font-bold text-red-600">{formatPrice(product.offerPrice)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span>Stock:</span>
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock} units
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Images:</span>
                  <span>{product.images.length}/10</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Online Product</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduct.name || ''}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newProduct.category || ''}
                  onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                >
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
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="originalPrice">Original Price (KES)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={newProduct.originalPrice || ''}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              
              <div>
                <Label htmlFor="salesPrice">Sales Price (KES)</Label>
                <Input
                  id="salesPrice"
                  type="number"
                  value={newProduct.salesPrice || ''}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, salesPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              
              <div>
                <Label htmlFor="offerPrice">Offer Price (KES) - Optional</Label>
                <Input
                  id="offerPrice"
                  type="number"
                  value={newProduct.offerPrice || ''}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, offerPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={newProduct.stock || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label>Product Images (Max 10)</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
                <div className="grid grid-cols-5 gap-2">
                  {(newProduct.images || []).map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newProduct.isActive ?? true}
                  onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={newProduct.isFeatured ?? false}
                  onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, isFeatured: checked }))}
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddProduct}>Add Product</Button>
              <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
