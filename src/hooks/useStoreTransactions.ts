
import { Transaction } from '@/types';
import { StoreData } from '@/types/store-context';

export const useStoreTransactions = (
  storeData: Record<string, StoreData>,
  setStoreData: React.Dispatch<React.SetStateAction<Record<string, StoreData>>>
) => {
  const getStoreTransactions = (storeId: string): Transaction[] => {
    return storeData[storeId]?.transactions || [];
  };

  const addTransactionToStore = (storeId: string, transaction: Transaction) => {
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        transactions: [...(prev[storeId]?.transactions || []), transaction]
      }
    }));
  };

  return {
    getStoreTransactions,
    addTransactionToStore
  };
};
