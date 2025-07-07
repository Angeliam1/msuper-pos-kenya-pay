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
import { Cart } from './Cart';
import { useStore } from '@/contexts/StoreContext';
import { CartItem, Transaction, Customer, PaymentSplit } from '@/types';

type POSView = 'dashboard' | 'pos' | 'cart' | 'products' | 'customers' | 'sales' | 'transactions' | 'settings' | 'expenses' | 'online-store' | 'stores' | 'reports';

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
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) - (discount || 0);
    
    // Create payment splits based on payment method
    const paymentSplits: PaymentSplit[] = [{
      method: paymentMethod,
      amount: total,
      reference: mpesaReference
    }];
    
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      items: cartItems,
      total,
      timestamp: new Date(),
      customerId: customerId || '',
      attendantId: 'demo-attendant',
      paymentSplits,
      status: 'completed'
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
      case 'cart':
        return (
          <Cart
            items={cartItems}
            customers={customers}
            onUpdateItem={handleUpdateCartItem}
            onUpdateItemPrice={handleUpdateItemPrice}
            onCompleteTransaction={handleCompleteTransaction}
            onSplitPayment={() => console.log('Split payment')}
            onHirePurchase={() => console.log('Hire purchase')}
            onHoldTransaction={() => console.log('Hold transaction')}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomerLoyaltyPoints={handleUpdateCustomerLoyaltyPoints}
            storeSettings={mockStoreSettings}
          />
        );
      case 'pos':
        return (
          <div className="space-y-4">
            {/* Mobile Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                        category: product.category,
                        buyingCost: product.buyingCost,
                        retailPrice: product.retailPrice,
                        price: product.price,
                        wholesalePrice: product.wholesalePrice,
                        stock: product.stock,
                        minStock: product.minStock,
                        maxStock: product.maxStock,
                        barcode: product.barcode,
                        description: product.description,
                        imageUrl: product.imageUrl,
                        unit: product.unit || 'pcs',
                        supplierId: product.supplierId,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                        quantity: 1
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

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Cart ({cartItems.length} items)</span>
                    <Button 
                      size="sm" 
                      onClick={() => setCurrentView('cart')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      View Cart
                    </Button>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    Total: KES {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            )}
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
    { id: 'cart' as POSView, label: 'Cart', icon: ShoppingCart, badge: cartItems.length },
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
      <div className="bg-white shadow-sm border-b">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="mr-2 lg:hidden">
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

      {/* Main Content */}
      <div className="p-4">
        {renderMainContent()}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden">
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
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};
