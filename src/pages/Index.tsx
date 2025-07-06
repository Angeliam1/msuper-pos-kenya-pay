
import React, { useState } from 'react';
import { Sidebar } from '@/components/pos/Sidebar';
import { Dashboard } from '@/components/pos/Dashboard';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { Reports } from '@/components/pos/Reports';
import { Settings } from '@/components/pos/Settings';
import { OnlineStoreManager } from '@/components/online-store/OnlineStoreManager';
import { SuperAdminStoreManager } from '@/components/pos/SuperAdminStoreManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Store } from 'lucide-react';
import { Product, Transaction, Attendant, CartItem } from '@/types';

// Standalone demo data - no external providers needed
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Coca Cola 500ml',
    category: 'Beverages',
    price: 50,
    buyingCost: 35,
    wholesalePrice: 45,
    retailPrice: 50,
    stock: 100,
    barcode: '12345',
    description: 'Refreshing soft drink',
    supplierId: 'sup1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Bread White 400g',
    category: 'Bakery',
    price: 60,
    buyingCost: 40,
    wholesalePrice: 55,
    retailPrice: 60,
    stock: 50,
    barcode: '12346',
    description: 'Fresh white bread',
    supplierId: 'sup1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const demoTransactions: Transaction[] = [
  {
    id: 'demo-trans-1',
    items: [{ ...demoProducts[0], quantity: 2 } as CartItem],
    total: 100,
    timestamp: new Date(),
    customerId: 'walk-in',
    attendantId: 'demo',
    paymentSplits: [{ method: 'cash' as const, amount: 100 }],
    status: 'completed' as const
  }
];

const demoAttendants: Attendant[] = [
  {
    id: 'demo',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+254700000000',
    role: 'manager' as const,
    pin: '1234',
    isActive: true,
    permissions: ['pos', 'reports', 'settings'],
    createdAt: new Date()
  }
];

const Index = () => {
  console.log('Index component rendering...');
  
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const currentStore = {
    id: '1',
    name: 'MSUPER POS',
    address: 'Demo Store',
    phone: '+254700000000',
    managerId: 'demo',
    manager: 'Demo Manager',
    status: 'active' as const,
    totalSales: 0,
    isActive: true,
    createdAt: new Date()
  };

  // Calculate dashboard metrics
  const totalSales = demoTransactions.reduce((sum, t) => sum + t.total, 0);
  const todaySales = totalSales;
  const transactionCount = demoTransactions.length;

  const handleSaveSettings = (settings: any) => {
    console.log('Settings saved:', settings);
  };

  const renderContent = () => {
    console.log('Rendering content for tab:', activeTab);
    
    try {
      switch (activeTab) {
        case 'pos':
          return <ProductManagement />;
        case 'dashboard':
          return (
            <Dashboard
              totalSales={totalSales}
              todaySales={todaySales}
              transactionCount={transactionCount}
              transactions={demoTransactions}
              products={demoProducts}
            />
          );
        case 'reports':
          return (
            <Reports
              transactions={demoTransactions}
              products={demoProducts}
              attendants={demoAttendants}
            />
          );
        case 'settings':
          return <Settings onSaveSettings={handleSaveSettings} />;
        case 'online-store':
          return <OnlineStoreManager />;
        case 'stores':
          return <SuperAdminStoreManager />;
        default:
          return <ProductManagement />;
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to MSUPER POS</h2>
          <p className="text-gray-600">Point of Sale System</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-blue-600" />
              <div className="text-center">
                <h3 className="font-semibold text-sm">{currentStore.name}</h3>
                <p className="text-xs text-gray-600">Ready to Use</p>
              </div>
            </div>
            
            <div className="w-8" />
          </div>
        </div>
        
        {/* Desktop header */}
        <div className="hidden lg:block bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="font-bold text-lg">{currentStore.name}</h2>
                <Badge variant="outline" className="bg-green-100 text-green-800">System Ready</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <main className="p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
