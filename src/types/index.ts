
export interface Product {
  id: string;
  name: string;
  category: string;
  buyingCost: number;
  retailPrice: number;
  price: number;
  wholesalePrice?: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  lowStockThreshold?: number;
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
  method: 'cash' | 'mpesa' | 'card' | 'credit' | 'bank';
  amount: number;
  reference?: string;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  customerId: string;
  attendantId: string;
  paymentSplits: PaymentSplit[];
  status: 'completed' | 'pending' | 'cancelled' | 'refunded' | 'voided';
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
  phone?: string;
  role: 'admin' | 'cashier' | 'manager' | 'staff';
  isActive: boolean;
  isDemoMode?: boolean;
  permissions: string[];
  workSchedule?: WorkSchedule;
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

export interface HirePurchasePayment {
  id: string;
  amount: number;
  date: Date;
  method: 'cash' | 'mpesa' | 'card';
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

export interface HeldTransaction {
  id: string;
  items: CartItem[];
  customerId?: string;
  customerName?: string;
  total: number;
  timestamp: Date;
  heldAt?: Date;
  attendantId: string;
  heldBy?: string;
  reason?: string;
  note?: string;
}

export interface ReceiptSettings {
  showLogo: boolean;
  logoUrl?: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  footerMessage: string;
  showQr: boolean;
  qrType: 'payment' | 'website' | 'custom';
  qrValue?: string;
}

export interface PricingSettings {
  allowNegativePricing: boolean;
  roundPrices: boolean;
  defaultMarkup: number;
  bulkPricingEnabled: boolean;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone?: string;
  managerId: string;
  isActive: boolean;
  status?: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  receiptSettings?: ReceiptSettings;
  pricingSettings?: PricingSettings;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  unitCost: number;
  total: number;
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

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  paymentTerms?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Online store types
export interface OnlineProduct extends Product {
  features: string[];
  originalPrice: number;
  salesPrice: number;
  inStock: boolean;
  tags: string[];
  isOnline: boolean;
}
