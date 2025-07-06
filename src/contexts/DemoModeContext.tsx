
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Transaction, Attendant, CartItem } from '@/types';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoProducts: Product[];
  demoCustomers: Customer[];
  demoTransactions: Transaction[];
  demoAttendants: Attendant[];
  addDemoTransaction: (transaction: Transaction) => void;
  updateDemoProductStock: (productId: string, newStock: number) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

// Enhanced sample demo data with more products
const createSampleProducts = (): Product[] => [
  {
    id: 'demo-1',
    name: 'Coca Cola 500ml',
    category: 'Beverages',
    price: 50,
    buyingCost: 35,
    wholesalePrice: 45,
    retailPrice: 50,
    stock: 100,
    barcode: '12345001',
    description: 'Refreshing soft drink',
    supplierId: 'sup1',
    unit: 'bottle',
    lowStockThreshold: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-2',
    name: 'White Bread 400g',
    category: 'Bakery',
    price: 60,
    buyingCost: 40,
    wholesalePrice: 55,
    retailPrice: 60,
    stock: 50,
    barcode: '12345002',
    description: 'Fresh white bread',
    supplierId: 'sup1',
    unit: 'loaf',
    lowStockThreshold: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-3',
    name: 'Fresh Milk 1L',
    category: 'Dairy',
    price: 80,
    buyingCost: 60,
    wholesalePrice: 75,
    retailPrice: 80,
    stock: 30,
    barcode: '12345003',
    description: 'Fresh cow milk',
    supplierId: 'sup2',
    unit: 'litre',
    lowStockThreshold: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-4',
    name: 'Rice 2kg',
    category: 'Cereals',
    price: 150,
    buyingCost: 120,
    wholesalePrice: 140,
    retailPrice: 150,
    stock: 25,
    barcode: '12345004',
    description: 'Premium rice',
    supplierId: 'sup3',
    unit: 'kg',
    lowStockThreshold: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-5',
    name: 'Cooking Oil 1L',
    category: 'Cooking',
    price: 200,
    buyingCost: 160,
    wholesalePrice: 185,
    retailPrice: 200,
    stock: 15,
    barcode: '12345005',
    description: 'Pure cooking oil',
    supplierId: 'sup2',
    unit: 'litre',
    lowStockThreshold: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleCustomers: Customer[] = [
  {
    id: 'demo-cust1',
    name: 'John Doe',
    phone: '+254712345678',
    email: 'john@demo.com',
    address: '123 Demo Street, Nairobi',
    loyaltyPoints: 150,
    creditLimit: 1000,
    outstandingBalance: 0,
    createdAt: new Date()
  },
  {
    id: 'demo-cust2',
    name: 'Jane Smith',
    phone: '+254723456789',
    email: 'jane@demo.com',
    address: '456 Test Avenue, Mombasa',
    loyaltyPoints: 75,
    creditLimit: 500,
    outstandingBalance: 250,
    createdAt: new Date()
  },
  {
    id: 'demo-cust3',
    name: 'Mike Johnson',
    phone: '+254734567890',
    email: 'mike@demo.com',
    address: '789 Sample Road, Kisumu',
    loyaltyPoints: 300,
    creditLimit: 2000,
    outstandingBalance: 0,
    createdAt: new Date()
  }
];

const sampleAttendants: Attendant[] = [
  {
    id: 'demo-att1',
    name: 'Demo Cashier',
    email: 'cashier@demo.com',
    phone: '+254700000001',
    role: 'cashier',
    pin: '1234',
    isActive: true,
    permissions: ['pos', 'reports'],
    createdAt: new Date(),
    isDemoMode: true
  },
  {
    id: 'demo-att2',
    name: 'Demo Manager',
    email: 'manager@demo.com',
    phone: '+254700000002',
    role: 'manager',
    pin: '5678',
    isActive: true,
    permissions: ['pos', 'reports', 'settings', 'products'],
    createdAt: new Date(),
    isDemoMode: true
  },
  {
    id: 'demo-admin-001',
    name: 'Demo Administrator',
    email: 'admin@demo.com',
    phone: '+1234567890',
    role: 'admin',
    isActive: true,
    pin: 'demo123',
    createdAt: new Date(),
    isDemoMode: true,
    permissions: ['all']
  }
];

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoProducts, setDemoProducts] = useState<Product[]>([]);
  const [demoTransactions, setDemoTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Initialize demo products
    setDemoProducts(createSampleProducts());
    
    // Load demo mode preference from localStorage
    const savedDemoMode = localStorage.getItem('pos_demo_mode');
    if (savedDemoMode === 'true') {
      setIsDemoMode(true);
      generateSampleTransactions();
    }
  }, []);

  const generateSampleTransactions = () => {
    const products = createSampleProducts();
    const sampleTransactions: Transaction[] = [
      {
        id: 'demo-trans-1',
        items: [
          {
            ...products[0],
            quantity: 2
          } as CartItem,
          {
            ...products[1],
            quantity: 1
          } as CartItem
        ],
        total: 160,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        customerId: 'demo-cust1',
        attendantId: 'demo-att1',
        paymentSplits: [{ method: 'cash', amount: 160 }],
        status: 'completed'
      },
      {
        id: 'demo-trans-2',
        items: [
          {
            ...products[2],
            quantity: 1
          } as CartItem
        ],
        total: 80,
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        customerId: 'walk-in',
        attendantId: 'demo-att1',
        paymentSplits: [{ method: 'mpesa', amount: 80 }],
        status: 'completed'
      },
      {
        id: 'demo-trans-3',
        items: [
          {
            ...products[3],
            quantity: 1
          } as CartItem,
          {
            ...products[4],
            quantity: 2
          } as CartItem
        ],
        total: 550,
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        customerId: 'demo-cust2',
        attendantId: 'demo-att2',
        paymentSplits: [{ method: 'cash', amount: 300 }, { method: 'mpesa', amount: 250 }],
        status: 'completed'
      }
    ];
    setDemoTransactions(sampleTransactions);
  };

  const toggleDemoMode = () => {
    const newDemoMode = !isDemoMode;
    setIsDemoMode(newDemoMode);
    localStorage.setItem('pos_demo_mode', newDemoMode.toString());
    
    if (newDemoMode) {
      generateSampleTransactions();
      console.log('Demo mode enabled with sample data');
    } else {
      setDemoTransactions([]);
      console.log('Demo mode disabled');
    }
  };

  const addDemoTransaction = (transaction: Transaction) => {
    if (isDemoMode) {
      setDemoTransactions(prev => [transaction, ...prev]);
      console.log('Demo transaction added:', transaction.id);
    }
  };

  const updateDemoProductStock = (productId: string, newStock: number) => {
    if (isDemoMode) {
      setDemoProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, stock: newStock, updatedAt: new Date() }
            : product
        )
      );
      console.log(`Demo product ${productId} stock updated to ${newStock}`);
    }
  };

  const value = {
    isDemoMode,
    toggleDemoMode,
    demoProducts,
    demoCustomers: sampleCustomers,
    demoTransactions,
    demoAttendants: sampleAttendants,
    addDemoTransaction,
    updateDemoProductStock
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
