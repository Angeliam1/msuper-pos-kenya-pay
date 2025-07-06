
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  Store, 
  ShoppingCart, 
  BarChart3, 
  FileText, 
  Settings as SettingsIcon,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Minus,
  Building,
  Globe,
  Eye
} from 'lucide-react';

// Import the components that were available
import { MultiStoreManagement } from '@/components/pos/MultiStoreManagement';
import { OnlineStoreManager } from '@/components/online-store/OnlineStoreManager';
import { OnlineStore } from '@/components/online-store/OnlineStore';
import { StoreProvider } from '@/contexts/StoreContext';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Simple standalone POS data
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

const Index = () => {
  console.log('Index component rendering...');
  
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const navigationItems = [
    { id: 'pos', label: 'POS', icon: ShoppingCart },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'multi-store', label: 'Multi Store', icon: Building },
    { id: 'online-store', label: 'Online Store', icon: Globe },
    { id: 'store-preview', label: 'Store Preview', icon: Eye },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderPOS = () => (
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

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold">KSh 2,450</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return renderPOS();
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return (
          <div className="text-center py-8">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Product Management</h2>
            <p className="text-gray-600">Manage your inventory and products</p>
          </div>
        );
      case 'multi-store':
        return (
          <StoreProvider>
            <MultiStoreManagement />
          </StoreProvider>
        );
      case 'online-store':
        return (
          <StoreProvider>
            <OnlineStoreManager />
          </StoreProvider>
        );
      case 'store-preview':
        return (
          <div className="h-screen overflow-hidden">
            <OnlineStore />
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-8">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Reports</h2>
            <p className="text-gray-600">View sales reports and analytics</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-8">
            <SettingsIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Settings</h2>
            <p className="text-gray-600">Configure your POS system</p>
          </div>
        );
      default:
        return renderPOS();
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className={`
          fixed left-0 top-0 h-full bg-white border-r shadow-lg z-50 transition-transform duration-300 ease-in-out
          w-64 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0
        `}>
          <div className="p-4 border-b bg-blue-600">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">DIGITAL DEN POS</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:bg-blue-700"
              >
                ×
              </Button>
            </div>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-sm h-11 ${
                        isActive 
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="bg-white border-b p-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <Store className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="font-bold text-lg">DIGITAL DEN POS</h2>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Multi-Store & Online Ready
                  </Badge>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <Badge variant="secondary">Full Features Active</Badge>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <main className="p-4 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
};

export default Index;
