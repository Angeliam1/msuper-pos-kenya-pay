import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  ArrowLeft,
  ShoppingCart, 
  Users, 
  Package, 
  Settings,
  BarChart3,
  CreditCard,
  Truck,
  Receipt,
  UserPlus,
  Plus,
  Menu,
  Globe,
  Store,
  FileText,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { CustomerManagement } from './CustomerManagement';
import { Dashboard } from './Dashboard';
import { Settings as POSSettings } from './Settings';
import { TransactionHistory } from './TransactionHistory';
import { ExpenseManagement } from './ExpenseManagement';
import { OnlineStoreManager } from '../online-store/OnlineStoreManager';
import { MultiStoreManagement } from './MultiStoreManagement';
import { Reports } from './Reports';
import { useStore } from '@/contexts/StoreContext';
import { CartItem, Transaction, Customer } from '@/types';

type POSView = 'dashboard' | 'pos' | 'products' | 'customers' | 'sales' | 'transactions' | 'settings' | 'expenses' | 'online-store' | 'stores' | 'reports';

export const POSApplication: React.FC = () => {
  const [currentView, setCurrentView] = useState<POSView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { currentStore, getStoreProducts, getStoreCustomers, getStoreTransactions, addTransactionToStore, updateStoreCustomer } = useStore();

  // Get store data using the proper methods
  const products = currentStore ? getStoreProducts(currentStore.id) : [];
  const customers = currentStore ? getStoreCustomers(currentStore.id) : [];
  const transactions = currentStore ? getStoreTransactions(currentStore.id) : [];

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const todaySales = transactions
    .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.total, 0);

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const handleSaveSettings = (settings: any) => {
    console.log('Settings saved:', settings);
    // Implement settings save logic here
  };

  // Cart functionality
  const handleUpdateCartItem = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleUpdateItemPrice = (id: string, newPrice: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    ));
  };

  const handleCompleteTransaction = (
    paymentMethod: 'mpesa' | 'cash', 
    mpesaReference?: string, 
    customerId?: string, 
    discount?: number, 
    loyaltyPointsUsed?: number
  ): Transaction => {
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) - (discount || 0),
      paymentMethod,
      timestamp: new Date(),
      customerId,
      mpesaReference,
      discount: discount || 0,
      loyaltyPointsUsed: loyaltyPointsUsed || 0
    };

    if (currentStore) {
      addTransactionToStore(currentStore.id, transaction);
    }

    // Clear cart after successful transaction
    setCartItems([]);
    return transaction;
  };

  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    // This would be implemented with the store context
    console.log('Add customer:', customerData);
  };

  const handleUpdateCustomerLoyaltyPoints = (customerId: string, pointsUsed: number) => {
    if (currentStore) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        const updatedCustomer = {
          ...customer,
          loyaltyPoints: (customer.loyaltyPoints || 0) - pointsUsed
        };
        updateStoreCustomer(currentStore.id, customerId, updatedCustomer);
      }
    }
  };

  const mockStoreSettings = {
    storeName: currentStore?.name || 'M-Super POS',
    storeAddress: currentStore?.address || '',
    storePhone: currentStore?.phone || '',
    storeEmail: '',
    kraPin: '',
    mpesaPaybill: '',
    mpesaAccount: '',
    mpesaTill: '',
    bankAccount: '',
    paymentInstructions: '',
    paybill: '',
    showStoreName: true,
    showStoreAddress: true,
    showStorePhone: true,
    showCustomerName: true,
    showCustomerPhone: true,
    showCustomerAddress: true,
    showNotes: true,
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Please come again',
    showBarcode: false,
    showQRCode: false,
    autoPrintReceipt: false,
    receiptCodeType: 'qr' as const
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            totalSales={totalSales}
            todaySales={todaySales}
            transactionCount={transactions.length}
            transactions={transactions}
            products={products}
          />
        );
      case 'pos':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Products List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {products.map(product => (
                      <Button
                        key={product.id}
                        variant="outline"
                        className="h-auto p-3 flex flex-col items-center text-center"
                        onClick={() => {
                          const existingItem = cartItems.find(item => item.id === product.id);
                          if (existingItem) {
                            handleUpdateCartItem(product.id, existingItem.quantity + 1);
                          } else {
                            const cartItem: CartItem = {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              quantity: 1,
                              stock: product.stock,
                              unit: product.unit || 'pcs',
                              wholesalePrice: product.wholesalePrice || product.price
                            };
                            setCartItems(prev => [...prev, cartItem]);
                          }
                        }}
                        disabled={product.stock <= 0}
                      >
                        <Package className="h-6 w-6 mb-2" />
                        <span className="text-xs font-medium">{product.name}</span>
                        <span className="text-xs text-green-600">KES {product.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart */}
            <div className="lg:col-span-1">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Cart ({cartItems.length} items)</h3>
                
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">KES {item.price.toLocaleString()} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateCartItem(item.id, Math.max(0, item.quantity - 1))}
                              className="h-6 w-6 p-0"
                            >
                              -
                            </Button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                              disabled={item.quantity >= item.stock}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold mb-4">
                        <span>Total:</span>
                        <span className="text-green-600">
                          KES {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleCompleteTransaction('cash')}
                          className="w-full"
                        >
                          Cash
                        </Button>
                        <Button
                          onClick={() => handleCompleteTransaction('mpesa', 'MPESA123')}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          M-Pesa
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      case 'products':
        return <ProductManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'transactions':
        return <TransactionHistory transactions={transactions} />;
      case 'settings':
        return <POSSettings onSaveSettings={handleSaveSettings} />;
      case 'expenses':
        return (
          <ExpenseManagement
            expenses={[]}
            attendants={[]}
            currentAttendant={{
              id: 'demo-user',
              name: 'Demo User',
              email: 'demo@example.com',
              phone: '+1234567890',
              role: 'admin',
              isActive: true,
              createdAt: new Date(),
              permissions: ['pos', 'products', 'customers', 'suppliers', 'reports', 'staff', 'settings']
            }}
            onAddExpense={() => {}}
          />
        );
      case 'online-store':
        return <OnlineStoreManager />;
      case 'stores':
        return <MultiStoreManagement />;
      case 'reports':
        return (
          <Reports 
            transactions={transactions}
            products={products}
            attendants={[]}
          />
        );
      default:
        return <div>Feature coming soon...</div>;
    }
  };

  const menuItems = [
    { id: 'dashboard' as POSView, label: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'pos' as POSView, label: 'POS', icon: ShoppingCart, badge: null },
    { id: 'products' as POSView, label: 'Products', icon: Package, badge: products.length },
    { id: 'customers' as POSView, label: 'Customers', icon: Users, badge: customers.length },
    { id: 'transactions' as POSView, label: 'Transactions', icon: Receipt, badge: transactions.length },
    { id: 'online-store' as POSView, label: 'Online Store', icon: Globe, badge: null },
    { id: 'stores' as POSView, label: 'Multi Store', icon: Store, badge: null },
    { id: 'reports' as POSView, label: 'Reports', icon: FileText, badge: null },
    { id: 'expenses' as POSView, label: 'Expenses', icon: CreditCard, badge: null },
    { id: 'settings' as POSView, label: 'Settings', icon: Settings, badge: null },
  ];

  const MobileNavigation = () => (
    <div className="space-y-1 p-2">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setCurrentView(item.id);
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
            currentView === item.id
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center">
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </div>
          {item.badge !== null && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b lg:hidden">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentStore?.name || 'M-Super POS'}
                    </h2>
                    <p className="text-sm text-gray-500">Point of Sale</p>
                  </div>
                  <MobileNavigation />
                </SheetContent>
              </Sheet>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {menuItems.find(item => item.id === currentView)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {lowStockProducts.length > 0 && (
                <Badge variant="destructive" className="animate-pulse text-xs">
                  {lowStockProducts.length}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                KES {todaySales.toLocaleString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="bg-white shadow-sm border-b hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentStore?.name || 'M-Super POS'}
                </h1>
                <p className="text-sm text-gray-500">Point of Sale Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lowStockProducts.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {lowStockProducts.length} Low Stock
                </Badge>
              )}
              <Badge variant="outline">
                Today: KES {todaySales.toLocaleString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex gap-4 lg:gap-8">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-700">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                        currentView === item.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </div>
                      {item.badge !== null && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-700">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  size="sm" 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setCurrentView('pos')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Sale
                </Button>
                <Button 
                  size="sm" 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setCurrentView('customers')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
                <Button 
                  size="sm" 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setCurrentView('products')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {renderMainContent()}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-5 gap-1 p-2">
          {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
              {item.badge !== null && (
                <Badge variant="secondary" className="text-xs mt-1 scale-75">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile spacing for bottom nav */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};
