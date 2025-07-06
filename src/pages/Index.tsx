
import React, { useState } from 'react';
import { StoreProvider } from '@/contexts/StoreContext';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { MultiStoreManagement } from '@/components/pos/MultiStoreManagement';
import { OnlineStoreManager } from '@/components/online-store/OnlineStoreManager';
import { OnlineStore } from '@/components/online-store/OnlineStore';
import { Navigation } from '@/components/pos/Navigation';
import { Header } from '@/components/pos/Header';
import { POSSystem } from '@/components/pos/POSSystem';
import { DashboardStats } from '@/components/pos/DashboardStats';
import { ProductsView, ReportsView, SettingsView } from '@/components/pos/PlaceholderViews';

const Index = () => {
  console.log('Index component rendering...');
  
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return <POSSystem />;
      case 'dashboard':
        return <DashboardStats />;
      case 'products':
        return <ProductsView />;
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
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <POSSystem />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Navigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <Header setSidebarOpen={setSidebarOpen} />
          
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
