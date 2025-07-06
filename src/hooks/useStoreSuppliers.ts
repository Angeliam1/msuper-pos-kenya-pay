
import { StoreData } from '@/types/store-context';

export const useStoreSuppliers = (
  storeData: Record<string, StoreData>,
  setStoreData: React.Dispatch<React.SetStateAction<Record<string, StoreData>>>
) => {
  const getStoreSuppliers = (storeId: string) => {
    return storeData[storeId]?.suppliers || [];
  };

  const addSupplierToStore = (storeId: string, supplier: any) => {
    const newSupplier = {
      ...supplier,
      id: `supplier-${Date.now()}`,
      createdAt: new Date()
    };
    
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        suppliers: [...(prev[storeId]?.suppliers || []), newSupplier]
      }
    }));
  };

  const updateStoreSupplier = (storeId: string, supplierId: string, updates: any) => {
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        suppliers: prev[storeId]?.suppliers.map(supplier => 
          supplier.id === supplierId ? { ...supplier, ...updates } : supplier
        ) || []
      }
    }));
  };

  const deleteStoreSupplier = (storeId: string, supplierId: string) => {
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        suppliers: prev[storeId]?.suppliers.filter(supplier => supplier.id !== supplierId) || []
      }
    }));
  };

  return {
    getStoreSuppliers,
    addSupplierToStore,
    updateStoreSupplier,
    deleteStoreSupplier
  };
};
