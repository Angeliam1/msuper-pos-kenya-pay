
import React from 'react';
import { POSLayout } from './POSLayout';
import { POSContentRenderer } from './POSContentRenderer';
import { usePOSStateManager } from './POSStateManager';

export const POSApplication: React.FC = () => {
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
  );
};
