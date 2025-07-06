
-- Core database schema for POS system
-- Basic tables and structure without tenant-specific configurations

-- Enable Row Level Security with enhanced JWT configuration
-- IMPORTANT: Replace this with a cryptographically secure random string in production
-- Generate using: openssl rand -base64 32
ALTER DATABASE postgres SET "app.jwt_secret" TO 'REPLACE_WITH_SECURE_RANDOM_JWT_SECRET_IN_PRODUCTION_USE_OPENSSL_RAND_BASE64_32';

-- Core profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  store_name TEXT,
  tenant_id UUID,
  is_super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core attendants table
CREATE TABLE IF NOT EXISTS attendants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  store_id UUID,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'staff',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  store_id UUID,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  loyalty_points INTEGER DEFAULT 0,
  credit_limit DECIMAL(10,2) DEFAULT 0,
  outstanding_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  store_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  barcode TEXT,
  category TEXT,
  cost_price DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  wholesale_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  store_id UUID,
  customer_id UUID,
  attendant_id UUID,
  transaction_type TEXT CHECK (transaction_type IN ('sale', 'return', 'void')),
  payment_method TEXT,
  total_amount DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  status TEXT DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  supplier_id UUID,
  total_amount DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending', 'received', 'cancelled')),
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  category TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  expense_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create basic indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendants_tenant_id ON attendants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant_id ON transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_tenant_id ON suppliers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_purchases_tenant_id ON purchases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_expenses_tenant_id ON expenses(tenant_id);
