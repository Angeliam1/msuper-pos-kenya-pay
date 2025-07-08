
import React from 'react';
import { POSLayout } from './POSLayout';
import { POSContentRenderer } from './POSContentRenderer';
import { usePOSStateManager } from './POSStateManager';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Wifi, WifiOff } from 'lucide-react';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';

export const POSApplication: React.FC = () => {
  const { isOnline } = useOfflineSupport();
  
  const {
    activeTab,
    sidebarOpen,
    showBarcodeScanner,
    totalSales,
    todaySales,
    transactions,
    products,
    customers,
    setActiveTab,
    setSidebarOpen,
    setShowBarcodeScanner,
    handleProductFound,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleAddCustomer,
    handleUpdateCustomer,
    handleSaveSettings
  } = usePOSStateManager();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Online/Offline Status Banner */}
      <div className={`px-4 py-2 text-center text-sm font-medium ${
        isOnline 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        <div className="flex items-center justify-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              Online - All features available
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              Offline - Limited functionality, data will sync when online
            </>
          )}
        </div>
      </div>

      <POSLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowBarcodeScanner={setShowBarcodeScanner}
      >
        <POSContentRenderer
          activeTab={activeTab}
          showBarcodeScanner={showBarcodeScanner}
          setShowBarcodeScanner={setShowBarcodeScanner}
          totalSales={totalSales}
          todaySales={todaySales}
          transactions={transactions}
          products={products}
          customers={customers}
          onProductFound={handleProductFound}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddCustomer={handleAddCustomer}
          onUpdateCustomer={handleUpdateCustomer}
          onSaveSettings={handleSaveSettings}
        />
      </POSLayout>
    </div>
  );
};
