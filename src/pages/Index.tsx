
import React, { useState } from 'react';
import { Sidebar } from '@/components/pos/Sidebar';
import { Dashboard } from '@/components/pos/Dashboard';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { CustomerManagement } from '@/components/pos/CustomerManagement';
import { TransactionHistory } from '@/components/pos/TransactionHistory';
import { Reports } from '@/components/pos/Reports';
import { Settings } from '@/components/pos/Settings';
import { LowStockAlerts } from '@/components/pos/LowStockAlerts';
import { RoleManagement } from '@/components/pos/RoleManagement';
import { SupplierManagement } from '@/components/pos/SupplierManagement';
import { LoyaltyManagement } from '@/components/pos/LoyaltyManagement';
import { MultiStoreManagement } from '@/components/pos/MultiStoreManagement';
import { ReturnsManagement } from '@/components/pos/ReturnsManagement';
import { ExpenseManagement } from '@/components/pos/ExpenseManagement';
import { PurchaseManagement } from '@/components/pos/PurchaseManagement';
import { HirePurchase } from '@/components/pos/HirePurchase';
import { OnlineStore } from '@/components/online-store/OnlineStore';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'history':
        return <TransactionHistory />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'alerts':
        return <LowStockAlerts />;
      case 'staff':
        return <RoleManagement />;
      case 'suppliers':
        return <SupplierManagement />;
      case 'loyalty':
        return <LoyaltyManagement />;
      case 'stores':
        return <MultiStoreManagement />;
      case 'returns':
        return <ReturnsManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'purchases':
        return <PurchaseManagement />;
      case 'hire-purchase':
        return <HirePurchase />;
      case 'online-store':
        return <OnlineStore />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b p-4">
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
  );
};

export default Index;
