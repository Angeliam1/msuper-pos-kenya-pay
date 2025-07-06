
import { Customer } from '@/types';
import { StoreData } from '@/types/store-context';

export const useStoreCustomers = (
  storeData: Record<string, StoreData>,
  setStoreData: React.Dispatch<React.SetStateAction<Record<string, StoreData>>>
) => {
  const getStoreCustomers = (storeId: string): Customer[] => {
    return storeData[storeId]?.customers || [];
  };

  const addCustomerToStore = (storeId: string, customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `customer-${Date.now()}`,
      createdAt: new Date()
    };
    
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        customers: [...(prev[storeId]?.customers || []), newCustomer]
      }
    }));
  };

  const updateStoreCustomer = (storeId: string, customerId: string, updates: Partial<Customer>) => {
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        customers: prev[storeId]?.customers.map(customer => 
          customer.id === customerId ? { ...customer, ...updates } : customer
        ) || []
      }
    }));
  };

  return {
    getStoreCustomers,
    addCustomerToStore,
    updateStoreCustomer
  };
};
