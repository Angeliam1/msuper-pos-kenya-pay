
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Search, Plus, ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && product.stock > 0;
  });

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  // Mock function to get compare price (20% higher than actual price)
  const getComparePrice = (price: number) => Math.round(price * 1.2);

  // Mock function to get discount percentage
  const getDiscountPercentage = (originalPrice: number, salePrice: number) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive"
      });
      return;
    }
    
    onAddToCart(product, 1);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleAddToWishlist = (product: Product) => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">Discover our premium collection of electronics</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const comparePrice = getComparePrice(product.price);
          const discountPercentage = getDiscountPercentage(comparePrice, product.price);
          
          return (
            <Card key={product.id} className="hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <CardContent className="p-0">
                {/* Product Image with Watermark */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                    <div className="text-4xl font-bold text-gray-400">
                      {product.name.substring(0, 2).toUpperCase()}
                    </div>
                    
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-gray-300 text-xs font-bold opacity-30 rotate-12 select-none">
                        DIGITALDEN.CO.KE
                      </div>
                    </div>
                    
                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{discountPercentage}%
                      </Badge>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-3 w-3 fill-current text-yellow-400"
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {comparePrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(comparePrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge 
                          variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary hover:bg-primary/90 group-hover:bg-primary/80 transition-colors"
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No products found</div>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
