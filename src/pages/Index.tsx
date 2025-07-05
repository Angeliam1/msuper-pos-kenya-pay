
import React, { useState } from 'react';
import { Sidebar } from '@/components/pos/Sidebar';
import { Dashboard } from '@/components/pos/Dashboard';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { Reports } from '@/components/pos/Reports';
import { Settings } from '@/components/pos/Settings';
import { OnlineStoreManager } from '@/components/online-store/OnlineStoreManager';
import { SuperAdminStoreManager } from '@/components/pos/SuperAdminStoreManager';
import { AuthManager } from '@/components/auth/AuthManager';
import { ThemeProvider } from '@/components/pos/ThemeProvider';
import { StoreProvider, useStore } from '@/contexts/StoreContext';
import { DemoModeProvider, useDemoMode } from '@/contexts/DemoModeContext';
import { AuthProvider } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Menu, Store, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCustomers, getTransactions, getAttendants, getSuppliers, getExpenses } from '@/lib/database';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Attendant } from '@/types';

const IndexContent = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAttendant, setCurrentAttendant] = useState<Attendant | null>(null);
  
  const { user } = useAuth();
  const { currentStore } = useStore();
  const { isDemoMode, demoProducts, demoCustomers, demoTransactions, demoAttendants } = useDemoMode();

  // Fetch data for components (only if not in demo mode)
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    enabled: !isDemoMode && isAuthenticated
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    enabled: !isDemoMode && isAuthenticated
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    enabled: !isDemoMode && isAuthenticated
  });

  const { data: attendants = [] } = useQuery({
    queryKey: ['attendants'],
    queryFn: getAttendants,
    enabled: !isDemoMode && isAuthenticated
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
    enabled: !isDemoMode && isAuthenticated
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
    enabled: !isDemoMode && isAuthenticated
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

  const handleLogin = (attendant?: Attendant) => {
    setIsAuthenticated(true);
    if (attendant) {
      setCurrentAttendant(attendant);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentAttendant(null);
  };

  const handleSaveSettings = (settings: any) => {
    console.log('Settings saved:', settings);
  };

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return <AuthManager onLogin={handleLogin} attendants={currentAttendants} />;
  }

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
    <div className="min-h-screen bg-background text-foreground flex theme-transition">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 lg:ml-0">
        {/* Mobile header with store info */}
        <div className="lg:hidden bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Current Store Display */}
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-blue-600" />
              <div className="text-center">
                <h3 className="font-semibold text-sm">{currentStore?.name || 'My Store'}</h3>
                <p className="text-xs text-gray-600">{currentStore?.address || ''}</p>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <User className="h-5 w-5" />
            </Button>
          </div>
          
          {currentAttendant && (
            <div className="mt-2 text-center">
              <Badge variant="outline" className="text-xs">
                Cashier: {currentAttendant.name}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Desktop header with store info */}
        <div className="hidden lg:block bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="font-bold text-lg">{currentStore?.name || 'My Store'}</h2>
                <p className="text-sm text-gray-600">{currentStore?.address || ''}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {currentAttendant && (
                <Badge variant="outline">
                  Cashier: {currentAttendant.name}
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
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

const Index = () => {
  return (
    <DemoModeProvider>
      <StoreProvider>
        <AuthProvider>
          <ThemeProvider>
            <IndexContent />
          </ThemeProvider>
        </AuthProvider>
      </StoreProvider>
    </DemoModeProvider>
  );
};

export default Index;
