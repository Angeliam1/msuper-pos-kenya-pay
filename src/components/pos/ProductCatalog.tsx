
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Product } from '@/pages/Index';
import { Plus, Search } from 'lucide-react';

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  showManagement?: boolean;
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: '1', name: 'Coca Cola 500ml', price: 80, category: 'Beverages', stock: 50 },
  { id: '2', name: 'White Bread', price: 60, category: 'Bakery', stock: 30 },
  { id: '3', name: 'Milk 1L', price: 120, category: 'Dairy', stock: 25 },
  { id: '4', name: 'Rice 2kg', price: 350, category: 'Groceries', stock: 20 },
  { id: '5', name: 'Cooking Oil 1L', price: 280, category: 'Groceries', stock: 15 },
  { id: '6', name: 'Sugar 2kg', price: 240, category: 'Groceries', stock: 40 },
  { id: '7', name: 'Tea Leaves 250g', price: 150, category: 'Beverages', stock: 35 },
  { id: '8', name: 'Eggs (12 pcs)', price: 380, category: 'Dairy', stock: 18 },
];

const CATEGORIES = ['All', 'Beverages', 'Bakery', 'Dairy', 'Groceries'];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  onAddToCart, 
  showManagement = false 
}) => {
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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
          <CardTitle className="flex items-center justify-between">
            Product Catalog
            {showManagement && (
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
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
            {CATEGORIES.map(category => (
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
                      <Badge variant="outline" className="text-xs">
                        Stock: {product.stock}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
