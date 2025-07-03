
export interface Product {
  id: string;
  name: string;
  buyingCost: number;
  wholesalePrice: number;
  retailPrice: number;
  price: number; // This will be the selling price (retail by default)
  category: string;
  stock: number;
  unit: 'pcs' | 'kg' | 'bundle' | 'litre' | 'meter' | 'box';
  image?: string;
  supplierId?: string;
  barcode?: string;
  lowStockThreshold?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit: number;
  outstandingBalance: number;
  loyaltyPoints: number;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  products: string[];
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  mpesaDetails?: {
    phoneNumber: string;
    businessNumber?: string;
  };
  createdAt: Date;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  attendantId: string;
}

export interface Purchase {
  id: string;
  supplierId: string;
  items: PurchaseItem[];
  totalCost: number;
  date: Date;
  attendantId: string;
  receiptImage?: string;
  invoiceNumber?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
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
  role: 'admin' | 'manager' | 'cashier';
  permissions: string[];
  isActive: boolean;
  assignedStoreId?: string;
  pin?: string;
  createdAt: Date;
  workSchedule?: WorkSchedule;
}

export interface PaymentSplit {
  method: 'mpesa' | 'cash' | 'credit';
  amount: number;
  reference?: string;
}

export interface HirePurchase {
  id: string;
  customerId: string;
  totalAmount: number;
  downPayment: number;
  remainingAmount: number;
  installmentAmount: number;
  installmentPeriod: 'weekly' | 'monthly';
  nextPaymentDate: Date;
  status: 'active' | 'completed' | 'defaulted';
}

export interface HeldTransaction {
  id: string;
  items: CartItem[];
  customerId?: string;
  customerName?: string;
  heldAt: Date;
  heldBy: string;
  note?: string;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  paymentSplits: PaymentSplit[];
  customerId?: string;
  attendantId: string;
  timestamp: Date;
  hirePurchaseId?: string;
  status: 'completed' | 'voided' | 'refunded';
  voidedAt?: Date;
  refundedAt?: Date;
  voidReason?: string;
  refundReason?: string;
}

export interface LowStockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  createdAt: Date;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
  totalSales: number;
  isEditable: boolean;
}

export interface AppTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}
