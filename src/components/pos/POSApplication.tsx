
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { POSHeader } from './POSHeader';
import { POSContentRenderer } from './POSContentRenderer';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
import { useStore } from '@/contexts/StoreContext';
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
    addTransactionToStore,
    addCustomerToStore,
    updateStoreCustomer
  } = useStore();

  const { 
    isOnline, 
    saveOfflineData 
  } = useOfflineSupport();

  const { toast } = useToast();

  const products = currentStore ? getStoreProducts(currentStore.id) : [];
  const transactions = currentStore ? getStoreTransactions(currentStore.id) : [];
  const customers = currentStore ? getStoreCustomers(currentStore.id) : [];

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const todaySales = transactions
    .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.total, 0);

  const handleProductFound = (product: any) => {
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
      console.log('Delete product:', id);
    }
  };

  const handleAddCustomer = (customerData: any) => {
    if (!currentStore) return;
    
    if (!isOnline) {
      saveOfflineData('customers', { storeId: currentStore.id, customer: customerData });
      toast({
        title: "Saved Offline",
        description: "Customer will be synced when online",
      });
    } else {
      addCustomerToStore(currentStore.id, customerData);
    }
  };

  const handleUpdateCustomer = (id: string, updates: any) => {
    if (!currentStore) return;
    
    if (!isOnline) {
      saveOfflineData('customers', { storeId: currentStore.id, customerId: id, updates });
    } else {
      updateStoreCustomer(currentStore.id, id, updates);
    }
  };

  const handleSaveSettings = (settings: any) => {
    console.log('Saving settings:', settings);
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
        <POSHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setActiveTab={setActiveTab}
          setShowBarcodeScanner={setShowBarcodeScanner}
        />

        <main className="flex-1 overflow-auto">
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
        </main>
      </div>
    </div>
  );
};
