
// Input validation and sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:text\/html/gi, '') // Remove data URLs
    .trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(phone) && cleanPhone.length >= 7 && cleanPhone.length <= 15;
};

export const validatePrice = (price: number): boolean => {
  return !isNaN(price) && price >= 0 && price <= 1000000 && Number.isFinite(price);
};

export const validateQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity >= 0 && quantity <= 100000;
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-'\.]{1,100}$/;
  return nameRegex.test(sanitizeInput(name));
};

export const validateBarcode = (barcode: string): boolean => {
  if (!barcode) return true; // Optional field
  const barcodeRegex = /^[0-9]{8,14}$/;
  return barcodeRegex.test(barcode);
};

// Rate limiting for API calls
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxAttempts: number;

  constructor(windowMs: number = 60000, maxAttempts: number = 30) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const apiRateLimiter = new RateLimiter(60000, 30); // 30 requests per minute
export const loginRateLimiter = new RateLimiter(300000, 5); // 5 login attempts per 5 minutes

// Session security
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const isSecureContext = (): boolean => {
  return window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
};

// Data validation schemas
export const productValidationSchema = {
  name: (value: string) => validateName(value) && value.length >= 1 && value.length <= 100,
  buyingCost: validatePrice,
  wholesalePrice: validatePrice,
  retailPrice: validatePrice,
  category: (value: string) => validateName(value) && value.length >= 1,
  stock: validateQuantity,
  barcode: validateBarcode,
  lowStockThreshold: (value: number) => validateQuantity(value) && value >= 0 && value <= 1000
};

export const customerValidationSchema = {
  name: (value: string) => validateName(value) && value.length >= 1 && value.length <= 100,
  phone: validatePhone,
  email: (value: string) => !value || validateEmail(value),
  creditLimit: validatePrice,
  address: (value: string) => !value || (sanitizeInput(value).length <= 200)
};

export const validateProduct = (product: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!productValidationSchema.name(product.name)) {
    errors.push('Product name is invalid or too long');
  }
  if (!productValidationSchema.buyingCost(product.buyingCost)) {
    errors.push('Buying cost must be a valid positive number');
  }
  if (!productValidationSchema.wholesalePrice(product.wholesalePrice)) {
    errors.push('Wholesale price must be a valid positive number');
  }
  if (!productValidationSchema.retailPrice(product.retailPrice)) {
    errors.push('Retail price must be a valid positive number');
  }
  if (product.buyingCost > product.wholesalePrice) {
    errors.push('Wholesale price must be greater than or equal to buying cost');
  }
  if (product.wholesalePrice > product.retailPrice) {
    errors.push('Retail price must be greater than or equal to wholesale price');
  }
  if (!productValidationSchema.stock(product.stock)) {
    errors.push('Stock must be a valid non-negative integer');
  }
  if (product.barcode && !productValidationSchema.barcode(product.barcode)) {
    errors.push('Barcode must be 8-14 digits');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validateCustomer = (customer: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!customerValidationSchema.name(customer.name)) {
    errors.push('Customer name is invalid or too long');
  }
  if (!customerValidationSchema.phone(customer.phone)) {
    errors.push('Phone number is invalid');
  }
  if (customer.email && !customerValidationSchema.email(customer.email)) {
    errors.push('Email address is invalid');
  }
  if (!customerValidationSchema.creditLimit(customer.creditLimit || 0)) {
    errors.push('Credit limit must be a valid positive number');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Secure local storage wrapper
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const sanitizedKey = sanitizeInput(key);
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(sanitizedKey, jsonValue);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  getItem: <T = any>(key: string): T | null => {
    try {
      const sanitizedKey = sanitizeInput(key);
      const item = localStorage.getItem(sanitizedKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to retrieve from localStorage:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};
