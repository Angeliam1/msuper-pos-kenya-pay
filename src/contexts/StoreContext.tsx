
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreLocation } from '@/types';
import { StoreContextType, StoreData } from '@/types/store-context';
import { createDefaultStoreData, createMockStores } from '@/utils/store-data-utils';
import { useStoreProducts } from '@/hooks/useStoreProducts';
import { useStoreCustomers } from '@/hooks/useStoreCustomers';
import { useStoreTransactions } from '@/hooks/useStoreTransactions';
import { useStoreSuppliers } from '@/hooks/useStoreSuppliers';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [currentStore, setCurrentStore] = useState<StoreLocation | null>(null);
  const [storeData, setStoreData] = useState<Record<string, StoreData>>({});

  // Initialize with mock data
  useEffect(() => {
    const mockStores = createMockStores('demo-tenant', 'Demo Company');
    setStores(mockStores);
    setCurrentStore(mockStores[0]);
    
    // Initialize store data for each store
    const initialStoreData: Record<string, StoreData> = {};
    mockStores.forEach(store => {
      initialStoreData[store.id] = createDefaultStoreData(store.name);
    });
    setStoreData(initialStoreData);
  }, []);

  // Initialize hooks for store operations
  const storeProducts = useStoreProducts(storeData, setStoreData);
  const storeCustomers = useStoreCustomers(storeData, setStoreData);
  const storeTransactions = useStoreTransactions(storeData, setStoreData);
  const storeSuppliers = useStoreSuppliers(storeData, setStoreData);
  const storeSettings = useStoreSettings(storeData, setStoreData);

  const addStore = (store: Omit<StoreLocation, 'id'>) => {
    const newStore: StoreLocation = {
      ...store,
      id: `store-${Date.now()}`,
      receiptSettings: {
        showLogo: true,
        businessName: store.name,
        businessAddress: store.address,
        businessPhone: store.phone || '',
        footerMessage: 'Thank you for shopping with us!',
        showQr: false,
        qrType: 'website'
      },
      pricingSettings: {
        allowNegativePricing: false,
        roundPrices: true,
        defaultMarkup: 20,
        bulkPricingEnabled: false
      }
    };
    
    setStores(prev => [...prev, newStore]);
    setStoreData(prev => ({
      ...prev,
      [newStore.id]: createDefaultStoreData(newStore.name)
    }));
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    setStores(prev => prev.map(store => 
      store.id === id ? { ...store, ...updates } : store
    ));
    
    // Update current store if it's the one being updated
    if (currentStore?.id === id) {
      setCurrentStore(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const contextValue: StoreContextType = {
    currentStore,
    setCurrentStore,
    stores,
    addStore,
    updateStore,
    ...storeProducts,
    ...storeCustomers,
    ...storeTransactions,
    ...storeSuppliers,
    ...storeSettings
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
