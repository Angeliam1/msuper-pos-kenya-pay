
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  supplierId?: string;
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
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  products: string[];
  createdAt: Date;
}

export interface Attendant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'cashier';
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
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
}
