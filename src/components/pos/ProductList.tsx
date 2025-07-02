
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';

interface ProductListProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All items');

  const categories = ['All items', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All items' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => `KSh${price.toLocaleString()}.00`;

  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Name / SKU / Barcode"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-full h-12"
              />
            </div>
            
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                    selectedCategory === category 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredProducts.map(product => (
          <Card key={product.id} className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Product Avatar */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-gray-600">
                      {product.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-gray-100 text-gray-600 border-0"
                      >
                        {product.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Price and Add Button */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="font-semibold text-gray-900 text-base">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  {onAddToCart && (
                    <Button
                      onClick={() => onAddToCart(product)}
                      size="sm"
                      disabled={product.stock <= 0}
                      className="h-10 w-10 p-0 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredProducts.length === 0 && (
          <Card className="bg-white">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No products found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
