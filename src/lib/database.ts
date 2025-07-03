import { supabase } from './supabase';
import { Product, Customer, Supplier, Transaction, Purchase, Expense, Attendant } from '@/types';

// Profile functions
export const createProfile = async (profileData: {
  store_name: string;
  phone?: string;
  currency?: string;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

// Product functions
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(product => ({
    id: product.id,
    name: product.name,
    buyingCost: product.buying_cost,
    wholesalePrice: product.wholesale_price,
    retailPrice: product.retail_price,
    price: product.price,
    category: product.category,
    stock: product.stock,
    unit: product.unit,
    image: product.image,
    supplierId: product.supplier_id,
    barcode: product.barcode,
    lowStockThreshold: product.low_stock_threshold
  }));
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      name: product.name,
      buying_cost: product.buyingCost,
      wholesale_price: product.wholesalePrice,
      retail_price: product.retailPrice,
      price: product.price,
      category: product.category,
      stock: product.stock,
      unit: product.unit,
      image: product.image,
      supplier_id: product.supplierId,
      barcode: product.barcode,
      low_stock_threshold: product.lowStockThreshold
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    buyingCost: data.buying_cost,
    wholesalePrice: data.wholesale_price,
    retailPrice: data.retail_price,
    price: data.price,
    category: data.category,
    stock: data.stock,
    unit: data.unit,
    image: data.image,
    supplierId: data.supplier_id,
    barcode: data.barcode,
    lowStockThreshold: data.low_stock_threshold
  };
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({
      name: updates.name,
      buying_cost: updates.buyingCost,
      wholesale_price: updates.wholesalePrice,
      retail_price: updates.retailPrice,
      price: updates.price,
      category: updates.category,
      stock: updates.stock,
      unit: updates.unit,
      image: updates.image,
      supplier_id: updates.supplierId,
      barcode: updates.barcode,
      low_stock_threshold: updates.lowStockThreshold,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Customer functions
export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(customer => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    creditLimit: customer.credit_limit,
    outstandingBalance: customer.outstanding_balance,
    loyaltyPoints: customer.loyalty_points,
    createdAt: new Date(customer.created_at)
  }));
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert([{
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      credit_limit: customer.creditLimit,
      outstanding_balance: customer.outstandingBalance,
      loyalty_points: customer.loyaltyPoints
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    creditLimit: data.credit_limit,
    outstandingBalance: data.outstanding_balance,
    loyaltyPoints: data.loyalty_points,
    createdAt: new Date(data.created_at)
  };
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .update({
      name: updates.name,
      phone: updates.phone,
      email: updates.email,
      address: updates.address,
      credit_limit: updates.creditLimit,
      outstanding_balance: updates.outstandingBalance,
      loyalty_points: updates.loyaltyPoints
    })
    .eq('id', id);

  if (error) throw error;
};

// Transaction functions
export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(transaction => ({
    id: transaction.id,
    items: transaction.items,
    total: transaction.total,
    paymentSplits: transaction.payment_splits,
    customerId: transaction.customer_id,
    attendantId: transaction.attendant_id,
    timestamp: new Date(transaction.created_at),
    hirePurchaseId: transaction.hire_purchase_id,
    status: transaction.status,
    voidedAt: transaction.voided_at ? new Date(transaction.voided_at) : undefined,
    refundedAt: transaction.refunded_at ? new Date(transaction.refunded_at) : undefined,
    voidReason: transaction.void_reason,
    refundReason: transaction.refund_reason
  }));
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      items: transaction.items,
      total: transaction.total,
      payment_splits: transaction.paymentSplits,
      customer_id: transaction.customerId,
      attendant_id: transaction.attendantId,
      status: transaction.status,
      hire_purchase_id: transaction.hirePurchaseId,
      voided_at: transaction.voidedAt?.toISOString(),
      refunded_at: transaction.refundedAt?.toISOString(),
      void_reason: transaction.voidReason,
      refund_reason: transaction.refundReason
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    items: data.items,
    total: data.total,
    paymentSplits: data.payment_splits,
    customerId: data.customer_id,
    attendantId: data.attendant_id,
    timestamp: new Date(data.created_at),
    hirePurchaseId: data.hire_purchase_id,
    status: data.status,
    voidedAt: data.voided_at ? new Date(data.voided_at) : undefined,
    refundedAt: data.refunded_at ? new Date(data.refunded_at) : undefined,
    voidReason: data.void_reason,
    refundReason: data.refund_reason
  };
};

// Supplier functions
export const getSuppliers = async (): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(supplier => ({
    id: supplier.id,
    name: supplier.name,
    phone: supplier.phone,
    email: supplier.email,
    address: supplier.address,
    products: [], // Will be populated separately if needed
    bankDetails: supplier.bank_details,
    mpesaDetails: supplier.mpesa_details,
    createdAt: new Date(supplier.created_at)
  }));
};

export const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> => {
  const { data, error } = await supabase
    .from('suppliers')
    .insert([{
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      bank_details: supplier.bankDetails,
      mpesa_details: supplier.mpesaDetails
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    products: [],
    bankDetails: data.bank_details,
    mpesaDetails: data.mpesa_details,
    createdAt: new Date(data.created_at)
  };
};

// Purchase functions
export const getPurchases = async (): Promise<Purchase[]> => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(purchase => ({
    id: purchase.id,
    supplierId: purchase.supplier_id,
    items: purchase.items,
    totalCost: purchase.total_cost,
    date: new Date(purchase.created_at),
    attendantId: purchase.attendant_id,
    receiptImage: purchase.receipt_image,
    invoiceNumber: purchase.invoice_number
  }));
};

export const addPurchase = async (purchase: Omit<Purchase, 'id'>): Promise<Purchase> => {
  const { data, error } = await supabase
    .from('purchases')
    .insert([{
      supplier_id: purchase.supplierId,
      items: purchase.items,
      total_cost: purchase.totalCost,
      attendant_id: purchase.attendantId,
      receipt_image: purchase.receiptImage,
      invoice_number: purchase.invoiceNumber
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    supplierId: data.supplier_id,
    items: data.items,
    totalCost: data.total_cost,
    date: new Date(data.created_at),
    attendantId: data.attendant_id,
    receiptImage: data.receipt_image,
    invoiceNumber: data.invoice_number
  };
};

// Expense functions
export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(expense => ({
    id: expense.id,
    category: expense.category,
    amount: expense.amount,
    description: expense.description,
    date: new Date(expense.created_at),
    attendantId: expense.attendant_id
  }));
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      attendant_id: expense.attendantId
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,  
    category: data.category,
    amount: data.amount,
    description: data.description,
    date: new Date(data.created_at),
    attendantId: data.attendant_id
  };
};

// Attendant functions
export const getAttendants = async (): Promise<Attendant[]> => {
  const { data, error } = await supabase
    .from('attendants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(attendant => ({
    id: attendant.id,
    name: attendant.name,
    email: attendant.email,
    phone: attendant.phone,
    role: attendant.role,
    permissions: attendant.permissions,
    isActive: attendant.is_active,
    assignedStoreId: attendant.assigned_store_id,
    pin: attendant.pin,
    createdAt: new Date(attendant.created_at),
    workSchedule: attendant.work_schedule
  }));
};

export const addAttendant = async (attendant: Omit<Attendant, 'id' | 'createdAt'>): Promise<Attendant> => {
  const { data, error } = await supabase
    .from('attendants')
    .insert([{
      name: attendant.name,
      email: attendant.email,
      phone: attendant.phone,  
      role: attendant.role,
      permissions: attendant.permissions,
      is_active: attendant.isActive,
      assigned_store_id: attendant.assignedStoreId,
      pin: attendant.pin,
      work_schedule: attendant.workSchedule
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    permissions: data.permissions,  
    isActive: data.is_active,
    assignedStoreId: data.assigned_store_id,
    pin: data.pin,
    createdAt: new Date(data.created_at),
    workSchedule: data.work_schedule
  };
};

// Utility functions for security
export const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+=/gi, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Data export functions
export const exportData = async (dataType: 'products' | 'customers' | 'transactions' | 'all') => {
  const exportData: any = {};
  
  try {
    if (dataType === 'products' || dataType === 'all') {
      exportData.products = await getProducts();
    }
    if (dataType === 'customers' || dataType === 'all') {
      exportData.customers = await getCustomers();
    }
    if (dataType === 'transactions' || dataType === 'all') {
      exportData.transactions = await getTransactions();
    }
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pos-data-${dataType}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};
