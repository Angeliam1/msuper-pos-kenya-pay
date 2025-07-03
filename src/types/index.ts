
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
  unit?: string;
  lowStockThreshold?: number;
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
  address?: string;
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
  status: 'completed' | 'pending' | 'refunded' | 'voided';
}

export interface PaymentSplit {
  method: 'cash' | 'mpesa' | 'card' | 'credit' | 'bank';
  amount: number;
  reference?: string;
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
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff' | 'cashier';
  permissions: string[];
  isActive: boolean;
  pin: string;
  workSchedule?: WorkSchedule;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  products?: any[];
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  mpesaDetails?: {
    phoneNumber: string;
    businessNumber: string;
  };
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

export interface HirePurchase {
  id?: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  downPayment: number;
  remainingBalance: number;
  installmentAmount: number;
  installmentPeriod: 'weekly' | 'monthly';
  nextPaymentDate: Date;
  status: 'active' | 'completed' | 'defaulted';
  createdAt: Date;
}

export interface HeldTransaction {
  id: string;
  items: CartItem[];
  customerId?: string;
  customerName?: string;
  note?: string;
  heldAt: Date;
  heldBy: string;
}

export interface Purchase {
  id: string;
  supplierId: string;
  items: PurchaseItem[];
  total: number;
  date: Date;
  status: 'pending' | 'received' | 'partial';
  createdAt: Date;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  unitCost: number;
  total: number;
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
