
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
    return null;
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

// Export functionality
export const exportData = async (type: 'products' | 'customers' | 'transactions' | 'all' = 'all') => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data for export');
    const mockData = {
      products: mockProducts,
      customers: mockCustomers,
      transactions: [],
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
