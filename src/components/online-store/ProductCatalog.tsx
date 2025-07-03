
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
    <div className="space-y-6 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">Discover our premium collection</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-gray-200"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full ${selectedCategory === category ? 'bg-naivas-teal hover:bg-naivas-teal/90' : ''}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid - Naivas Style */}
      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map(product => {
          const comparePrice = getComparePrice(product.price);
          const discountPercentage = getDiscountPercentage(comparePrice, product.price);
          const isAnniversary = Math.random() > 0.7; // 30% chance for anniversary deals
          
          return (
            <Card key={product.id} className="relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-2 left-2 bg-naivas-orange text-white px-2 py-1 rounded text-xs font-bold z-10">
                    {discountPercentage}% off
                  </div>
                )}
                
                {/* Anniversary Deal Badge */}
                {isAnniversary && (
                  <div className="absolute top-8 left-0 bg-green-700 text-white px-2 py-1 rounded-r text-xs font-bold flex items-center z-10">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    Anniversary Deals
                  </div>
                )}

                {/* Product Image with Watermark */}
                <div className="relative aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                    <div className="text-3xl font-bold text-gray-400">
                      {product.name.substring(0, 2).toUpperCase()}
                    </div>
                    
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-gray-300 text-xs font-bold opacity-30 rotate-12 select-none">
                        DIGITALDEN.CO.KE
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 w-7 rounded-full p-0"
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2 text-gray-800 mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Badge variant="secondary" className="text-xs bg-gray-100">
                        {product.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-3 w-3 fill-current text-yellow-400"
                          />
                        ))}
                        <span className="text-xs text-gray-500">(4.5)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-naivas-teal">
                      {formatPrice(product.price)}
                    </div>
                    {comparePrice > product.price && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(comparePrice)}
                      </div>
                    )}
                    <div className="text-sm text-green-600">
                      Save KES {comparePrice - product.price}
                    </div>
                    
                    <Badge 
                      variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-naivas-orange hover:bg-orange-600 text-white transition-colors"
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
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
