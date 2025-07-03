
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreLocation, Product } from '@/types';

interface StoreContextType {
  currentStore: StoreLocation | null;
  setCurrentStore: (store: StoreLocation) => void;
  stores: StoreLocation[];
  addStore: (store: Omit<StoreLocation, 'id'>) => void;
  updateStore: (id: string, updates: Partial<StoreLocation>) => void;
  getStoreProducts: (storeId: string) => Product[];
  updateStoreProduct: (storeId: string, productId: string, updates: Partial<Product>) => void;
  addProductToStore: (storeId: string, product: Omit<Product, 'id'>) => void;
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
  const [currentStore, setCurrentStore] = useState<StoreLocation | null>(null);
  const [stores, setStores] = useState<StoreLocation[]>([
    {
      id: 'store-1',
      name: 'Main Branch Electronics',
      address: '123 Main Street, Nairobi',
      phone: '+254 700 000 001',
      managerId: 'manager-1',
      manager: 'John Doe',
      status: 'active',
      totalSales: 250000,
      isActive: true,
      createdAt: new Date(),
      receiptSettings: {
        size: '80mm',
        showLogo: true,
        showAddress: true,
        showPhone: true,
        header: 'Thank you for shopping with us!',
        footer: 'Visit us again soon!',
        autoprint: false
      },
      pricingSettings: {
        allowPriceBelowWholesale: false,
        defaultPriceType: 'retail',
        taxRate: 16
      }
    },
    {
      id: 'store-2', 
      name: 'Downtown Tech Hub',
      address: '456 Downtown Ave, Nairobi',
      phone: '+254 700 000 002',
      managerId: 'manager-2',
      manager: 'Jane Smith',
      status: 'active',
      totalSales: 180000,
      isActive: true,
      createdAt: new Date(),
      receiptSettings: {
        size: '58mm',
        showLogo: true,
        showAddress: true,
        showPhone: true,
        header: 'Thank you for your business!',
        footer: 'Come back soon!',
        autoprint: false
      },
      pricingSettings: {
        allowPriceBelowWholesale: false,
        defaultPriceType: 'retail',
        taxRate: 16
      }
    }
  ]);

  // Store-specific products storage
  const [storeProducts, setStoreProducts] = useState<Record<string, Product[]>>({
    'store-1': [],
    'store-2': []
  });

  const addStore = (store: Omit<StoreLocation, 'id'>) => {
    const newStore: StoreLocation = {
      ...store,
      id: `store-${Date.now()}`,
      receiptSettings: {
        size: '80mm',
        showLogo: true,
        showAddress: true,
        showPhone: true,
        header: 'Thank you for shopping with us!',
        footer: 'Visit us again soon!',
        autoprint: false
      },
      pricingSettings: {
        allowPriceBelowWholesale: false,
        defaultPriceType: 'retail',
        taxRate: 16
      }
    };
    setStores(prev => [...prev, newStore]);
    setStoreProducts(prev => ({ ...prev, [newStore.id]: [] }));
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    setStores(prev => prev.map(store => 
      store.id === id ? { ...store, ...updates } : store
    ));
  };

  const getStoreProducts = (storeId: string): Product[] => {
    return storeProducts[storeId] || [];
  };

  const updateStoreProduct = (storeId: string, productId: string, updates: Partial<Product>) => {
    setStoreProducts(prev => ({
      ...prev,
      [storeId]: prev[storeId]?.map(product => 
        product.id === productId ? { ...product, ...updates } : product
      ) || []
    }));
  };

  const addProductToStore = (storeId: string, product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setStoreProducts(prev => ({
      ...prev,
      [storeId]: [...(prev[storeId] || []), newProduct]
    }));
  };

  // Set default store if none selected
  useEffect(() => {
    if (!currentStore && stores.length > 0) {
      setCurrentStore(stores[0]);
    }
  }, [stores, currentStore]);

  return (
    <StoreContext.Provider value={{
      currentStore,
      setCurrentStore,
      stores,
      addStore,
      updateStore,
      getStoreProducts,
      updateStoreProduct,
      addProductToStore
    }}>
      {children}
    </StoreContext.Provider>
  );
};
