
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ProductManagement } from './ProductManagement';
import { Dashboard } from './Dashboard';
import { Reports } from './Reports';
import { Settings } from './Settings';
import { MultiStoreManagement } from './MultiStoreManagement';
import { OnlineStoreManager } from '../online-store/OnlineStoreManager';
import { EnhancedBarcodeScanner } from './EnhancedBarcodeScanner';
import { EnhancedReports } from './EnhancedReports';
import { EnhancedProductManagement } from './EnhancedProductManagement';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
import { useStore } from '@/contexts/StoreContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Menu, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const POSApplication: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  
  const { 
    currentStore, 
    getStoreProducts, 
    updateStoreProduct, 
    addProductToStore,
    getStoreTransactions,
    getStoreCustomers,
    addTransactionToStore
  } = useStore();

  const { 
    isOnline, 
    pendingSyncCount, 
    syncOfflineData,
    saveOfflineData 
  } = useOfflineSupport();

  const { toast } = useToast();

  // Get store-specific data
  const products = currentStore ? getStoreProducts(currentStore.id) : [];
  const transactions = currentStore ? getStoreTransactions(currentStore.id) : [];
  const customers = currentStore ? getStoreCustomers(currentStore.id) : [];

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const todaySales = transactions
    .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.total, 0);

  const handleProductFound = (product: any) => {
    // This would be handled by the ProductManagement component
    console.log('Product found:', product);
    setShowBarcodeScanner(false);
  };

  const handleAddProduct = (productData: any) => {
    if (!currentStore) return;
    
    if (!isOnline) {
      saveOfflineData('products', { storeId: currentStore.id, product: productData });
      toast({
        title: "Saved Offline",
        description: "Product will be synced when online",
      });
    } else {
      addProductToStore(currentStore.id, productData);
    }
  };

  const handleUpdateProduct = (id: string, updates: any) => {
    if (!currentStore) return;
    
    if (!isOnline) {
      saveOfflineData('products', { storeId: currentStore.id, productId: id, updates });
    } else {
      updateStoreProduct(currentStore.id, id, updates);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (!currentStore) return;
    
    if (!isOnline) {
      saveOfflineData('products', { storeId: currentStore.id, productId: id, action: 'delete' });
    } else {
      // Implement delete functionality
      console.log('Delete product:', id);
    }
  };

  const renderContent = () => {
    if (showBarcodeScanner) {
      return (
        <div className="p-6">
          <EnhancedBarcodeScanner
            products={products}
            onProductFound={handleProductFound}
            onClose={() => setShowBarcodeScanner(false)}
          />
        </div>
      );
    }

    switch (activeTab) {
      case 'pos':
        return <ProductManagement />;
      case 'dashboard':
        return (
          <div className="p-6">
            <Dashboard
              totalSales={totalSales}
              todaySales={todaySales}
              transactionCount={transactions.length}
              transactions={transactions}
              products={products}
            />
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <EnhancedReports
              transactions={transactions}
              products={products}
              customers={customers}
            />
          </div>
        );
      case 'stores':
        return (
          <div className="p-6">
            <MultiStoreManagement />
          </div>
        );
      case 'online-store':
        return (
          <div className="p-6">
            <OnlineStoreManager />
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <div className="space-y-6">
              <Settings />
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Enhanced Product Management</h3>
                <EnhancedProductManagement
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              </div>
            </div>
          </div>
        );
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">M-Super POS</h1>
              {currentStore && (
                <Badge variant="outline">{currentStore.name}</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Offline Status */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-sm">Offline</span>
                </div>
              )}
              
              {pendingSyncCount > 0 && (
                <Badge variant="secondary">
                  {pendingSyncCount} pending
                </Badge>
              )}
            </div>

            {/* Sync Button */}
            {isOnline && pendingSyncCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={syncOfflineData}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync
              </Button>
            )}

            {/* Enhanced Barcode Scanner Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBarcodeScanner(true)}
            >
              <Scan className="h-4 w-4 mr-1" />
              Scanner
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
