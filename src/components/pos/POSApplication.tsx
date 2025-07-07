
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Plus
} from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { CustomerManagement } from './CustomerManagement';
import { Dashboard } from './Dashboard';
import { Settings as POSSettings } from './Settings';
import { TransactionHistory } from './TransactionHistory';
import { ExpenseManagement } from './ExpenseManagement';
import { useStore } from '@/contexts/StoreContext';

type POSView = 'dashboard' | 'products' | 'customers' | 'sales' | 'transactions' | 'settings' | 'expenses';

export const POSApplication: React.FC = () => {
  const [currentView, setCurrentView] = useState<POSView>('dashboard');
  const { currentStore, getStoreProducts, getStoreCustomers, getStoreTransactions } = useStore();

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
      default:
        return <div>Feature coming soon...</div>;
    }
  };

  const menuItems = [
    { id: 'dashboard' as POSView, label: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'products' as POSView, label: 'Products', icon: Package, badge: products.length },
    { id: 'customers' as POSView, label: 'Customers', icon: Users, badge: customers.length },
    { id: 'transactions' as POSView, label: 'Transactions', icon: Receipt, badge: transactions.length },
    { id: 'expenses' as POSView, label: 'Expenses', icon: CreditCard, badge: null },
    { id: 'settings' as POSView, label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
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
                  {currentStore?.name || 'POS System'}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
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
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Sale
                </Button>
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
