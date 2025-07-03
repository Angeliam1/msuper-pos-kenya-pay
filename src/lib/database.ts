import { Product, Customer, CartItem, Transaction, Staff, LoyaltyProgram, Store, Supplier, PurchaseOrder, Expense, StockMovement, Settings } from '@/types';

// Mock data for products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    category: 'Electronics',
    price: 180000,
    stock: 15,
    barcode: '123456789012',
    description: 'Latest iPhone with advanced camera system',
    lowStockThreshold: 5,
    supplier: 'Apple Kenya',
    cost: 150000,
    images: []
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    price: 165000,
    stock: 20,
    barcode: '234567890123',
    description: 'Premium Android smartphone with S Pen',
    lowStockThreshold: 5,
    supplier: 'Samsung Electronics',
    cost: 140000,
    images: []
  },
  {
    id: '3',
    name: 'MacBook Pro 14" M3',
    category: 'Computers',
    price: 280000,
    stock: 8,
    barcode: '345678901234',
    description: 'Professional laptop with M3 chip',
    lowStockThreshold: 3,
    supplier: 'Apple Kenya',
    cost: 240000,
    images: []
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 45000,
    stock: 25,
    barcode: '456789012345',
    description: 'Premium noise-cancelling headphones',
    lowStockThreshold: 10,
    supplier: 'Sony Kenya',
    cost: 35000,
    images: []
  },
  {
    id: '5',
    name: 'iPad Air 5th Gen',
    category: 'Electronics',
    price: 85000,
    stock: 12,
    barcode: '567890123456',
    description: 'Versatile tablet for work and play',
    lowStockThreshold: 5,
    supplier: 'Apple Kenya',
    cost: 70000,
    images: []
  },
  {
    id: '6',
    name: 'Dell XPS 13',
    category: 'Computers',
    price: 155000,
    stock: 10,
    barcode: '678901234567',
    description: 'Ultra-portable laptop for professionals',
    lowStockThreshold: 5,
    supplier: 'Dell Kenya',
    cost: 130000,
    images: []
  },
  {
    id: '7',
    name: 'Apple Watch Series 9',
    category: 'Wearables',
    price: 55000,
    stock: 18,
    barcode: '789012345678',
    description: 'Advanced smartwatch with health monitoring',
    lowStockThreshold: 8,
    supplier: 'Apple Kenya',
    cost: 45000,
    images: []
  },
  {
    id: '8',
    name: 'Canon EOS R6 Mark II',
    category: 'Cameras',
    price: 350000,
    stock: 5,
    barcode: '890123456789',
    description: 'Professional mirrorless camera',
    lowStockThreshold: 2,
    supplier: 'Canon Kenya',
    cost: 300000,
    images: []
  },
  {
    id: '9',
    name: 'PlayStation 5',
    category: 'Gaming',
    price: 75000,
    stock: 7,
    barcode: '901234567890',
    description: 'Next-gen gaming console',
    lowStockThreshold: 3,
    supplier: 'Sony Kenya',
    cost: 65000,
    images: []
  },
  {
    id: '10',
    name: 'AirPods Pro 2nd Gen',
    category: 'Audio',
    price: 32000,
    stock: 30,
    barcode: '012345678901',
    description: 'Premium wireless earbuds with ANC',
    lowStockThreshold: 15,
    supplier: 'Apple Kenya',
    cost: 25000,
    images: []
  }
];

// Mock data for customers
export const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+254700000000',
    address: 'Nairobi, Kenya',
    loyaltyPoints: 150,
    orders: [],
    notes: 'Regular customer'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+254711111111',
    address: 'Mombasa, Kenya',
    loyaltyPoints: 200,
    orders: [],
    notes: 'VIP customer'
  }
];

// Mock data for transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date(),
    customer: mockCustomers[0],
    items: [
      {
        product: mockProducts[0],
        quantity: 1,
        price: mockProducts[0].price
      }
    ],
    totalAmount: mockProducts[0].price,
    paymentMethod: 'cash',
    staff: {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '+254722222222',
      role: 'admin',
      permissions: []
    },
    notes: 'First transaction'
  }
];

// Mock data for staff
export const mockStaff: Staff[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phone: '+254722222222',
    role: 'admin',
    permissions: []
  },
  {
    id: '2',
    firstName: 'Sales',
    lastName: 'Person',
    email: 'sales@example.com',
    phone: '+254733333333',
    role: 'sales',
    permissions: []
  }
];

// Mock data for loyalty programs
export const mockLoyaltyPrograms: LoyaltyProgram[] = [
  {
    id: '1',
    name: 'Gold',
    pointsPerShilling: 0.01,
    discountPercentage: 5,
    minimumPoints: 100
  }
];

// Mock data for stores
export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Nairobi Store',
    address: 'Nairobi, Kenya',
    phone: '+254744444444',
    email: 'nairobi@example.com'
  }
];

// Mock data for suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Apple Kenya',
    contactPerson: 'John Apple',
    phone: '+254755555555',
    email: 'apple@example.com',
    address: 'Nairobi, Kenya'
  }
];

// Mock data for purchase orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    date: new Date(),
    supplier: mockSuppliers[0],
    items: [
      {
        product: mockProducts[0],
        quantity: 10,
        cost: mockProducts[0].cost || 0
      }
    ],
    totalCost: (mockProducts[0].cost || 0) * 10,
    status: 'pending'
  }
];

// Mock data for expenses
export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: new Date(),
    category: 'Rent',
    amount: 50000,
    description: 'Monthly rent for Nairobi store'
  }
];

// Mock data for stock movements
export const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    date: new Date(),
    product: mockProducts[0],
    quantity: 5,
    type: 'addition',
    reason: 'Restock'
  }
];

let products = [...mockProducts];
let customers: Customer[] = [];
let transactions: Transaction[] = [];
let staff: Staff[] = [];
let loyaltyPrograms: LoyaltyProgram[] = [];
let stores: Store[] = [];
let suppliers: Supplier[] = [];
let purchaseOrders: PurchaseOrder[] = [];
let expenses: Expense[] = [];
let stockMovements: StockMovement[] = [];
let settings: Settings = {
  storeName: 'DIGITAL DEN',
  storeAddress: '123 Electronics Street, Nairobi',
  storePhone: '+254 700 000 000',
  storeEmail: 'info@digitalden.co.ke',
  currency: 'KES',
  taxRate: 16,
  receiptFooter: 'Thank you for shopping with Digital Den!',
  lowStockThreshold: 10,
  enableLoyaltyProgram: true,
  loyaltyPointsPerShilling: 0.01,
  autoBackup: true,
  printerName: 'Default Printer',
  receiptWidth: 80,
  showProductImages: true,
  enableBarcode: true,
  requireCustomerInfo: false,
  allowNegativeStock: false,
  enableMultiStore: false,
  defaultPaymentMethod: 'cash',
  enableSMS: false,
  smsApiKey: '',
  smsUsername: '',
  enableEmailReceipts: false,
  smtpHost: '',
  smtpPort: 587,
  smtpUsername: '',
  smtpPassword: '',
  theme: 'light',
  language: 'en',
  timezone: 'Africa/Nairobi',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  enableAdvancedReports: true,
  exportFormat: 'pdf',
  backupFrequency: 'daily',
  enableAuditLog: true,
  maxLoginAttempts: 5,
  sessionTimeout: 30,
  enableTwoFactor: false,
  allowGuestCheckout: true,
  enableProductBundles: false,
  enableSubscriptions: false,
  enableDropshipping: false,
  enablePreorders: false,
  enableWishlist: true,
  enableProductReviews: false,
  enableCoupons: false,
  enableGiftCards: false,
  enableAffiliates: false,
  enableAnalytics: true,
  googleAnalyticsId: '',
  facebookPixelId: '',
  enableSEO: true,
  metaTitle: 'Digital Den - Your Electronics Hub',
  metaDescription: 'Shop the latest electronics at Digital Den Kenya',
  enableSitemap: true,
  enableRobotsTxt: true,
  enableCompression: true,
  enableCaching: true,
  enableCDN: false,
  cdnUrl: '',
  enableSSL: true,
  enableHSTS: true,
  enableCSP: false,
  cspPolicy: '',
  enableCORS: false,
  corsOrigins: '',
  enableRateLimit: true,
  rateLimitRequests: 100,
  rateLimitWindow: 15,
  enableFirewall: false,
  firewallRules: '',
  enableMonitoring: false,
  monitoringUrl: '',
  enableLogging: true,
  logLevel: 'info',
  logRetention: 30,
  enableAlerts: true,
  alertEmail: 'admin@digitalden.co.ke',
  alertThreshold: 90,
  enableBackup: true,
  backupProvider: 'local',
  backupRetention: 7,
  enableReplication: false,
  replicationNodes: '',
  enableCluster: false,
  clusterNodes: '',
  enableLoadBalancer: false,
  loadBalancerUrl: '',
  enableAutoScale: false,
  autoScaleMin: 1,
  autoScaleMax: 10,
  enableContainer: false,
  containerImage: '',
  enableOrchestration: false,
  orchestrationPlatform: 'kubernetes',
  enableCI: false,
  ciProvider: 'github',
  enableCD: false,
  cdProvider: 'github',
  enableTesting: false,
  testFramework: 'jest',
  enableQA: false,
  qaEnvironment: 'staging',
  enableSecurity: false,
  securityScanner: 'snyk',
  enableCompliance: false,
  complianceFramework: 'iso27001',
  enableGovernance: false,
  governanceFramework: 'cobit',
  enableRisk: false,
  riskFramework: 'nist',
  enableAudit: false,
  auditFramework: 'sox',
  enablePrivacy: false,
  privacyFramework: 'gdpr',
  enableConsent: false,
  consentFramework: 'ccpa',
  enableDataProtection: false,
  dataProtectionFramework: 'pipeda',
  enableEncryption: false,
  encryptionAlgorithm: 'aes256',
  enableHashing: false,
  hashingAlgorithm: 'sha256',
  enableSigning: false,
  signingAlgorithm: 'rsa2048',
  enableTokens: false,
  tokenProvider: 'jwt',
  enableOAuth: false,
  oauthProvider: 'google',
  enableSAML: false,
  samlProvider: 'okta',
  enableLDAP: false,
  ldapProvider: 'activedirectory',
  enableSSO: false,
  ssoProvider: 'azure',
  enableMFA: false,
  mfaProvider: 'authy',
  enableBiometric: false,
  biometricProvider: 'fingerprint',
  enableBehavioral: false,
  behavioralProvider: 'biocatch',
  enableFraud: false,
  fraudProvider: 'kount',
  enableAML: false,
  amlProvider: 'chainalysis',
  enableKYC: false,
  kycProvider: 'jumio',
  enableIDV: false,
  idvProvider: 'onfido',
  enableScreening: false,
  screeningProvider: 'worldcheck',
  enableSanctions: false,
  sanctionsProvider: 'ofac',
  enablePEP: false,
  pepProvider: 'dow',
  enableAdverseMedia: false,
  adverseMediaProvider: 'lexisnexis',
  enableRiskScoring: false,
  riskScoringProvider: 'fico',
  enableDecisionEngine: false,
  decisionEngineProvider: 'fico',
  enableRuleEngine: false,
  ruleEngineProvider: 'drools',
  enableWorkflow: false,
  workflowProvider: 'activiti',
  enableBPM: false,
  bpmProvider: 'camunda',
  enableEAI: false,
  eaiProvider: 'mulesoft',
  enableESB: false,
  esbProvider: 'wso2',
  enableSOA: false,
  soaProvider: 'oracle',
  enableMicroservices: false,
  microservicesProvider: 'kubernetes',
  enableServerless: false,
  serverlessProvider: 'aws',
  enableEdge: false,
  edgeProvider: 'cloudflare',
  enableFog: false,
  fogProvider: 'cisco',
  enableIoT: false,
  iotProvider: 'aws',
  enableBlockchain: false,
  blockchainProvider: 'ethereum',
  enableAI: false,
  aiProvider: 'openai',
  enableML: false,
  mlProvider: 'tensorflow',
  enableDL: false,
  dlProvider: 'pytorch',
  enableNLP: false,
  nlpProvider: 'spacy',
  enableCV: false,
  cvProvider: 'opencv',
  enableAR: false,
  arProvider: 'arkit',
  enableVR: false,
  vrProvider: 'oculus',
  enableMR: false,
  mrProvider: 'hololens',
  enableXR: false,
  xrProvider: 'unity',
  enable3D: false,
  threeDProvider: 'threejs',
  enableWebGL: false,
  webglProvider: 'threejs',
  enableWebXR: false,
  webxrProvider: 'aframe',
  enableWebAssembly: false,
  webassemblyProvider: 'emscripten',
  enableWebWorkers: false,
  webworkersProvider: 'comlink',
  enableServiceWorkers: false,
  serviceworkersProvider: 'workbox',
  enablePWA: false,
  pwaProvider: 'workbox',
  enableAMP: false,
  ampProvider: 'google',
  enableWebComponents: false,
  webcomponentsProvider: 'lit',
  enableMicrofrontends: false,
  microfrontendsProvider: 'singlesp
