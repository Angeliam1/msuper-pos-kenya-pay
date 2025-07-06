
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Customer, Transaction } from '@/types';

interface DemoModeContextType {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  demoProducts: Product[];
  demoCustomers: Customer[];
  demoTransactions: Transaction[];
  addDemoTransaction: (transaction: Transaction) => void;
  updateDemoProductStock: (productId: string, newStock: number) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

// Sample demo data
const sampleProducts: Product[] = [
  {
    id: 'demo-1',
    name: 'Coca Cola 500ml',
    category: 'Beverages',
    buyingCost: 35,
    retailPrice: 50,
    wholesalePrice: 45,
    stock: 24,
    minStock: 5,
    barcode: '123456789',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-2',
    name: 'Bread (White)',
    category: 'Bakery',
    buyingCost: 40,
    retailPrice: 60,
    wholesalePrice: 55,
    stock: 15,
    minStock: 3,
    barcode: '987654321',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-3',
    name: 'Rice 2kg',
    category: 'Groceries',
    buyingCost: 180,
    retailPrice: 250,
    wholesalePrice: 220,
    stock: 8,
    minStock: 2,
    barcode: '456789123',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleCustomers: Customer[] = [
  {
    id: 'demo-customer-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254700123456',
    address: 'Nairobi, Kenya',
    loyaltyPoints: 50,
    creditLimit: 5000,
    outstandingBalance: 0,
    createdAt: new Date()
  }
];

export const DemoModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoProducts, setDemoProducts] = useState<Product[]>(sampleProducts);
  const [demoCustomers] = useState<Customer[]>(sampleCustomers);
  const [demoTransactions, setDemoTransactions] = useState<Transaction[]>([]);

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
  };

  const addDemoTransaction = (transaction: Transaction) => {
    setDemoTransactions(prev => [transaction, ...prev]);
  };

  const updateDemoProductStock = (productId: string, newStock: number) => {
    setDemoProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock, updatedAt: new Date() }
          : product
      )
    );
  };

  return (
    <DemoModeContext.Provider value={{
      isDemoMode,
      setDemoMode,
      demoProducts,
      demoCustomers,
      demoTransactions,
      addDemoTransaction,
      updateDemoProductStock
    }}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
