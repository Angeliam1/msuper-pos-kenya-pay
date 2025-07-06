
import { Attendant } from '@/types';
import { StoreData } from '@/types/store-context';

export const useStoreSettings = (
  storeData: Record<string, StoreData>,
  setStoreData: React.Dispatch<React.SetStateAction<Record<string, StoreData>>>
) => {
  const getStoreAttendants = (storeId: string): Attendant[] => {
    return storeData[storeId]?.attendants || [];
  };

  const addAttendantToStore = (storeId: string, attendant: Omit<Attendant, 'id'>) => {
    const newAttendant: Attendant = {
      ...attendant,
      id: `attendant-${Date.now()}`,
      createdAt: new Date()
    };
    
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        attendants: [...(prev[storeId]?.attendants || []), newAttendant]
      }
    }));
  };

  const getStoreCashBalance = (storeId: string): number => {
    return storeData[storeId]?.cashBalance || 0;
  };

  const updateStoreCashBalance = (storeId: string, amount: number, type: 'add' | 'subtract') => {
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        cashBalance: type === 'add' 
          ? (prev[storeId]?.cashBalance || 0) + amount
          : (prev[storeId]?.cashBalance || 0) - amount
      }
    }));
  };

  const getStoreSettings = (storeId: string) => {
    return storeData[storeId]?.storeSettings || {};
  };

  const updateStoreSettings = (storeId: string, settings: any) => {
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        storeSettings: { ...prev[storeId]?.storeSettings, ...settings }
      }
    }));
  };

  return {
    getStoreAttendants,
    addAttendantToStore,
    getStoreCashBalance,
    updateStoreCashBalance,
    getStoreSettings,
    updateStoreSettings
  };
};
