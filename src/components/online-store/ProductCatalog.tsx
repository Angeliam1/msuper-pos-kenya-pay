
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Search, Plus, ShoppingCart } from 'lucide-react';
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
    return matchesCategory && matchesSearch && product.stock > 0; // Only show in-stock items
  });

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

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

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
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
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow group">
            <CardContent className="p-0">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                <div className="text-4xl font-bold text-gray-400">
                  {product.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {product.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <div className="text-sm text-gray-500">
                      {product.stock} in stock
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-primary hover:bg-primary/90 group-hover:bg-primary/80"
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No products found</div>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
