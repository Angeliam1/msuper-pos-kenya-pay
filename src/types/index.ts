
// Core business types
export interface Product {
  id: string;
  name: string;
  buyingCost: number;
  wholesalePrice?: number;
  retailPrice: number;
  price: number;
  category: string;
  stock: number;
  unit: string;
  barcode?: string;
  lowStockThreshold: number;
  description?: string;
  image?: string;
  supplierId?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  totalPurchases?: number;
  lastPurchaseDate?: Date;
  createdAt: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PaymentSplit {
  method: 'cash' | 'mpesa' | 'credit' | 'bank';
  amount: number;
  reference?: string;
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
  voidReason?: string;
  refundedAt?: Date;
  refundReason?: string;
  receiptNumber?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  paymentTerms?: string;
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
  pin: string;
  workSchedule?: WorkSchedule;
  assignedStoreId?: string;
  createdAt: Date;
}

export interface HirePurchase {
  id: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  downPayment: number;
  remainingBalance: number;
  installmentAmount: number;
  installmentPeriod: 'daily' | 'weekly' | 'monthly';
  nextPaymentDate: Date;
  createdAt: Date;
  completedAt?: Date;
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

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  attendantId: string;
  date: Date;
  receiptNumber?: string;
  notes?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  items: PurchaseItem[];
  totalAmount: number;
  attendantId: string;
  purchaseDate: Date;
  receivedDate?: Date;
  status: 'pending' | 'received' | 'cancelled';
  invoiceNumber?: string;
  notes?: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: Date;
}

// UI and component types
export interface User {
  id: string;
  storeName: string;
  adminEmail: string;
  password: string;
  pin: string;
  phone: string;
  currency: string;
  theme: string;
  createdAt: Date;
}

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  paybill: string;
  showStoreName: boolean;
  showStoreAddress: boolean;
  showStorePhone: boolean;
  showCustomerName: boolean;
  showCustomerPhone: boolean;
  showCustomerAddress: boolean;
  showNotes: boolean;
  receiptHeader: string;
  receiptFooter: string;
  showBarcode: boolean;
  showQRCode: boolean;
  autoPrintReceipt: boolean;
  receiptCodeType: 'qr' | 'barcode';
  smsEnabled: boolean;
  smsProvider: 'phone' | 'whatsapp' | 'api';
  businessName: string;
  businessPhone: string;
  hirePurchaseTemplate: string;
  mpesaPaybill?: string;
  mpesaAccount?: string;
  mpesaTill?: string;
  bankAccount?: string;
}
