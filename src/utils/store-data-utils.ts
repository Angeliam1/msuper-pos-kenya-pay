
import { StoreLocation } from '@/types';
import { StoreData } from '@/types/store-context';

export const createDefaultStoreData = (storeName: string): StoreData => ({
  products: [],
  customers: [{
    id: 'walk-in',
    name: 'Walk-in Customer',
    email: '',
    phone: '',
    address: '',
    loyaltyPoints: 0,
    creditLimit: 0,
    outstandingBalance: 0,
    createdAt: new Date()
  }],
  transactions: [],
  attendants: [],
  suppliers: [],
  cashBalance: 0,
  storeSettings: {
    currency: 'KES',
    taxRate: 16,
    lowStockThreshold: 10,
    enableLoyaltyProgram: true,
    loyaltyPointsPerShilling: 0.01,
    autoBackup: true,
    showProductImages: true,
    enableBarcode: true,
    requireCustomerInfo: false,
    allowNegativeStock: false,
    defaultPaymentMethod: 'cash',
    theme: 'light',
    fontSize: 'medium'
  },
  printerSettings: {
    printerEnabled: false,
    printerConnectionType: 'bluetooth',
    bluetoothPrinterName: '',
    bluetoothPrinterAddress: '',
    ethernetPrinterIP: '',
    ethernetPrinterPort: '9100',
    usbPrinterName: '',
    printCopies: 1,
    printTimeout: 30,
    autoPrint: false
  },
  smsSettings: {
    smsEnabled: false,
    smsProvider: 'phone',
    businessPhone: '',
    businessName: storeName,
    hirePurchaseTemplate: 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}',
    paymentReminderTemplate: 'Hi {customerName}, your payment of KES {amount} is pending at {businessName} ({businessPhone}) and is {daysLate} days late. Pay now: {paymentLink}',
    paymentConfirmTemplate: 'Hi {customerName}, payment received! Amount: KES {amount}. New balance: KES {balance}. Thank you! - {businessName}'
  }
});

export const createMockStores = (tenantId: string, tenantName: string): StoreLocation[] => [
  {
    id: `store-${tenantId}-1`,
    name: `${tenantName} - Main Branch`,
    address: '123 Main Street, Nairobi',
    phone: '+254 700 000 001',
    managerId: 'manager-1',
    status: 'active',
    isActive: true,
    createdAt: new Date(),
    receiptSettings: {
      showLogo: true,
      logoUrl: '',
      businessName: `${tenantName} - Main Branch`,
      businessAddress: '123 Main Street, Nairobi',
      businessPhone: '+254 700 000 001',
      footerMessage: 'Thank you for shopping with us!',
      showQr: false,
      qrType: 'website',
      size: '80mm',
      showAddress: true,
      showPhone: true,
      header: 'Thank you for shopping with us!',
      footer: 'Visit us again soon!',
      autoprint: false
    },
    pricingSettings: {
      allowNegativePricing: false,
      roundPrices: true,
      defaultMarkup: 20,
      bulkPricingEnabled: false,
      allowPriceBelowWholesale: false,
      defaultPriceType: 'retail',
      taxRate: 16
    }
  }
];

export const createStoreDefaults = (store: Omit<StoreLocation, 'id'>, tenantId: string): StoreLocation => ({
  ...store,
  id: `store-${tenantId}-${Date.now()}`,
  receiptSettings: {
    showLogo: true,
    logoUrl: '',
    businessName: store.name,
    businessAddress: store.address,
    businessPhone: store.phone || '',
    footerMessage: 'Thank you for shopping with us!',
    showQr: false,
    qrType: 'website',
    size: '80mm',
    showAddress: true,
    showPhone: true,
    header: 'Thank you for shopping with us!',
    footer: 'Visit us again soon!',
    autoprint: false
  },
  pricingSettings: {
    allowNegativePricing: false,
    roundPrices: true,
    defaultMarkup: 20,
    bulkPricingEnabled: false,
    allowPriceBelowWholesale: false,
    defaultPriceType: 'retail',
    taxRate: 16
  }
});
