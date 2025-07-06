// Enhanced input validation and sanitization utilities

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:text\/html/gi, '') // Remove data URLs
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254 && email.length >= 5;
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
  const sanitized = sanitizeInput(name);
  return nameRegex.test(sanitized) && sanitized.length >= 1;
};

export const validateBarcode = (barcode: string): boolean => {
  if (!barcode) return true; // Optional field
  const barcodeRegex = /^[0-9]{8,14}$/;
  return barcodeRegex.test(barcode);
};

export const validateStrongPassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more secure password');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Enhanced rate limiting with memory cleanup
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxAttempts: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(windowMs: number = 60000, maxAttempts: number = 30) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
    
    // Clean up old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 300000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, attempts] of this.attempts.entries()) {
      const validAttempts = attempts.filter(time => now - time < this.windowMs);
      if (validAttempts.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, validAttempts);
      }
    }
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

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.attempts.clear();
  }
}

export const apiRateLimiter = new RateLimiter(60000, 30); // 30 requests per minute
export const loginRateLimiter = new RateLimiter(300000, 5); // 5 login attempts per 5 minutes
export const strictRateLimiter = new RateLimiter(3600000, 3); // 3 attempts per hour for sensitive operations

// Session security
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const isSecureContext = (): boolean => {
  return window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
};

// Enhanced data validation schemas
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

export const attendantValidationSchema = {
  name: (value: string) => validateName(value) && value.length >= 2 && value.length <= 50,
  email: (value: string) => !value || validateEmail(value),
  phone: (value: string) => !value || validatePhone(value),
  password: (value: string) => validateStrongPassword(value).isValid,
  role: (value: string) => ['owner', 'admin', 'manager', 'staff'].includes(value)
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

export const validateAttendant = (attendant: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!attendantValidationSchema.name(attendant.name)) {
    errors.push('Attendant name must be 2-50 characters and contain only letters, spaces, and basic punctuation');
  }
  if (attendant.email && !attendantValidationSchema.email(attendant.email)) {
    errors.push('Email address is invalid');
  }
  if (attendant.phone && !attendantValidationSchema.phone(attendant.phone)) {
    errors.push('Phone number is invalid');
  }
  if (attendant.password && !attendantValidationSchema.password(attendant.password)) {
    const passwordValidation = validateStrongPassword(attendant.password);
    errors.push(...passwordValidation.errors);
  }
  if (!attendantValidationSchema.role(attendant.role)) {
    errors.push('Role must be one of: owner, admin, manager, staff');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Secure local storage wrapper with encryption
class SecureStorage {
  private readonly prefix = 'secure_';
  
  private encrypt(data: string): string {
    // Simple XOR encryption for demonstration
    // In production, use a proper encryption library
    const key = 'secure_key_change_in_production';
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encrypted);
  }
  
  private decrypt(encryptedData: string): string {
    try {
      const data = atob(encryptedData);
      const key = 'secure_key_change_in_production';
      let decrypted = '';
      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return decrypted;
    } catch {
      return '';
    }
  }

  setItem(key: string, value: any): void {
    try {
      const sanitizedKey = sanitizeInput(key);
      const jsonValue = JSON.stringify(value);
      const encryptedValue = this.encrypt(jsonValue);
      localStorage.setItem(this.prefix + sanitizedKey, encryptedValue);
    } catch (error) {
      console.error('Failed to save to secure storage:', error);
    }
  }
  
  getItem<T = any>(key: string): T | null {
    try {
      const sanitizedKey = sanitizeInput(key);
      const encryptedItem = localStorage.getItem(this.prefix + sanitizedKey);
      if (!encryptedItem) return null;
      
      const decryptedItem = this.decrypt(encryptedItem);
      return decryptedItem ? JSON.parse(decryptedItem) : null;
    } catch (error) {
      console.error('Failed to retrieve from secure storage:', error);
      return null;
    }
  }
  
  removeItem(key: string): void {
    try {
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(this.prefix + sanitizedKey);
    } catch (error) {
      console.error('Failed to remove from secure storage:', error);
    }
  }
  
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
    }
  }
}

export const secureStorage = new SecureStorage();

// Security event reporting
export const reportSecurityEvent = async (eventType: string, details: any = {}) => {
  try {
    // In a real application, this would send to a security monitoring service
    console.warn(`Security Event: ${eventType}`, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      details
    });
    
    // Store locally for debugging
    const events = secureStorage.getItem<any[]>('security_events') || [];
    events.push({
      type: eventType,
      timestamp: new Date().toISOString(),
      details
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    secureStorage.setItem('security_events', events);
  } catch (error) {
    console.error('Failed to report security event:', error);
  }
};
