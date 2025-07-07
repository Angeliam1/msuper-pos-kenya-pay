
import { supabase } from '@/integrations/supabase/client';

// Enhanced security utilities
export class SecurityUtils {
  // Secure password validation
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
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
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // XSS protection - sanitize HTML input
  static sanitizeHtml(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // General input sanitization
  static sanitizeInput(input: string): string {
    if (!input) return '';
    return input.trim().replace(/[<>]/g, '');
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  // Validate name (letters, spaces, basic punctuation)
  static validateName(name: string): boolean {
    const nameRegex = /^[A-Za-z\s\-\.\']{1,100}$/;
    return nameRegex.test(name);
  }

  // Validate phone number (international format)
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
  }

  // Validate and sanitize product data
  static validateProductData(data: any): { isValid: boolean; sanitized: any; errors: string[] } {
    const errors: string[] = [];
    const sanitized: any = {};

    // Validate and sanitize name
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Product name is required');
    } else if (data.name.length > 100) {
      errors.push('Product name must not exceed 100 characters');
    } else {
      sanitized.name = this.sanitizeHtml(data.name.trim());
    }

    // Validate and sanitize description
    if (data.description) {
      if (data.description.length > 500) {
        errors.push('Description must not exceed 500 characters');
      } else {
        sanitized.description = this.sanitizeHtml(data.description.trim());
      }
    }

    // Validate prices
    if (data.cost_price && (isNaN(data.cost_price) || data.cost_price < 0)) {
      errors.push('Cost price must be a positive number');
    } else {
      sanitized.cost_price = data.cost_price;
    }

    if (data.selling_price && (isNaN(data.selling_price) || data.selling_price < 0)) {
      errors.push('Selling price must be a positive number');
    } else {
      sanitized.selling_price = data.selling_price;
    }

    // Validate barcode format
    if (data.barcode && !/^[0-9]{8,14}$/.test(data.barcode)) {
      errors.push('Barcode must be 8-14 digits');
    } else {
      sanitized.barcode = data.barcode;
    }

    // Validate stock quantities
    if (data.stock_quantity && (isNaN(data.stock_quantity) || data.stock_quantity < 0)) {
      errors.push('Stock quantity must be a non-negative number');
    } else {
      sanitized.stock_quantity = data.stock_quantity;
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }

  // Validate customer data
  static validateCustomerData(data: any): { isValid: boolean; sanitized: any; errors: string[] } {
    const errors: string[] = [];
    const sanitized: any = {};

    // Validate and sanitize name
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Customer name is required');
    } else if (data.name.length > 100) {
      errors.push('Customer name must not exceed 100 characters');
    } else {
      sanitized.name = this.sanitizeHtml(data.name.trim());
    }

    // Validate email
    if (data.email) {
      if (!this.validateEmail(data.email)) {
        errors.push('Invalid email format');
      } else {
        sanitized.email = data.email.toLowerCase().trim();
      }
    }

    // Validate phone
    if (data.phone) {
      if (!this.validatePhone(data.phone)) {
        errors.push('Invalid phone number format');
      } else {
        sanitized.phone = data.phone.trim();
      }
    }

    // Validate and sanitize address
    if (data.address) {
      if (data.address.length > 200) {
        errors.push('Address must not exceed 200 characters');
      } else {
        sanitized.address = this.sanitizeHtml(data.address.trim());
      }
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }

  // Rate limiting for API calls
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  // Log security events
  static async logSecurityEvent(
    eventType: string,
    resourceType?: string,
    resourceId?: string,
    details?: any,
    severity: 'info' | 'medium' | 'high' | 'critical' = 'info'
  ): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_details: details ? JSON.stringify(details) : null,
        p_severity: severity
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging error:', error);
    }
  }

  // Generate secure session tokens
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Secure data storage with encryption
  static encryptData(data: string, key: string): string {
    // Simple XOR encryption for demo - in production use proper encryption
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encrypted);
  }

  static decryptData(encryptedData: string, key: string): string {
    try {
      const encrypted = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return decrypted;
    } catch {
      return '';
    }
  }
}

// Enhanced secure storage class
export class SecureStorage {
  private static encryptionKey = 'pos-secure-key-2024'; // In production, use environment variable

  static setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      const encrypted = SecurityUtils.encryptData(serialized, this.encryptionKey);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = SecurityUtils.decryptData(encrypted, this.encryptionKey);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}

// Export individual functions for backward compatibility
export const validateEmail = SecurityUtils.validateEmail;
export const validateName = SecurityUtils.validateName;
export const sanitizeInput = SecurityUtils.sanitizeInput;
