
import React, { useState } from 'react';
import { Sidebar } from '@/components/pos/Sidebar';
import { Dashboard } from '@/components/pos/Dashboard';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { Reports } from '@/components/pos/Reports';
import { Settings } from '@/components/pos/Settings';
import { OnlineStoreManager } from '@/components/online-store/OnlineStoreManager';
import { SuperAdminStoreManager } from '@/components/pos/SuperAdminStoreManager';
import { ThemeProvider } from '@/components/pos/ThemeProvider';
import { StoreProvider, useStore } from '@/contexts/StoreContext';
import { DemoModeProvider, useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Store, User } from 'lucide-react';
import { Attendant } from '@/types';

const IndexContent = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentAttendant, setCurrentAttendant] = useState<Attendant | null>(null);
  
  const { currentStore } = useStore();
  const { demoProducts, demoCustomers, demoTransactions, demoAttendants } = useDemoMode();

  // Calculate dashboard metrics using demo data
  const totalSales = demoTransactions.reduce((sum, t) => sum + t.total, 0);
  const todaySales = demoTransactions
    .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.total, 0);
  const transactionCount = demoTransactions.length;

  const handleSaveSettings = (settings: any) => {
    console.log('Settings saved:', settings);
  };

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
                <h3 className="font-semibold text-sm">{currentStore?.name || 'Demo Store'}</h3>
                <p className="text-xs text-gray-600">Demo Mode</p>
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
                <h2 className="font-bold text-lg">{currentStore?.name || 'Demo Store'}</h2>
                <Badge variant="outline">Demo Mode - No Authentication Required</Badge>
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

const Index = () => {
  return (
    <DemoModeProvider>
      <StoreProvider>
        <ThemeProvider>
          <IndexContent />
        </ThemeProvider>
      </StoreProvider>
    </DemoModeProvider>
  );
};

export default Index;
