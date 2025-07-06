import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreLocation, Product, Customer, Transaction, Attendant } from '@/types';

interface StoreContextType {
  currentStore: StoreLocation | null;
  setCurrentStore: (store: StoreLocation) => void;
  stores: StoreLocation[];
  addStore: (store: Omit<StoreLocation, 'id'>) => void;
  updateStore: (id: string, updates: Partial<StoreLocation>) => void;
  getStoreProducts: (storeId: string) => Product[];
  updateStoreProduct: (storeId: string, productId: string, updates: Partial<Product>) => void;
  addProductToStore: (storeId: string, product: Omit<Product, 'id'>) => void;
  deleteStoreProduct: (storeId: string, productId: string) => void;
  getStoreCustomers: (storeId: string) => Customer[];
  addCustomerToStore: (storeId: string, customer: Omit<Customer, 'id'>) => void;
  updateStoreCustomer: (storeId: string, customerId: string, updates: Partial<Customer>) => void;
  getStoreTransactions: (storeId: string) => Transaction[];
  addTransactionToStore: (storeId: string, transaction: Transaction) => void;
  getStoreAttendants: (storeId: string) => Attendant[];
  addAttendantToStore: (storeId: string, attendant: Omit<Attendant, 'id'>) => void;
  getStoreCashBalance: (storeId: string) => number;
  updateStoreCashBalance: (storeId: string, amount: number, type: 'add' | 'subtract') => void;
  getStoreSettings: (storeId: string) => any;
  updateStoreSettings: (storeId: string, settings: any) => void;
  getStoreSuppliers: (storeId: string) => any[];
  addSupplierToStore: (storeId: string, supplier: any) => void;
  updateStoreSupplier: (storeId: string, supplierId: string, updates: any) => void;
  deleteStoreSupplier: (storeId: string, supplierId: string) => void;
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

  // Store-specific data storage with enhanced structure
  const [storeData, setStoreData] = useState<Record<string, {
    products: Product[];
    customers: Customer[];
    transactions: Transaction[];
    attendants: Attendant[];
    suppliers: any[];
    cashBalance: number;
    storeSettings: {
      currency: string;
      taxRate: number;
      lowStockThreshold: number;
      enableLoyaltyProgram: boolean;
      loyaltyPointsPerShilling: number;
      autoBackup: boolean;
      showProductImages: boolean;
      enableBarcode: boolean;
      requireCustomerInfo: boolean;
      allowNegativeStock: boolean;
      defaultPaymentMethod: string;
      theme: string;
      fontSize: string;
    };
    printerSettings: any;
    smsSettings: any;
  }>>({
    'store-1': {
      products: [
        {
          id: 'product-1',
          name: 'iPhone 15 Pro Max',
          category: 'Electronics',
          buyingCost: 150000,
          wholesalePrice: 150000,
          retailPrice: 180000,
          price: 180000,
          stock: 15,
          barcode: '123456789012',
          supplierId: 'supplier-1',
          description: 'Latest iPhone model with advanced features',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'product-2',
          name: 'Samsung Galaxy S24 Ultra',
          category: 'Electronics',
          buyingCost: 140000,
          wholesalePrice: 140000,
          retailPrice: 170000,
          price: 170000,
          stock: 8,
          barcode: '123456789013',
          supplierId: 'supplier-1',
          description: 'Premium Samsung smartphone with S Pen',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      customers: [
        {
          id: 'walk-in',
          name: 'Walk-in Customer',
          email: '',
          phone: '',
          address: '',
          loyaltyPoints: 0,
          creditLimit: 0,
          outstandingBalance: 0,
          createdAt: new Date()
        },
        {
          id: 'customer-1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+254700000000',
          address: 'Nairobi, Kenya',
          loyaltyPoints: 0,
          creditLimit: 50000,
          outstandingBalance: 0,
          createdAt: new Date()
        },
        {
          id: 'customer-2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+254711111111',
          address: 'Nairobi, Kenya',
          loyaltyPoints: 0,
          creditLimit: 75000,
          outstandingBalance: 0,
          createdAt: new Date()
        }
      ],
      transactions: [],
      attendants: [],
      suppliers: [
        {
          id: 'supplier-1',
          name: 'Apple Kenya',
          phone: '+254755555555',
          email: 'apple@example.com',
          address: 'Nairobi, Kenya',
          bankName: '',
          accountNumber: '',
          createdAt: new Date()
        }
      ],
      cashBalance: 0,
      storeSettings: {
        currency: 'KES',
        taxRate: 16,
        lowStockThreshold: 10,
        enableLoyaltyProgram: true,
        loyaltyPointsPerShilling: 0.01,
        autoBackup: true,
        showProductImages: true,
        enableBarcode: true,
        requireCustomerInfo: false,
        allowNegativeStock: false,
        defaultPaymentMethod: 'cash',
        theme: 'light',
        fontSize: 'medium'
      },
      printerSettings: {
        printerEnabled: false,
        printerConnectionType: 'bluetooth',
        bluetoothPrinterName: '',
        bluetoothPrinterAddress: '',
        ethernetPrinterIP: '',
        ethernetPrinterPort: '9100',
        usbPrinterName: '',
        printCopies: 1,
        printTimeout: 30,
        autoPrint: false
      },
      smsSettings: {
        smsEnabled: false,
        smsProvider: 'phone',
        businessPhone: '',
        businessName: 'Main Branch Electronics',
        hirePurchaseTemplate: 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}',
        paymentReminderTemplate: 'Hi {customerName}, your payment of KES {amount} is pending at {businessName} ({businessPhone}) and is {daysLate} days late. Pay now: {paymentLink}',
        paymentConfirmTemplate: 'Hi {customerName}, payment received! Amount: KES {amount}. New balance: KES {balance}. Thank you! - {businessName}'
      }
    },
    'store-2': {
      products: [],
      customers: [{
        id: 'walk-in',
        name: 'Walk-in Customer',
        email: '',
        phone: '',
        address: '',
        loyaltyPoints: 0,
        creditLimit: 0,
        outstandingBalance: 0,
        createdAt: new Date()
      }],
      transactions: [],
      attendants: [],
      suppliers: [],
      cashBalance: 0,
      storeSettings: {
        currency: 'KES',
        taxRate: 16,
        lowStockThreshold: 10,
        enableLoyaltyProgram: true,
        loyaltyPointsPerShilling: 0.01,
        autoBackup: true,
        showProductImages: true,
        enableBarcode: true,
        requireCustomerInfo: false,
        allowNegativeStock: false,
        defaultPaymentMethod: 'cash',
        theme: 'light',
        fontSize: 'medium'
      },
      printerSettings: {
        printerEnabled: false,
        printerConnectionType: 'bluetooth',
        bluetoothPrinterName: '',
        bluetoothPrinterAddress: '',
        ethernetPrinterIP: '',
        ethernetPrinterPort: '9100',
        usbPrinterName: '',
        printCopies: 1,
        printTimeout: 30,
        autoPrint: false
      },
      smsSettings: {
        smsEnabled: false,
        smsProvider: 'phone',
        businessPhone: '',
        businessName: 'Downtown Tech Hub',
        hirePurchaseTemplate: 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}',
        paymentReminderTemplate: 'Hi {customerName}, your payment of KES {amount} is pending at {businessName} ({businessPhone}) and is {daysLate} days late. Pay now: {paymentLink}',
        paymentConfirmTemplate: 'Hi {customerName}, payment received! Amount: KES {amount}. New balance: KES {balance}. Thank you! - {businessName}'
      }
    }
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
    
    // Initialize store data with complete structure
    setStoreData(prev => ({
      ...prev,
      [newStore.id]: {
        products: [],
        customers: [{
          id: 'walk-in',
          name: 'Walk-in Customer',
          email: '',
          phone: '',
          address: '',
          loyaltyPoints: 0,
          creditLimit: 0,
          outstandingBalance: 0,
          createdAt: new Date()
        }],
        transactions: [],
        attendants: [],
        suppliers: [],
        cashBalance: 0,
        storeSettings: {
          currency: 'KES',
          taxRate: 16,
          lowStockThreshold: 10,
          enableLoyaltyProgram: true,
          loyaltyPointsPerShilling: 0.01,
          autoBackup: true,
          showProductImages: true,
          enableBarcode: true,
          requireCustomerInfo: false,
          allowNegativeStock: false,
          defaultPaymentMethod: 'cash',
          theme: 'light',
          fontSize: 'medium'
        },
        printerSettings: {
          printerEnabled: false,
          printerConnectionType: 'bluetooth',
          bluetoothPrinterName: '',
          bluetoothPrinterAddress: '',
          ethernetPrinterIP: '',
          ethernetPrinterPort: '9100',
          usbPrinterName: '',
          printCopies: 1,
          printTimeout: 30,
          autoPrint: false
        },
        smsSettings: {
          smsEnabled: false,
          smsProvider: 'phone',
          businessPhone: '',
          businessName: newStore.name,
          hirePurchaseTemplate: 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}',
          paymentReminderTemplate: 'Hi {customerName}, your payment of KES {amount} is pending at {businessName} ({businessPhone}) and is {daysLate} days late. Pay now: {paymentLink}',
          paymentConfirmTemplate: 'Hi {customerName}, payment received! Amount: KES {amount}. New balance: KES {balance}. Thank you! - {businessName}'
        }
      }
    }));
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    setStores(prev => prev.map(store => 
      store.id === id ? { ...store, ...updates } : store
    ));
  };

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
      addProductToStore,
      deleteStoreProduct,
      getStoreCustomers,
      addCustomerToStore,
      updateStoreCustomer,
      getStoreTransactions,
      addTransactionToStore,
      getStoreAttendants,
      addAttendantToStore,
      getStoreCashBalance,
      updateStoreCashBalance,
      getStoreSettings,
      updateStoreSettings,
      getStoreSuppliers,
      addSupplierToStore,
      updateStoreSupplier,
      deleteStoreSupplier
    }}>
      {children}
    </StoreContext.Provider>
  );
};
