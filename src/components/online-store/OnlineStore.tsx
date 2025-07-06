import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OnlineProduct {
  id: string;
  name: string;
  description: string;
  features: string[];
  category: string;
  buyingCost: number;
  wholesalePrice: number;
  retailPrice: number;
  price: number;
  originalPrice: number;
  salesPrice: number;
  images: string[];
  inStock: boolean;
  stock: number;
  minStock: number;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export const OnlineStore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<OnlineProduct[]>([]);

  const formatPrice = (price: number) => `KSh${price.toLocaleString()}.00`;

  const addToCart = (product: OnlineProduct) => {
    setCart([...cart, product]);
  };

  const featuredProducts: OnlineProduct[] = [
    {
      id: '1',
      name: 'Premium Smartphone',
      description: 'Latest smartphone with advanced features',
      features: ['5G Ready', '128GB Storage', '48MP Camera', 'Fast Charging'],
      category: 'Electronics',
      buyingCost: 25000,
      wholesalePrice: 35000,
      retailPrice: 45000,
      price: 45000,
      originalPrice: 50000,
      salesPrice: 45000,
      images: [],
      inStock: true,
      stock: 15,
      minStock: 5,
      rating: 4.5,
      reviews: 128,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      features: ['Noise Cancelling', '30hr Battery', 'Bluetooth 5.0', 'Premium Sound'],
      category: 'Audio',
      buyingCost: 5000,
      wholesalePrice: 7500,
      retailPrice: 12000,
      price: 12000,
      originalPrice: 15000,
      salesPrice: 12000,
      images: [],
      inStock: true,
      stock: 25,
      minStock: 5,
      rating: 4.3,
      reviews: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Online Store</CardTitle>
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <img src={`https://source.unsplash.com/200x200/?${product.category}`} alt={product.name} className="w-full h-48 object-cover" />
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                    <p className="text-gray-600">{product.description}</p>
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{product.rating} ({product.reviews} reviews)</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-xl font-bold text-green-600">{formatPrice(product.price)}</span>
                      {product.salesPrice < product.originalPrice && (
                        <>
                          <span className="text-gray-500 line-through ml-2">{formatPrice(product.originalPrice)}</span>
                          <Badge className="ml-2">Sale</Badge>
                        </>
                      )}
                    </div>
                    <Button className="mt-4 w-full" onClick={() => addToCart(product)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <ScrollArea className="h-[300px] w-full">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id} className="bg-gray-50 border">
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                          <p className="text-gray-600">{item.description}</p>
                          <span className="text-green-600 font-bold">{formatPrice(item.price)}</span>
                        </div>
                        <Button>Remove</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
};
