import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Package,
  DollarSign,
  TrendingUp,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductImageManager } from './ProductImageManager';

interface OnlineProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  stock: number;
  sku: string;
  images: ProductImage[];
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  weight?: number;
  dimensions?: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  hasWatermark: boolean;
}

export const OnlineStoreProducts: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OnlineProduct | null>(null);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);

  // Mock online store products - separate from POS inventory
  const [products, setProducts] = useState<OnlineProduct[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with advanced camera system and A17 Pro chip',
      price: 180000,
      compareAtPrice: 200000,
      category: 'Electronics',
      stock: 25,
      sku: 'IPH15PM-256',
      images: [
        {
          id: 'img1',
          url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop',
          alt: 'iPhone 15 Pro Max front view',
          isPrimary: true,
          hasWatermark: true
        }
      ],
      isActive: true,
      isFeatured: true,
      seoTitle: 'iPhone 15 Pro Max - Best Price in Kenya',
      seoDescription: 'Buy iPhone 15 Pro Max online with free delivery in Nairobi',
      tags: ['smartphone', 'apple', 'ios', 'premium'],
      weight: 0.221,
      dimensions: '159.9 × 76.7 × 8.25 mm'
    },
    {
      id: '2',
      name: 'Samsung Galaxy Watch 6',
      description: 'Advanced smartwatch with health monitoring and GPS',
      price: 45000,
      compareAtPrice: 55000,
      category: 'Electronics',
      stock: 15,
      sku: 'SGW6-44MM',
      images: [
        {
          id: 'img2',
          url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
          alt: 'Samsung Galaxy Watch 6',
          isPrimary: true,
          hasWatermark: true
        }
      ],
      isActive: true,
      isFeatured: false,
      tags: ['smartwatch', 'samsung', 'fitness', 'health'],
      weight: 0.063
    }
  ]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleActive = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isActive: !product.isActive }
          : product
      )
    );
    toast({
      title: "Product Updated",
      description: "Product visibility has been updated",
    });
  };

  const handleToggleFeatured = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isFeatured: !product.isFeatured }
          : product
      )
    );
    toast({
      title: "Product Updated",
      description: "Featured status has been updated",
    });
  };

  const getPrimaryImage = (product: OnlineProduct) => {
    const primaryImage = product.images.find(img => img.isPrimary);
    return primaryImage || product.images[0];
  };

  const getDiscountPercentage = (comparePrice: number, actualPrice: number) => {
    if (!comparePrice || comparePrice <= actualPrice) return 0;
    return Math.round(((comparePrice - actualPrice) / comparePrice) * 100);
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleAddImage = (productId: string, image: Omit<ProductImage, 'id'>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              images: [...product.images, { ...image, id: `img-${Date.now()}` }] 
            }
          : product
      )
    );
    toast({
      title: "Image Added",
      description: "Product image has been added successfully",
    });
  };

  const handleRemoveImage = (productId: string, imageId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              images: product.images.filter(img => img.id !== imageId) 
            }
          : product
      )
    );
    toast({
      title: "Image Removed",
      description: "Product image has been removed",
    });
  };

  const handleSetPrimaryImage = (productId: string, imageId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              images: product.images.map(img => ({
                ...img,
                isPrimary: img.id === imageId
              }))
            }
          : product
      )
    );
    toast({
      title: "Primary Image Set",
      description: "Primary image has been updated",
    });
  };

  const handleToggleWatermark = (productId: string, imageId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              images: product.images.map(img => 
                img.id === imageId 
                  ? { ...img, hasWatermark: !img.hasWatermark }
                  : img
              )
            }
          : product
      )
    );
    toast({
      title: "Watermark Updated",
      description: "Image watermark has been updated",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Online Store Products</h2>
          <p className="text-gray-600">Manage products specifically for your online store</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Online Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="Enter product name" />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Product SKU" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Product description" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price (KES)</Label>
                  <Input id="price" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="comparePrice">Compare Price</Label>
                  <Input id="comparePrice" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="computers">Computers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.001" placeholder="0.000" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Active (visible in store)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="featured" />
                  <Label htmlFor="featured">Featured product</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Add Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
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
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const primaryImage = getPrimaryImage(product);
          const discountPercentage = product.compareAtPrice ? 
            getDiscountPercentage(product.compareAtPrice, product.price) : 0;

          return (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {primaryImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={primaryImage.url}
                          alt={primaryImage.alt}
                          className="w-full h-full object-cover"
                        />
                        {primaryImage.hasWatermark && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-white text-xs font-bold opacity-30 rotate-12 select-none">
                              DIGITALDEN.CO.KE
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{discountPercentage}%
                      </Badge>
                    )}
                    
                    {/* Image Count Badge */}
                    {product.images.length > 1 && (
                      <Badge className="absolute top-2 right-2 bg-black/50 text-white">
                        {product.images.length} photos
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 ml-2">
                        {product.isFeatured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(product.id)}
                        >
                          {product.isActive ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
                    
                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                          {product.stock} in stock
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>SKU: {product.sku}</span>
                      <span>{product.category}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={product.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {product.isActive ? 'Live' : 'Hidden'}
                      </Badge>
                      {product.isFeatured && (
                        <Badge variant="outline" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      {discountPercentage > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          -{discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFeatured(product.id)}
                      >
                        <Star className={`h-4 w-4 ${product.isFeatured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsImageManagerOpen(true);
                        }}
                        title="Manage Images"
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Add your first online store product to get started</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Image Manager Dialog */}
      <Dialog open={isImageManagerOpen} onOpenChange={setIsImageManagerOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Images - {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductImageManager
              images={selectedProduct.images}
              onAddImage={(image) => handleAddImage(selectedProduct.id, image)}
              onRemoveImage={(imageId) => handleRemoveImage(selectedProduct.id, imageId)}
              onSetPrimary={(imageId) => handleSetPrimaryImage(selectedProduct.id, imageId)}
              onToggleWatermark={(imageId) => handleToggleWatermark(selectedProduct.id, imageId)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
