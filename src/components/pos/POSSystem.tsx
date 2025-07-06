
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: '1', name: 'Coca Cola 500ml', price: 50, stock: 100 },
  { id: '2', name: 'Bread White 400g', price: 60, stock: 50 },
  { id: '3', name: 'Milk 1L', price: 80, stock: 30 },
  { id: '4', name: 'Rice 1kg', price: 120, stock: 25 },
];

export const POSSystem: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-2xl font-bold text-green-600">KSh {product.price}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full mt-2"
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Cart ({cart.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">KSh {item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => addToCart(item)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {cart.length === 0 && (
                <p className="text-center text-gray-500 py-8">Cart is empty</p>
              )}
              
              {cart.length > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>KSh {cartTotal}</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Process Payment
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
