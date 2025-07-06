
import { Product, Customer, CartItem, Transaction, Staff, LoyaltyProgram, Store, Supplier, PurchaseOrder, Expense, StockMovement, Settings, Purchase, Attendant } from '@/types';

// Mock data for products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    category: 'Electronics',
    price: 180000,
    buyingCost: 150000,
    retailPrice: 180000,
    stock: 15,
    minStock: 5,
    unit: 'piece',
    barcode: '123456789012',
    description: 'Latest iPhone with advanced camera system',
    lowStockThreshold: 5,
    supplierId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    price: 165000,
    buyingCost: 140000,
    retailPrice: 165000,
    stock: 20,
    minStock: 5,
    unit: 'piece',
    barcode: '234567890123',
    description: 'Premium Android smartphone with S Pen',
    lowStockThreshold: 5,
    supplierId: '2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'MacBook Pro 14" M3',
    category: 'Computers',
    price: 280000,
    buyingCost: 240000,
    retailPrice: 280000,
    stock: 8,
    minStock: 3,
    unit: 'piece',
    barcode: '345678901234',
    description: 'Professional laptop with M3 chip',
    lowStockThreshold: 3,
    supplierId: '3',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 45000,
    buyingCost: 35000,
    retailPrice: 45000,
    stock: 25,
    minStock: 10,
    unit: 'piece',
    barcode: '456789012345',
    description: 'Premium noise-cancelling headphones',
    lowStockThreshold: 10,
    supplierId: '4',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'iPad Air 5th Gen',
    category: 'Electronics',
    price: 85000,
    buyingCost: 70000,
    retailPrice: 85000,
    stock: 12,
    minStock: 5,
    unit: 'piece',
    barcode: '567890123456',
    description: 'Versatile tablet for work and play',
    lowStockThreshold: 5,
    supplierId: '5',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Dell XPS 13',
    category: 'Computers',
    price: 155000,
    buyingCost: 130000,
    retailPrice: 155000,
    stock: 10,
    minStock: 5,
    unit: 'piece',
    barcode: '678901234567',
    description: 'Ultra-portable laptop for professionals',
    lowStockThreshold: 5,
    supplierId: '6',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'Apple Watch Series 9',
    category: 'Wearables',
    price: 55000,
    buyingCost: 45000,
    retailPrice: 55000,
    stock: 18,
    minStock: 8,
    unit: 'piece',
    barcode: '789012345678',
    description: 'Advanced smartwatch with health monitoring',
    lowStockThreshold: 8,
    supplierId: '7',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    name: 'Canon EOS R6 Mark II',
    category: 'Cameras',
    price: 350000,
    buyingCost: 300000,
    retailPrice: 350000,
    stock: 5,
    minStock: 2,
    unit: 'piece',
    barcode: '890123456789',
    description: 'Professional mirrorless camera',
    lowStockThreshold: 2,
    supplierId: '8',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    name: 'PlayStation 5',
    category: 'Gaming',
    price: 75000,
    buyingCost: 65000,
    retailPrice: 75000,
    stock: 7,
    minStock: 3,
    unit: 'piece',
    barcode: '901234567890',
    description: 'Next-gen gaming console',
    lowStockThreshold: 3,
    supplierId: '9',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '10',
    name: 'AirPods Pro 2nd Gen',
    category: 'Audio',
    price: 32000,
    buyingCost: 25000,
    retailPrice: 32000,
    stock: 30,
    minStock: 15,
    unit: 'piece',
    barcode: '012345678901',
    description: 'Premium wireless earbuds with ANC',
    lowStockThreshold: 15,
    supplierId: '10',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock data for customers
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254700000000',
    address: 'Nairobi, Kenya',
    loyaltyPoints: 150,
    creditLimit: 50000,
    outstandingBalance: 0,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+254711111111',
    address: 'Mombasa, Kenya',
    loyaltyPoints: 200,
    creditLimit: 75000,
    outstandingBalance: 0,
    createdAt: new Date()
  }
];

// Mock data for transactions
export const mockTransactions: Transaction[] = [];

// Mock data for staff (fixed - removed firstName/lastName, added name)
export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+254722222222',
    role: 'admin',
    permissions: ['pos', 'products', 'customers', 'suppliers', 'reports', 'staff', 'settings'],
    isActive: true,
    createdAt: new Date()
  }
];

// Mock data for attendants
export const mockAttendants: Attendant[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+254722222222',
    role: 'admin',
    permissions: ['pos', 'products', 'customers', 'suppliers', 'reports', 'staff', 'settings'],
    isActive: true,
    pin: '1234',
    createdAt: new Date()
  }
];

// Mock data for suppliers (fixed - added isActive and updatedAt)
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Apple Kenya',
    contactPerson: 'John Apple',
    phone: '+254755555555',
    email: 'apple@example.com',
    address: 'Nairobi, Kenya',
    products: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock data for purchases
export const mockPurchases: Purchase[] = [];

// Mock data for expenses (fixed - removed createdAt from the literal)
export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: new Date(),
    category: 'Rent',
    amount: 50000,
    description: 'Monthly rent for Nairobi store',
    attendantId: '1'
  }
];

let products = [...mockProducts];
let customers = [...mockCustomers];
let transactions: Transaction[] = [];
let staff: Staff[] = [];
let attendants = [...mockAttendants];
let loyaltyPrograms: LoyaltyProgram[] = [];
let stores: Store[] = [];
let suppliers = [...mockSuppliers];
let purchaseOrders: PurchaseOrder[] = [];
let purchases = [...mockPurchases];
let expenses = [...mockExpenses];
let stockMovements: StockMovement[] = [];
let settings: Settings = {
  id: 'settings-1',
  storeId: 'store-1',
  currency: 'KES',
  taxRate: 16,
  timezone: 'Africa/Nairobi',
  createdAt: new Date(),
  updatedAt: new Date()
};

// Database functions
export const getProducts = (): Product[] => products;
export const getCustomers = (): Customer[] => customers;
export const getTransactions = (): Transaction[] => transactions;
export const getStaff = (): Staff[] => staff;
export const getAttendants = (): Attendant[] => attendants;
export const getLoyaltyPrograms = (): LoyaltyProgram[] => loyaltyPrograms;
export const getStores = (): Store[] => stores;
export const getSuppliers = (): Supplier[] => suppliers;
export const getPurchaseOrders = (): PurchaseOrder[] => purchaseOrders;
export const getPurchases = (): Purchase[] => purchases;
export const getExpenses = (): Expense[] => expenses;
export const getStockMovements = (): StockMovement[] => stockMovements;
export const getSettings = (): Settings => settings;

export const addProduct = (product: Product): void => {
  products.push(product);
};

export const updateProduct = (id: string, updates: Partial<Product>): Product => {
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    return products[index];
  }
  throw new Error('Product not found');
};

export const deleteProduct = (id: string): void => {
  products = products.filter(p => p.id !== id);
};

export const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
  const customer: Customer = {
    ...customerData,
    id: `customer-${Date.now()}`,
    createdAt: new Date()
  };
  customers.push(customer);
  return customer;
};

export const updateCustomer = (id: string, updates: Partial<Customer>): Customer => {
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updates };
    return customers[index];
  }
  throw new Error('Customer not found');
};

export const addTransaction = (transaction: Transaction): void => {
  transactions.push(transaction);
};

export const addStaff = (staffMember: Staff): void => {
  staff.push(staffMember);
};

export const updateStaff = (id: string, updates: Partial<Staff>): void => {
  const index = staff.findIndex(s => s.id === id);
  if (index !== -1) {
    staff[index] = { ...staff[index], ...updates };
  }
};

export const addSupplier = (supplier: Supplier): void => {
  suppliers.push(supplier);
};

export const addPurchaseOrder = (order: PurchaseOrder): void => {
  purchaseOrders.push(order);
};

export const addPurchase = (purchaseData: Omit<Purchase, 'id'>): Purchase => {
  const purchase: Purchase = {
    ...purchaseData,
    id: `purchase-${Date.now()}`
  };
  purchases.push(purchase);
  return purchase;
};

export const addExpense = (expense: Expense): void => {
  expenses.push(expense);
};

export const addStockMovement = (movement: StockMovement): void => {
  stockMovements.push(movement);
};

export const updateSettings = (newSettings: Partial<Settings>): void => {
  settings = { ...settings, ...newSettings };
};

export const exportData = async (type: 'products' | 'customers' | 'transactions' | 'all'): Promise<void> => {
  const data = {
    products: type === 'all' || type === 'products' ? products : undefined,
    customers: type === 'all' || type === 'customers' ? customers : undefined,
    transactions: type === 'all' || type === 'transactions' ? transactions : undefined
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
