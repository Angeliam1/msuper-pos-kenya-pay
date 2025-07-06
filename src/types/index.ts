
export interface Product {
  id: string;
  name: string;
  category: string;
  buyingCost: number;
  retailPrice: number;
  price: number; // Added missing price property
  wholesalePrice?: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  lowStockThreshold?: number; // Added missing property
  barcode?: string;
  description?: string;
  imageUrl?: string;
  unit?: string;
  supplierId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  creditLimit: number;
  outstandingBalance: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CartItem extends Product {
  quantity: number;
  price: number;
}

export interface PaymentSplit {
  method: 'cash' | 'mpesa' | 'card' | 'credit' | 'bank'; // Added 'bank' method
  amount: number;
  reference?: string; // Added missing reference property
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  customerId: string;
  attendantId: string;
  paymentSplits: PaymentSplit[];
  status: 'completed' | 'pending' | 'cancelled' | 'refunded' | 'voided'; // Added 'voided' status
  notes?: string;
}

export interface WorkSchedule {
  startTime: string;
  endTime: string;
  workDays: string[];
  enforceSchedule: boolean;
}

export interface Attendant {
  id: string;
  name: string;
  email?: string;
  phone?: string; // Added missing phone property
  role: 'admin' | 'cashier' | 'manager' | 'staff'; // Added 'staff' role
  isActive: boolean;
  isDemoMode?: boolean;
  permissions: string[]; // Added missing permissions property
  workSchedule?: WorkSchedule; // Added missing workSchedule property
  createdAt: Date;
  pin?: string;
}

export interface Store {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxNumber?: string;
  currency: string;
  timezone: string;
  createdAt: Date;
}

// Additional missing types
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  attendantId: string;
  receiptUrl?: string;
  notes?: string;
}

export interface HirePurchase {
  id: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  downPayment: number;
  remainingBalance: number;
  installmentAmount: number;
  installmentPeriod: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'defaulted';
  payments: HirePurchasePayment[];
}

export interface HirePurchasePayment {
  id: string;
  amount: number;
  date: Date;
  method: 'cash' | 'mpesa' | 'card';
}

export interface HeldTransaction {
  id: string;
  items: CartItem[];
  customerId?: string;
  total: number;
  timestamp: Date;
  attendantId: string;
  reason?: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone?: string;
  managerId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  supplierId: string;
  items: PurchaseItem[];
  total: number;
  date: Date;
  status: 'pending' | 'received' | 'cancelled';
  invoiceNumber?: string;
  notes?: string;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  unitCost: number;
  total: number;
}
