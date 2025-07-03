
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Store, Phone, Mail, Play, Search, Menu, MapPin, Star, Filter, ChevronDown, X } from 'lucide-react';
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

type OnlineStoreView = 'home' | 'catalog' | 'cart' | 'checkout' | 'auth' | 'orders' | 'categories';

export const OnlineStore: React.FC = () => {
  const [currentView, setCurrentView] = useState<OnlineStoreView>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const categories = [
    { name: 'Promos', icon: '🏷️' },
    { name: 'Food Cupboard', icon: '🛒' },
    { name: 'Fresh Food', icon: '🥗' },
    { name: 'Baby & Kids', icon: '👶' },
    { name: 'Beverage', icon: '🥤' },
    { name: 'Electronics', icon: '📱' },
    { name: 'Cleaning', icon: '🧽' },
    { name: 'Beauty & Cosmetics', icon: '💄' },
    { name: 'Naivas Liqour', icon: '🍷' },
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naivas-teal mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold">Loading Digital Den Store...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Mobile Header - Naivas Style */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-3">
            <button 
              onClick={() => setCurrentView('categories')}
              className="p-2 -ml-2"
            >
              <Menu className="h-6 w-6 text-naivas-teal" />
            </button>
            
            <div className="flex-1 text-center">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-2 rounded-full">
                <h1 className="text-white font-bold text-lg">naivas</h1>
                <p className="text-white text-xs -mt-1">saves you money</p>
              </div>
            </div>
            
            <button className="p-2 -mr-2">
              <User className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Location Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center flex-1">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-700">Deliver to</span>
              <span className="text-sm font-semibold text-naivas-teal ml-1">Nairobi, Kenya</span>
            </div>
            <button className="bg-naivas-orange text-white px-3 py-1 rounded text-sm">
              Change
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12 h-12 rounded-lg border-gray-200 bg-gray-50"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-naivas-orange p-2 rounded-lg">
              <Search className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Wallet and Cart Bar */}
          <div className="flex justify-between items-center">
            <div className="bg-naivas-teal text-white px-4 py-2 rounded-lg">
              <div className="text-xs">Wallet Bal</div>
              <div className="font-bold">KES 0.00</div>
            </div>
            
            <button 
              onClick={() => setCurrentView('cart')}
              className="bg-naivas-orange text-white px-4 py-2 rounded-lg flex items-center relative"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span className="font-bold">KES {getTotalPrice().toLocaleString()}</span>
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  {getTotalItems()}
                </Badge>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {currentView === 'home' && (
          <div className="p-4 space-y-4">
            {/* Filter and Sort Bar */}
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <Filter className="h-4 w-4 mr-2 text-naivas-teal" />
                <span>Filter</span>
              </button>
              
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white">
                <span className="mr-2">Sort By: {sortBy}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Product Count */}
            <div className="text-gray-600 text-sm">
              {products.length} Products
            </div>

            {/* Products Grid - Naivas Style */}
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 10).map(product => {
                const discount = Math.floor(Math.random() * 30) + 5; // Random discount 5-35%
                const originalPrice = Math.floor(product.price * 1.3);
                const isAnniversary = Math.random() > 0.7; // 30% chance for anniversary deals
                
                return (
                  <Card key={product.id} className="relative overflow-hidden shadow-sm">
                    <CardContent className="p-3">
                      {/* Discount Badge */}
                      <div className="absolute top-2 left-2 bg-naivas-orange text-white px-2 py-1 rounded text-xs font-bold">
                        {discount}% off
                      </div>
                      
                      {/* Anniversary Deal Badge */}
                      {isAnniversary && (
                        <div className="absolute top-8 left-0 bg-green-700 text-white px-2 py-1 rounded-r text-xs font-bold flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                          Anniversary Deals
                        </div>
                      )}

                      {/* Product Image Placeholder */}
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <div className="text-2xl font-bold text-gray-400">
                          {product.name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm line-clamp-2 text-gray-800">
                          {product.name}
                        </h3>
                        
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-naivas-teal">
                            {formatPrice(product.price)}
                          </div>
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(originalPrice)}
                          </div>
                          <div className="text-sm text-green-600">
                            Save KES {originalPrice - product.price}
                          </div>
                        </div>

                        <button 
                          onClick={() => addToCart(product)}
                          className="w-full bg-naivas-orange text-white py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'categories' && (
          <div className="min-h-screen bg-white">
            {/* Categories Header */}
            <div className="bg-naivas-teal text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Categories</h2>
              <button onClick={() => setCurrentView('home')}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Categories List */}
            <div className="p-4 space-y-1">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setCurrentView('home');
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{category.icon}</span>
                    <span className="text-naivas-teal font-medium">{category.name}</span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'cart' && (
          <ShoppingCartComponent
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onProceedToCheckout={() => setCurrentView('checkout')}
            onContinueShopping={() => setCurrentView('home')}
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

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t shadow-lg">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center p-2 ${currentView === 'home' ? 'text-naivas-teal' : 'text-gray-500'}`}
          >
            <Store className="h-5 w-5" />
            <span className="text-xs mt-1">Shop</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-gray-500">
            <Star className="h-5 w-5" />
            <span className="text-xs mt-1">Wishlist</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('cart')}
            className={`flex flex-col items-center p-2 relative ${currentView === 'cart' ? 'text-naivas-teal' : 'text-gray-500'}`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs mt-1">Cart</span>
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-naivas-orange">
                {getTotalItems()}
              </Badge>
            )}
          </button>
          
          <button 
            onClick={() => setCurrentView('auth')}
            className={`flex flex-col items-center p-2 ${currentView === 'auth' ? 'text-naivas-teal' : 'text-gray-500'}`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Account</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-gray-500">
            <Menu className="h-5 w-5" />
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
        
        {/* Website URL Display */}
        <div className="text-center py-1 bg-gray-50 border-t">
          <span className="text-xs text-gray-500">naivas.online</span>
        </div>
      </div>

      {/* WhatsApp Chat Component */}
      <WhatsAppChat />
    </div>
  );
};
