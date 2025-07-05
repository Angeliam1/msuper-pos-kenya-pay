
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreLocation, Product, Customer, Transaction, Attendant, Supplier, Expense } from '@/types';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface StoreContextType {
  stores: StoreLocation[];
  currentStore: StoreLocation | null;
  addStore: (store: Omit<StoreLocation, 'id'>) => void;
  updateStore: (id: string, updates: Partial<StoreLocation>) => void;
  setCurrentStore: (store: StoreLocation | null) => void;
  getStoreProducts: (storeId: string) => Product[];
  getStoreCustomers: (storeId: string) => Customer[];
  getStoreTransactions: (storeId: string) => Transaction[];
  getStoreCashBalance: (storeId: string) => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [currentStore, setCurrentStore] = useState<StoreLocation | null>(null);

  // Initialize user's store from their profile when authenticated
  useEffect(() => {
    if (user && user.user_metadata) {
      const userStore: StoreLocation = {
        id: `store-${user.id}`,
        name: user.user_metadata.store_name || 'My Store',
        address: user.user_metadata.address || 'Store Address',
        phone: user.user_metadata.phone || '',
        managerId: user.id,
        manager: user.user_metadata.owner_name || user.email || 'Store Owner',
        status: 'active',
        totalSales: 0,
        isActive: true,
        createdAt: new Date()
      };

      // Check if store already exists
      const existingStore = stores.find(s => s.id === userStore.id);
      if (!existingStore) {
        setStores(prev => [userStore, ...prev]);
      }
      
      // Set as current store if no current store is selected
      if (!currentStore) {
        setCurrentStore(userStore);
      }
    }
  }, [user, stores, currentStore]);

  const addStore = (storeData: Omit<StoreLocation, 'id'>) => {
    const newStore: StoreLocation = {
      ...storeData,
      id: `store-${Date.now()}`,
    };
    setStores(prev => [...prev, newStore]);
    return newStore;
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    setStores(prev => prev.map(store => 
      store.id === id ? { ...store, ...updates } : store
    ));
    
    if (currentStore?.id === id) {
      setCurrentStore(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Mock data functions - in a real app, these would fetch from database
  const getStoreProducts = (storeId: string): Product[] => {
    // Return empty array for now - would fetch store-specific products
    return [];
  };

  const getStoreCustomers = (storeId: string): Customer[] => {
    // Return empty array for now - would fetch store-specific customers
    return [];
  };

  const getStoreTransactions = (storeId: string): Transaction[] => {
    // Return empty array for now - would fetch store-specific transactions
    return [];
  };

  const getStoreCashBalance = (storeId: string): number => {
    // Return 0 for now - would calculate from store-specific transactions
    return 0;
  };

  const value: StoreContextType = {
    stores,
    currentStore,
    addStore,
    updateStore,
    setCurrentStore,
    getStoreProducts,
    getStoreCustomers,
    getStoreTransactions,
    getStoreCashBalance,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
