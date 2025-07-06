
import { useState } from 'react';
import { Product } from '@/types';
import { StoreData } from '@/types/store-context';

export const useStoreProducts = (
  storeData: Record<string, StoreData>,
  setStoreData: React.Dispatch<React.SetStateAction<Record<string, StoreData>>>
) => {
  const getStoreProducts = (storeId: string): Product[] => {
    return storeData[storeId]?.products || [];
  };

  const updateStoreProduct = (storeId: string, productId: string, updates: Partial<Product>) => {
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        products: prev[storeId]?.products.map(product => 
          product.id === productId ? { ...product, ...updates } : product
        ) || []
      }
    }));
  };

  const addProductToStore = (storeId: string, product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        products: [...(prev[storeId]?.products || []), newProduct]
      }
    }));
  };

  const deleteStoreProduct = (storeId: string, productId: string) => {
    setStoreData(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        products: prev[storeId]?.products.filter(product => product.id !== productId) || []
      }
    }));
  };

  return {
    getStoreProducts,
    updateStoreProduct,
    addProductToStore,
    deleteStoreProduct
  };
};
