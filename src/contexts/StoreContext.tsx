
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
  getStoreSuppliers: (storeId: string) => Supplier[];
  getStoreCashBalance: (storeId: string) => number;
  updateStoreProduct: (storeId: string, productId: string, updates: Partial<Product>) => void;
  addProductToStore: (storeId: string, product: Omit<Product, 'id'>) => void;
  addCustomerToStore: (storeId: string, customer: Customer) => void;
  addTransactionToStore: (storeId: string, transaction: Transaction) => void;
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
  
  // Store-specific data storage
  const [storeProducts, setStoreProducts] = useState<Record<string, Product[]>>({});
  const [storeCustomers, setStoreCustomers] = useState<Record<string, Customer[]>>({});
  const [storeTransactions, setStoreTransactions] = useState<Record<string, Transaction[]>>({});
  const [storeSuppliers, setStoreSuppliers] = useState<Record<string, Supplier[]>>({});

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

  // Store-specific data functions
  const getStoreProducts = (storeId: string): Product[] => {
    return storeProducts[storeId] || [];
  };

  const getStoreCustomers = (storeId: string): Customer[] => {
    return storeCustomers[storeId] || [];
  };

  const getStoreTransactions = (storeId: string): Transaction[] => {
    return storeTransactions[storeId] || [];
  };

  const getStoreSuppliers = (storeId: string): Supplier[] => {
    return storeSuppliers[storeId] || [];
  };

  const getStoreCashBalance = (storeId: string): number => {
    const transactions = getStoreTransactions(storeId);
    return transactions.reduce((sum, t) => sum + t.total, 0);
  };

  const updateStoreProduct = (storeId: string, productId: string, updates: Partial<Product>) => {
    setStoreProducts(prev => ({
      ...prev,
      [storeId]: (prev[storeId] || []).map(product =>
        product.id === productId ? { ...product, ...updates } : product
      )
    }));
  };

  const addProductToStore = (storeId: string, productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
    };
    
    setStoreProducts(prev => ({
      ...prev,
      [storeId]: [...(prev[storeId] || []), newProduct]
    }));
  };

  const addCustomerToStore = (storeId: string, customer: Customer) => {
    setStoreCustomers(prev => ({
      ...prev,
      [storeId]: [...(prev[storeId] || []), customer]
    }));
  };

  const addTransactionToStore = (storeId: string, transaction: Transaction) => {
    setStoreTransactions(prev => ({
      ...prev,
      [storeId]: [...(prev[storeId] || []), transaction]
    }));
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
    getStoreSuppliers,
    getStoreCashBalance,
    updateStoreProduct,
    addProductToStore,
    addCustomerToStore,
    addTransactionToStore,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
