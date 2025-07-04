import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Store, Phone, Mail, Play, Search, Menu, MapPin, Star, Filter, ChevronDown, X, Map } from 'lucide-react';
import { ProductCatalog } from './ProductCatalog';
import { ShoppingCartComponent } from './ShoppingCartComponent';
import { CheckoutProcess } from './CheckoutProcess';
import { CustomerAuth } from './CustomerAuth';
import { OrderHistory } from './OrderHistory';
import { ProductShowcase } from './ProductShowcase';
import { WhatsAppChat } from './WhatsAppChat';
import { Product, CartItem, Customer } from '@/types';

// Online store specific product interface
interface OnlineProduct extends Product {
  originalPrice: number;
  salesPrice: number;
  offerPrice?: number;
  images: string[];
  features: string[];
  tags: string[];
  isFeatured: boolean;
  description: string;
}

type OnlineStoreView = 'home' | 'catalog' | 'cart' | 'checkout' | 'auth' | 'orders' | 'categories';

export const OnlineStore: React.FC = () => {
  const [currentView, setCurrentView] = useState<OnlineStoreView>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('Nairobi, Kenya');

  // Mock online store products with proper image structure
  const onlineProducts: OnlineProduct[] = [
    {
      id: 'online-1',
      name: 'iPhone 15 Pro Max 256GB',
      description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system with 5x telephoto zoom.',
      features: ['A17 Pro Chip', '256GB Storage', 'Pro Camera System', '5G Connectivity', 'Titanium Design'],
      category: 'Smartphones',
      buyingCost: 120000,
      wholesalePrice: 130000,
      retailPrice: 150000,
      price: 125000, // Now price
      originalPrice: 150000, // Was price
      salesPrice: 125000,
      offerPrice: 125000,
      stock: 25,
      supplierId: 'supplier-1',
      barcode: '123456789',
      images: [
        'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop'
      ],
      tags: ['Apple', 'Premium', 'Latest', '5G'],
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'online-2',
      name: 'MacBook Air M3 13-inch',
      description: 'Ultra-thin and lightweight laptop with M3 chip for incredible performance and all-day battery life.',
      features: ['M3 Chip', '8GB RAM', '256GB SSD', 'Liquid Retina Display', '18-hour battery'],
      category: 'Laptops',
      buyingCost: 140000,
      wholesalePrice: 150000,
      retailPrice: 180000,
      price: 155000, // Now price
      originalPrice: 180000, // Was price
      salesPrice: 155000,
      stock: 15,
      supplierId: 'supplier-1',
      barcode: '123456790',
      images: [
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'
      ],
      tags: ['Apple', 'MacBook', 'M3', 'Laptop'],
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const categories = [
    { name: 'Promos', icon: '🏷️' },
    { name: 'Electronics', icon: '📱' },
    { name: 'Computers', icon: '💻' },
    { name: 'Gaming', icon: '🎮' },
    { name: 'Audio', icon: '🎧' },
    { name: 'Accessories', icon: '🔌' },
    { name: 'Smart Home', icon: '🏠' },
    { name: 'Cameras', icon: '📷' },
    { name: 'Wearables', icon: '⌚' },
  ];

  const addToCart = (product: OnlineProduct, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, price: product.offerPrice || product.salesPrice }];
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

  const handleLocationSelect = () => {
    // This would integrate with a map service in a real app
    setShowLocationMap(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Mobile Header - Digital Den Style */}
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
                <h1 className="text-white font-bold text-lg">DIGITAL DEN</h1>
                <p className="text-white text-xs -mt-1">Your electronics hub</p>
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
              <span className="text-sm font-semibold text-naivas-teal ml-1">{deliveryLocation}</span>
            </div>
            <button 
              onClick={handleLocationSelect}
              className="bg-naivas-orange text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <Map className="h-3 w-3" />
              Change
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search"
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
              {onlineProducts.length} Products
            </div>

            {/* Products Grid - with proper images and Was/Now pricing */}
            <div className="grid grid-cols-2 gap-3">
              {onlineProducts.map(product => {
                const wasPrice = product.originalPrice;
                const nowPrice = product.offerPrice || product.salesPrice || product.price;
                const discount = Math.round(((wasPrice - nowPrice) / wasPrice) * 100);
                
                return (
                  <Card key={product.id} className="relative overflow-hidden shadow-sm">
                    <CardContent className="p-3">
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-naivas-orange text-white px-2 py-1 rounded text-xs font-bold z-10">
                          {discount}% off
                        </div>
                      )}
                      
                      {/* Feature Deal Badge */}
                      {product.isFeatured && (
                        <div className="absolute top-8 left-0 bg-green-700 text-white px-2 py-1 rounded-r text-xs font-bold flex items-center z-10">
                          <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                          Featured Deals
                        </div>
                      )}

                      {/* Product Image */}
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hidden">
                          <div className="text-2xl font-bold text-gray-400">
                            {product.name.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm line-clamp-2 text-gray-800">
                          {product.name}
                        </h3>
                        
                        {/* Was/Now Pricing */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-naivas-teal">
                              KES {nowPrice.toLocaleString()}
                            </span>
                            {wasPrice > nowPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                KES {wasPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {discount > 0 && (
                            <div className="text-sm text-green-600">
                              Save KES {(wasPrice - nowPrice).toLocaleString()}
                            </div>
                          )}
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
          <span className="text-xs text-gray-500">digitalden.co.ke</span>
        </div>
      </div>

      {/* WhatsApp Chat Component - Now with animation */}
      <WhatsAppChat />

      {/* Location Map Modal */}
      {showLocationMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Select Delivery Location
                <Button variant="ghost" size="sm" onClick={() => setShowLocationMap(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <Map className="h-8 w-8 mx-auto mb-2" />
                  <p>Map integration would go here</p>
                </div>
              </div>
              <Input
                placeholder="Enter your address"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
              />
              <Button 
                className="w-full"
                onClick={() => setShowLocationMap(false)}
              >
                Confirm Location
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
