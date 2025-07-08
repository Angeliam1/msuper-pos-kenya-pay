
import { StoreLocation, Product, Customer, Transaction, Attendant } from '@/types';

export interface StoreData {
  products: Product[];
  customers: Customer[];
  transactions: Transaction[];
  attendants: Attendant[];
  suppliers: any[];
  cashBalance: number;
  storeSettings: StoreSettings;
  printerSettings: PrinterSettings;
  smsSettings: SMSSettings;
}

export interface StoreSettings {
  currency: string;
  taxRate: number;
  lowStockThreshold: number;
  enableLoyaltyProgram: boolean;
  loyaltyPointsPerShilling: number;
  autoBackup: boolean;
  showProductImages: boolean;
  enableBarcode: boolean;
  requireCustomerInfo: boolean;
  allowNegativeStock: boolean;
  defaultPaymentMethod: string;
  theme: string;
  fontSize: string;
}

export interface PrinterSettings {
  printerEnabled: boolean;
  printerConnectionType: string;
  bluetoothPrinterName: string;
  bluetoothPrinterAddress: string;
  ethernetPrinterIP: string;
  ethernetPrinterPort: string;
  usbPrinterName: string;
  printCopies: number;
  printTimeout: number;
  autoPrint: boolean;
}

export interface SMSSettings {
  smsEnabled: boolean;
  smsProvider: string;
  businessPhone: string;
  businessName: string;
  hirePurchaseTemplate: string;
  paymentReminderTemplate: string;
  paymentConfirmTemplate: string;
}

export interface StoreContextType {
  currentStore: StoreLocation | null;
  setCurrentStore: (store: StoreLocation) => void;
  stores: StoreLocation[];
  addStore: (store: Omit<StoreLocation, 'id'>) => void;
  updateStore: (id: string, updates: Partial<StoreLocation>) => void;
  switchStore: (storeId: string) => void;
  getStoreProducts: (storeId: string) => Product[];
  updateStoreProduct: (storeId: string, productId: string, updates: Partial<Product>) => void;
  addProductToStore: (storeId: string, product: Omit<Product, 'id'>) => void;
  deleteStoreProduct: (storeId: string, productId: string) => void;
  getStoreCustomers: (storeId: string) => Customer[];
  addCustomerToStore: (storeId: string, customer: Omit<Customer, 'id'>) => void;
  updateStoreCustomer: (storeId: string, customerId: string, updates: Partial<Customer>) => void;
  getStoreTransactions: (storeId: string) => Transaction[];
  addTransactionToStore: (storeId: string, transaction: Transaction) => void;
  getStoreAttendants: (storeId: string) => Attendant[];
  addAttendantToStore: (storeId: string, attendant: Omit<Attendant, 'id'>) => void;
  getStoreCashBalance: (storeId: string) => number;
  updateStoreCashBalance: (storeId: string, amount: number, type: 'add' | 'subtract') => void;
  getStoreSettings: (storeId: string) => any;
  updateStoreSettings: (storeId: string, settings: any) => void;
  getStoreSuppliers: (storeId: string) => any[];
  addSupplierToStore: (storeId: string, supplier: any) => void;
  updateStoreSupplier: (storeId: string, supplierId: string, updates: any) => void;
  deleteStoreSupplier: (storeId: string, supplierId: string) => void;
}
