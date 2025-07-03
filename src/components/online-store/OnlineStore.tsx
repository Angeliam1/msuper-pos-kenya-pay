import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, Store, Phone, Mail, Play } from 'lucide-react';
import { ProductCatalog } from './ProductCatalog';
import { ShoppingCartComponent } from './ShoppingCartComponent';
import { CheckoutProcess } from './CheckoutProcess';
import { CustomerAuth } from './CustomerAuth';
import { OrderHistory } from './OrderHistory';
import { ProductShowcase } from './ProductShowcase';
import { WhatsAppChat } from './WhatsAppChat';
import { Product, CartItem, Customer } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/database';

type OnlineStoreView = 'home' | 'catalog' | 'cart' | 'checkout' | 'auth' | 'orders';

export const OnlineStore: React.FC = () => {
  const [currentView, setCurrentView] = useState<OnlineStoreView>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // Mock video data for product showcase
  const productVideos = [
    {
      id: '1',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
      title: 'iPhone 15 Pro Max - Unboxing & Review',
      description: 'Latest iPhone with titanium design and advanced camera system'
    },
    {
      id: '2',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
      title: 'Samsung Galaxy Watch 6 - Features Demo',
      description: 'Smartwatch with health monitoring and fitness tracking'
    },
    {
      id: '3',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
      title: 'MacBook Pro M3 - Performance Test',
      description: 'Professional laptop with M3 chip and stunning display'
    }
  ];

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

  const handleVideoAddToCart = (videoId: string) => {
    // Find corresponding product for the video
    const product = products.find(p => p.id === videoId);
    if (product) {
      addToCart(product);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold">Loading Digital Den Store...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
              <Store className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Digital Den</h1>
                <p className="text-xs text-gray-600">www.digitalden.co.ke</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('home')}
              >
                <Play className="h-4 w-4 mr-2" />
                Home
              </Button>
              
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
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>Call: +254 725 333 337</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>Email: info@digitalden.co.ke</span>
            </div>
            <div>
              <span>🚚 Free delivery on orders above KES 2,000</span>
            </div>
            <div>
              <span>💬 Need help? Click the chat button!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-4xl font-bold mb-4">Welcome to Digital Den</h2>
                <p className="text-xl mb-6">Your one-stop shop for premium electronics</p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => setCurrentView('catalog')}
                >
                  Shop Now
                </Button>
              </CardContent>
            </Card>

            {/* Product Video Showcase */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
              <ProductShowcase 
                videos={productVideos}
                onAddToCart={handleVideoAddToCart}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-gray-600">Products Available</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-gray-600">Customer Support</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

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
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'orders' && currentCustomer && (
          <OrderHistory
            customer={currentCustomer}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Cart Summary Fixed Bottom */}
      {cartItems.length > 0 && currentView !== 'cart' && currentView !== 'checkout' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-30">
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

      {/* WhatsApp Chat Component */}
      <WhatsAppChat />
    </div>
  );
};
