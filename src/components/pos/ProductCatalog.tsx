
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Product } from '@/types';
import { Search, AlertTriangle } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  showCatalogOnly?: boolean;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  products,
  onAddToCart, 
  showCatalogOnly = false 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {showCatalogOnly ? 'Product Catalog' : 'Products'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      <Badge 
                        variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{product.category}</p>
                    {!showCatalogOnly && (
                      <Button
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? (
                          <>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Out of Stock
                          </>
                        ) : (
                          'Add to Cart'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
