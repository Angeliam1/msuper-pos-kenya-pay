
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Transaction, Attendant } from '@/types';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoProducts: Product[];
  demoCustomers: Customer[];
  demoTransactions: Transaction[];
  demoAttendants: Attendant[];
  addDemoTransaction: (transaction: Transaction) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

// Sample demo data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Coca Cola 500ml',
    category: 'Beverages',
    price: 50,
    buyingCost: 35,
    wholesalePrice: 45,
    retailPrice: 50,
    stock: 100,
    barcode: '12345',
    description: 'Refreshing soft drink',
    supplierId: 'sup1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Bread White 400g',
    category: 'Bakery',
    price: 60,
    buyingCost: 40,
    wholesalePrice: 55,
    retailPrice: 60,
    stock: 50,
    barcode: '12346',
    description: 'Fresh white bread',
    supplierId: 'sup1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Milk 1L',
    category: 'Dairy',
    price: 80,
    buyingCost: 60,
    wholesalePrice: 75,
    retailPrice: 80,
    stock: 30,
    barcode: '12347',
    description: 'Fresh milk',
    supplierId: 'sup2',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'John Doe',
    phone: '+254712345678',
    email: 'john@demo.com',
    loyaltyPoints: 150,
    outstandingBalance: 0,
    createdAt: new Date()
  },
  {
    id: 'cust2',
    name: 'Jane Smith',
    phone: '+254723456789',
    email: 'jane@demo.com',
    loyaltyPoints: 75,
    outstandingBalance: 250,
    createdAt: new Date()
  }
];

const sampleAttendants: Attendant[] = [
  {
    id: 'att1',
    name: 'Demo Cashier',
    role: 'cashier',
    pin: '1234',
    isActive: true,
    permissions: ['pos', 'reports'],
    createdAt: new Date()
  },
  {
    id: 'att2',
    name: 'Demo Manager',
    role: 'manager',
    pin: '5678',
    isActive: true,
    permissions: ['pos', 'reports', 'settings', 'products'],
    createdAt: new Date()
  }
];

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoTransactions, setDemoTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load demo mode preference from localStorage
    const savedDemoMode = localStorage.getItem('pos_demo_mode');
    if (savedDemoMode === 'true') {
      setIsDemoMode(true);
    }
  }, []);

  const toggleDemoMode = () => {
    const newDemoMode = !isDemoMode;
    setIsDemoMode(newDemoMode);
    localStorage.setItem('pos_demo_mode', newDemoMode.toString());
    
    if (newDemoMode) {
      // Generate sample transactions
      const sampleTransactions: Transaction[] = [
        {
          id: 'demo-trans-1',
          items: [
            { productId: '1', quantity: 2, price: 50, name: 'Coca Cola 500ml' },
            { productId: '2', quantity: 1, price: 60, name: 'Bread White 400g' }
          ],
          total: 160,
          subtotal: 160,
          tax: 0,
          discount: 0,
          paymentMethod: 'cash',
          customerId: 'cust1',
          attendantId: 'att1',
          status: 'completed',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          receiptNumber: 'REC-001'
        },
        {
          id: 'demo-trans-2',
          items: [
            { productId: '3', quantity: 1, price: 80, name: 'Milk 1L' }
          ],
          total: 80,
          subtotal: 80,
          tax: 0,
          discount: 0,
          paymentMethod: 'mpesa',
          customerId: 'walk-in',
          attendantId: 'att1',
          status: 'completed',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          receiptNumber: 'REC-002'
        }
      ];
      setDemoTransactions(sampleTransactions);
    } else {
      setDemoTransactions([]);
    }
  };

  const addDemoTransaction = (transaction: Transaction) => {
    if (isDemoMode) {
      setDemoTransactions(prev => [transaction, ...prev]);
    }
  };

  const value = {
    isDemoMode,
    toggleDemoMode,
    demoProducts: sampleProducts,
    demoCustomers: sampleCustomers,
    demoTransactions,
    demoAttendants: sampleAttendants,
    addDemoTransaction
  };

  return (
    <DemoModeContext.Provider value={value}>
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
