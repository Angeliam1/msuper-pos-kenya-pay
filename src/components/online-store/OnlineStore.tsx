
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, Store, Phone, Mail } from 'lucide-react';
import { ProductCatalog } from './ProductCatalog';
import { ShoppingCartComponent } from './ShoppingCartComponent';
import { CheckoutProcess } from './CheckoutProcess';
import { CustomerAuth } from './CustomerAuth';
import { OrderHistory } from './OrderHistory';
import { Product, CartItem, Customer } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/database';

type OnlineStoreView = 'catalog' | 'cart' | 'checkout' | 'auth' | 'orders';

export const OnlineStore: React.FC = () => {
  const [currentView, setCurrentView] = useState<OnlineStoreView>('catalog');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold">Loading Store...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">MSUPER Store</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={currentView === 'catalog' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('catalog')}
              >
                Products
              </Button>
              
              <Button
                variant={currentView === 'cart' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('cart')}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>

              <Button
                variant={currentView === 'auth' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('auth')}
              >
                <User className="h-4 w-4 mr-2" />
                {currentCustomer ? currentCustomer.name : 'Account'}
              </Button>

              {currentCustomer && (
                <Button
                  variant={currentView === 'orders' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('orders')}
                >
                  Orders
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Store Info Banner */}
      <div className="bg-primary text-primary-foreground py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>Call: +254 700 000 000</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>Email: info@msuper.com</span>
            </div>
            <div>
              <span>Free delivery on orders above KES 2,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'catalog' && (
          <ProductCatalog
            products={products}
            onAddToCart={addToCart}
          />
        )}

        {currentView === 'cart' && (
          <ShoppingCartComponent
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onProceedToCheckout={() => setCurrentView('checkout')}
            onContinueShopping={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutProcess
            items={cartItems}
            customer={currentCustomer}
            onOrderComplete={() => {
              clearCart();
              setCurrentView('orders');
            }}
            onBackToCart={() => setCurrentView('cart')}
            onLoginRequired={() => setCurrentView('auth')}
          />
        )}

        {currentView === 'auth' && (
          <CustomerAuth
            currentCustomer={currentCustomer}
            onCustomerChange={setCurrentCustomer}
            onBack={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'orders' && currentCustomer && (
          <OrderHistory
            customer={currentCustomer}
            onBack={() => setCurrentView('catalog')}
          />
        )}
      </main>

      {/* Cart Summary Fixed Bottom */}
      {cartItems.length > 0 && currentView !== 'cart' && currentView !== 'checkout' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-semibold">
                {getTotalItems()} items - {formatPrice(getTotalPrice())}
              </span>
            </div>
            <Button onClick={() => setCurrentView('cart')}>
              View Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
