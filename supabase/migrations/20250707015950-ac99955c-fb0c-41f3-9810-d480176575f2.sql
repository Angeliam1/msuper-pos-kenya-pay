
-- Deploy the complete database schema with security policies
-- This addresses the CRITICAL security vulnerability where RLS policies exist but tables don't

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tenants table for multi-tenancy
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'cancelled', 'suspended', 'trial')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenant_users junction table
CREATE TABLE IF NOT EXISTS tenant_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'staff' CHECK (role IN ('owner', 'admin', 'manager', 'staff')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  manager_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update profiles table structure
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      store_name TEXT,
      tenant_id UUID REFERENCES tenants(id),
      is_super_admin BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Create attendants table with proper password security
CREATE TABLE IF NOT EXISTS attendants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 50),
  email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT CHECK (phone ~* '^[\+]?[\d\s\-\(\)]{7,15}$'),
  role TEXT DEFAULT 'staff' CHECK (role IN ('owner', 'admin', 'manager', 'staff')),
  password_hash TEXT, -- Properly hashed passwords
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table with validation
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  email TEXT CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT CHECK (phone ~* '^[\+]?[\d\s\-\(\)]{7,15}$'),
  address TEXT CHECK (length(address) <= 200),
  loyalty_points INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
  credit_limit DECIMAL(10,2) DEFAULT 0 CHECK (credit_limit >= 0),
  outstanding_balance DECIMAL(10,2) DEFAULT 0 CHECK (outstanding_balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  contact_person TEXT CHECK (length(contact_person) <= 100),
  email TEXT CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT CHECK (phone ~* '^[\+]?[\d\s\-\(\)]{7,15}$'),
  address TEXT CHECK (length(address) <= 200),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table with proper validation
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  description TEXT CHECK (length(description) <= 500),
  sku TEXT CHECK (length(sku) <= 50),
  barcode TEXT CHECK (barcode IS NULL OR barcode ~* '^[0-9]{8,14}$'),
  category TEXT CHECK (length(category) <= 50),
  cost_price DECIMAL(10,2) CHECK (cost_price >= 0),
  selling_price DECIMAL(10,2) CHECK (selling_price >= 0),
  wholesale_price DECIMAL(10,2) CHECK (wholesale_price >= 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  min_stock_level INTEGER DEFAULT 0 CHECK (min_stock_level >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_price_hierarchy CHECK (cost_price <= wholesale_price AND wholesale_price <= selling_price)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  attendant_id UUID REFERENCES attendants(id),
  transaction_type TEXT CHECK (transaction_type IN ('sale', 'return', 'void')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'mobile', 'credit')),
  total_amount DECIMAL(10,2) CHECK (total_amount >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  notes TEXT CHECK (length(notes) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id),
  total_amount DECIMAL(10,2) CHECK (total_amount >= 0),
  status TEXT CHECK (status IN ('pending', 'received', 'cancelled')),
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT CHECK (length(notes) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table with proper validation
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (length(category) >= 1 AND length(category) <= 50),
  description TEXT CHECK (length(description) <= 200),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  attendant_id UUID REFERENCES attendants(id),
  expense_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  receipt_url TEXT CHECK (receipt_url ~* '^https?://'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security events table
CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID,
  details JSONB DEFAULT '{}',
  severity TEXT CHECK (severity IN ('info', 'medium', 'high', 'critical')) DEFAULT 'info',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_tenant_id ON stores(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendants_tenant_id ON attendants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendants_email ON attendants(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_tenant_id ON transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_expenses_tenant_id ON expenses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);

-- Create essential database functions for security
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM tenant_users 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_event_type TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO security_events (
    event_type,
    resource_type,
    resource_id,
    user_id,
    tenant_id,
    details,
    severity,
    ip_address
  ) VALUES (
    p_event_type,
    p_resource_type,
    p_resource_id,
    auth.uid(),
    get_current_tenant_id(),
    COALESCE(p_details, '{}'::jsonb),
    p_severity,
    inet_client_addr()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create password hashing function
CREATE OR REPLACE FUNCTION hash_password(p_password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(p_password, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create password verification function
CREATE OR REPLACE FUNCTION verify_password(p_password TEXT, p_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_hash = crypt(p_password, p_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
