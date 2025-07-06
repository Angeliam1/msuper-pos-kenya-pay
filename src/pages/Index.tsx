
import React, { useState } from 'react';
import { Sidebar } from '@/components/pos/Sidebar';
import { Dashboard } from '@/components/pos/Dashboard';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { Reports } from '@/components/pos/Reports';
import { Settings } from '@/components/pos/Settings';
import { OnlineStoreManager } from '@/components/online-store/OnlineStoreManager';
import { SuperAdminStoreManager } from '@/components/pos/SuperAdminStoreManager';
import { ThemeProvider } from '@/components/pos/ThemeProvider';
import { StoreProvider } from '@/contexts/StoreContext';
import { DemoModeProvider, useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCustomers, getTransactions, getAttendants, getSuppliers, getExpenses } from '@/lib/database';

const IndexContent = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDemoMode, demoProducts, demoCustomers, demoTransactions, demoAttendants } = useDemoMode();

  // Fetch data for components (only if not in demo mode)
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    enabled: !isDemoMode
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    enabled: !isDemoMode
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    enabled: !isDemoMode
  });

  const { data: attendants = [] } = useQuery({
    queryKey: ['attendants'],
    queryFn: getAttendants,
    enabled: !isDemoMode
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
    enabled: !isDemoMode
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
    enabled: !isDemoMode
  });

  // Use demo data or real data based on mode
  const currentProducts = isDemoMode ? demoProducts : products;
  const currentCustomers = isDemoMode ? demoCustomers : customers;
  const currentTransactions = isDemoMode ? demoTransactions : transactions;
  const currentAttendants = isDemoMode ? demoAttendants : attendants;

  // Calculate dashboard metrics
  const totalSales = currentTransactions.reduce((sum, t) => sum + t.total, 0);
  const todaySales = currentTransactions
    .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.total, 0);
  const transactionCount = currentTransactions.length;

  const handleSaveSettings = (settings: any) => {
    console.log('Settings saved:', settings);
  };

  // Log current state for debugging
  console.log('Demo Mode Status:', isDemoMode);
  console.log('Current Products:', currentProducts.length);
  console.log('Current Customers:', currentCustomers.length);
  console.log('Current Transactions:', currentTransactions.length);

  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return <ProductManagement />;
      case 'dashboard':
        return (
          <Dashboard
            totalSales={totalSales}
            todaySales={todaySales}
            transactionCount={transactionCount}
            transactions={currentTransactions}
            products={currentProducts}
          />
        );
      case 'reports':
        return (
          <Reports
            transactions={currentTransactions}
            products={currentProducts}
            attendants={currentAttendants}
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
  };

  return (
    <StoreProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground flex theme-transition">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          
          <div className="flex-1 lg:ml-0">
            {/* Mobile header */}
            <div className="lg:hidden bg-card border-b p-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            
            <main className="p-4 lg:p-8">
              {renderContent()}
            </main>
          </div>
        </div>
      </ThemeProvider>
    </StoreProvider>
  );
};

const Index = () => {
  return (
    <DemoModeProvider>
      <IndexContent />
    </DemoModeProvider>
  );
};

export default Index;
