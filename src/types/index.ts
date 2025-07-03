export interface Product {
  id: string;
  name: string;
  category: string;
  buyingCost: number;
  wholesalePrice?: number;
  retailPrice: number;
  price: number;
  stock: number;
  supplierId: string;
  barcode?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
  creditLimit: number;
  outstandingBalance: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  customerId: string;
  attendantId: string;
  paymentSplits: PaymentSplit[];
  status: 'completed' | 'pending' | 'refunded';
}

export interface PaymentSplit {
  method: 'cash' | 'mpesa' | 'card' | 'credit';
  amount: number;
}

export interface Attendant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
  isActive: boolean;
  pin: string;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  date: Date;
  amount: number;
  description: string;
  attendantId: string;
  category: string;
  createdAt: Date;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  managerId: string;
  manager: string;
  status: 'active' | 'inactive';
  totalSales: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ReceiptSettings {
  size: '58mm' | '80mm' | 'A4';
  showLogo: boolean;
  showAddress: boolean;
  showPhone: boolean;
  header: string;
  footer: string;
  autoprint?: boolean;
  copies?: number;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  managerId: string;
  manager: string;
  status: 'active' | 'inactive';
  totalSales: number;
  isActive: boolean;
  createdAt: Date;
  receiptSettings?: ReceiptSettings;
}
