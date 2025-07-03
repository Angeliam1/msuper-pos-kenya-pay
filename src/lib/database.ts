import { supabase } from './supabase';
import { Product, Customer, Transaction, Supplier, Purchase, Expense, Attendant } from '@/types';
import { sanitizeInput, validateEmail, validatePhone } from '@/utils/security';

// Mock data for development when Supabase is not configured
const mockProducts: Product[] = [
  { 
    id: '1', 
    name: 'Coca Cola 500ml', 
    buyingCost: 60,
    wholesalePrice: 70,
    retailPrice: 80,
    price: 80, 
    category: 'Beverages', 
    stock: 50, 
    unit: 'pcs',
    barcode: '1234567890123', 
    lowStockThreshold: 20 
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Kamau',
    phone: '0712345678',
    email: 'john@email.com',
    creditLimit: 50000,
    outstandingBalance: 0,
    loyaltyPoints: 0,
    createdAt: new Date()
  }
];

const mockTransactions: Transaction[] = [];

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Main Supplier',
    phone: '0722345678',
    email: 'supplier@email.com',
    products: [],
    createdAt: new Date()
  }
];

const mockPurchases: Purchase[] = [];

const mockAttendants: Attendant[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@store.com',
    phone: '0712345678',
    role: 'admin',
    permissions: ['pos', 'products', 'customers', 'suppliers', 'reports', 'staff', 'settings'],
    isActive: true,
    pin: '1234',
    createdAt: new Date()
  }
];

const mockExpenses: Expense[] = [];

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return supabase && typeof supabase.from === 'function';
};

// Products
export const getProducts = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured()) {
    return mockProducts;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return mockProducts;
  }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    return null;
  }

  try {
    const sanitizedProduct = {
      name: sanitizeInput(product.name),
      buying_cost: product.buyingCost,
      wholesale_price: product.wholesalePrice,
      retail_price: product.retailPrice,
      price: product.price,
      category: sanitizeInput(product.category),
      stock: product.stock,
      unit: sanitizeInput(product.unit),
      barcode: product.barcode ? sanitizeInput(product.barcode) : null,
      low_stock_threshold: product.lowStockThreshold,
      description: product.description ? sanitizeInput(product.description) : null
    };

    const { data, error } = await supabase
      .from('products')
      .insert([sanitizedProduct])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    return null;
  }

  try {
    const sanitizedUpdates: any = {};
    
    if (updates.name) sanitizedUpdates.name = sanitizeInput(updates.name);
    if (updates.buyingCost !== undefined) sanitizedUpdates.buying_cost = updates.buyingCost;
    if (updates.wholesalePrice !== undefined) sanitizedUpdates.wholesale_price = updates.wholesalePrice;
    if (updates.retailPrice !== undefined) sanitizedUpdates.retail_price = updates.retailPrice;
    if (updates.price !== undefined) sanitizedUpdates.price = updates.price;
    if (updates.category) sanitizedUpdates.category = sanitizeInput(updates.category);
    if (updates.stock !== undefined) sanitizedUpdates.stock = updates.stock;
    if (updates.unit) sanitizedUpdates.unit = sanitizeInput(updates.unit);
    if (updates.barcode) sanitizedUpdates.barcode = sanitizeInput(updates.barcode);
    if (updates.lowStockThreshold !== undefined) sanitizedUpdates.low_stock_threshold = updates.lowStockThreshold;
    if (updates.description) sanitizedUpdates.description = sanitizeInput(updates.description);

    const { data, error } = await supabase
      .from('products')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    return false;
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Customers
export const getCustomers = async (): Promise<Customer[]> => {
  if (!isSupabaseConfigured()) {
    return mockCustomers;
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return mockCustomers;
  }
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    // Create a mock customer with ID and createdAt
    const mockCustomer: Customer = {
      id: `mock-${Date.now()}`,
      ...customer,
      createdAt: new Date()
    };
    mockCustomers.push(mockCustomer);
    return mockCustomer;
  }

  try {
    const sanitizedCustomer = {
      name: sanitizeInput(customer.name),
      phone: customer.phone ? validatePhone(customer.phone) : null,
      email: customer.email ? validateEmail(customer.email) : null,
      address: customer.address ? sanitizeInput(customer.address) : null,
      credit_limit: customer.creditLimit,
      outstanding_balance: customer.outstandingBalance,
      loyalty_points: customer.loyaltyPoints
    };

    const { data, error } = await supabase
      .from('customers')
      .insert([sanitizedCustomer])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    // Find and update the mock customer
    const customerIndex = mockCustomers.findIndex(c => c.id === id);
    if (customerIndex !== -1) {
      mockCustomers[customerIndex] = { ...mockCustomers[customerIndex], ...updates };
      return mockCustomers[customerIndex];
    }
    return null;
  }

  try {
    const sanitizedUpdates: any = {};
    
    if (updates.name) sanitizedUpdates.name = sanitizeInput(updates.name);
    if (updates.phone) sanitizedUpdates.phone = validatePhone(updates.phone);
    if (updates.email) sanitizedUpdates.email = validateEmail(updates.email);
    if (updates.address) sanitizedUpdates.address = sanitizeInput(updates.address);
    if (updates.creditLimit !== undefined) sanitizedUpdates.credit_limit = updates.creditLimit;
    if (updates.outstandingBalance !== undefined) sanitizedUpdates.outstanding_balance = updates.outstandingBalance;
    if (updates.loyaltyPoints !== undefined) sanitizedUpdates.loyalty_points = updates.loyaltyPoints;

    const { data, error } = await supabase
      .from('customers')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  if (!isSupabaseConfigured()) {
    return mockTransactions;
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return mockTransactions;
  }
};

export const addTransaction = async (transaction: Transaction): Promise<Transaction | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    // Add to mock transactions
    mockTransactions.push(transaction);
    return transaction;
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Suppliers
export const getSuppliers = async (): Promise<Supplier[]> => {
  if (!isSupabaseConfigured()) {
    return mockSuppliers;
  }

  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return mockSuppliers;
  }
};

// Purchases
export const getPurchases = async (): Promise<Purchase[]> => {
  if (!isSupabaseConfigured()) {
    return mockPurchases;
  }

  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('purchaseDate', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return mockPurchases;
  }
};

export const addPurchase = async (purchase: Omit<Purchase, 'id'>): Promise<Purchase | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchase])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding purchase:', error);
    throw error;
  }
};

// Attendants
export const getAttendants = async (): Promise<Attendant[]> => {
  if (!isSupabaseConfigured()) {
    return mockAttendants;
  }

  try {
    const { data, error } = await supabase
      .from('attendants')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching attendants:', error);
    return mockAttendants;
  }
};

export const addAttendant = async (attendant: Omit<Attendant, 'id' | 'createdAt'>): Promise<Attendant | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('attendants')
      .insert([attendant])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding attendant:', error);
    throw error;
  }
};

export const updateAttendant = async (id: string, updates: Partial<Attendant>): Promise<Attendant | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('attendants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating attendant:', error);
    throw error;
  }
};

// Expenses
export const getExpenses = async (): Promise<Expense[]> => {
  if (!isSupabaseConfigured()) {
    return mockExpenses;
  }

  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return mockExpenses;
  }
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense | null> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

// Export functionality
export const exportData = async (type: 'products' | 'customers' | 'transactions' | 'all' = 'all') => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data for export');
    const mockData = {
      products: mockProducts,
      customers: mockCustomers,
      transactions: mockTransactions,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(mockData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `msuper-pos-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return;
  }

  try {
    const exportData: any = {
      exportDate: new Date().toISOString()
    };

    if (type === 'products' || type === 'all') {
      const { data: products } = await supabase.from('products').select('*');
      exportData.products = products || [];
    }

    if (type === 'customers' || type === 'all') {
      const { data: customers } = await supabase.from('customers').select('*');
      exportData.customers = customers || [];
    }

    if (type === 'transactions' || type === 'all') {
      const { data: transactions } = await supabase.from('transactions').select('*');
      exportData.transactions = transactions || [];
    }

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `msuper-pos-export-${type}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};
