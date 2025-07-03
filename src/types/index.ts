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
  image?: string;
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
  totalAmount: number;
  purchaseDate: Date;
  status: 'pending' | 'received' | 'partial' | 'cancelled';
  attendantId: string;
  invoiceNumber?: string;
  notes?: string;
  createdAt: Date;
}

export interface PurchaseItem {
  productId: string;
  productName?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface ReceiptSettings {
  size: '58mm' | '80mm';
  showLogo: boolean;
  showAddress: boolean;
  showPhone: boolean;
  header: string;
  footer: string;
  autoprint?: boolean;
}

export interface PricingSettings {
  allowPriceBelowWholesale: boolean;
  defaultPriceType: 'retail' | 'wholesale';
  taxRate: number;
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
  pricingSettings?: PricingSettings;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  pointsPerShilling: number;
  minimumSpend: number;
  isActive: boolean;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: any[];
  status: string;
  createdAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: Date;
}

export interface Settings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  currency: string;
  taxRate: number;
  receiptFooter: string;
  lowStockThreshold: number;
  enableLoyaltyProgram: boolean;
  loyaltyPointsPerShilling: number;
  autoBackup: boolean;
  printerName: string;
  receiptWidth: number;
  showProductImages: boolean;
  enableBarcode: boolean;
  requireCustomerInfo: boolean;
  allowNegativeStock: boolean;
  enableMultiStore: boolean;
  defaultPaymentMethod: string;
  enableSMS: boolean;
  smsApiKey: string;
  smsUsername: string;
  enableEmailReceipts: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  enableAdvancedReports: boolean;
  exportFormat: string;
  backupFrequency: string;
  enableAuditLog: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  enableTwoFactor: boolean;
  allowGuestCheckout: boolean;
  enableProductBundles: boolean;
  enableSubscriptions: boolean;
  enableDropshipping: boolean;
  enablePreorders: boolean;
  enableWishlist: boolean;
  enableProductReviews: boolean;
  enableCoupons: boolean;
  enableGiftCards: boolean;
  enableAffiliates: boolean;
  enableAnalytics: boolean;
  googleAnalyticsId: string;
  facebookPixelId: string;
  enableSEO: boolean;
  metaTitle: string;
  metaDescription: string;
  enableSitemap: boolean;
  enableRobotsTxt: boolean;
  enableCompression: boolean;
  enableCaching: boolean;
  enableCDN: boolean;
  cdnUrl: string;
  enableSSL: boolean;
  enableHSTS: boolean;
  enableCSP: boolean;
  cspPolicy: string;
  enableCORS: boolean;
  corsOrigins: string;
  enableRateLimit: boolean;
  rateLimitRequests: number;
  rateLimitWindow: number;
  enableFirewall: boolean;
  firewallRules: string;
  enableMonitoring: boolean;
  monitoringUrl: string;
  enableLogging: boolean;
  logLevel: string;
  logRetention: number;
  enableAlerts: boolean;
  alertEmail: string;
  alertThreshold: number;
  enableBackup: boolean;
  backupProvider: string;
  backupRetention: number;
  enableReplication: boolean;
  replicationNodes: string;
  enableCluster: boolean;
  clusterNodes: string;
  enableLoadBalancer: boolean;
  loadBalancerUrl: string;
  enableAutoScale: boolean;
  autoScaleMin: number;
  autoScaleMax: number;
  enableContainer: boolean;
  containerImage: string;
  enableOrchestration: boolean;
  orchestrationPlatform: string;
}
