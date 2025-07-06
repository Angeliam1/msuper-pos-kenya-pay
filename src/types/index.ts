
export interface Product {
  id: string;
  name: string;
  category: string;
  buyingCost: number;
  retailPrice: number;
  wholesalePrice?: number;
  stock: number;
  minStock: number;
  maxStock?: number;
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
  method: 'cash' | 'mpesa' | 'card' | 'credit';
  amount: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  customerId: string;
  attendantId: string;
  paymentSplits: PaymentSplit[];
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  notes?: string;
}

export interface Attendant {
  id: string;
  name: string;
  email?: string;
  role: 'admin' | 'cashier' | 'manager';
  isActive: boolean;
  isDemoMode?: boolean;
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
