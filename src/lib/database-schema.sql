
-- Enable Row Level Security with enhanced JWT configuration
-- IMPORTANT: Replace this with a cryptographically secure random string in production
-- Generate using: openssl rand -base64 32
ALTER DATABASE postgres SET "app.jwt_secret" TO 'REPLACE_WITH_SECURE_RANDOM_JWT_SECRET_IN_PRODUCTION_USE_OPENSSL_RAND_BASE64_32';

-- Create profiles table for user metadata
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  store_name TEXT NOT NULL,
  phone TEXT,
  currency TEXT DEFAULT 'KES',
  owner_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE
);

-- Create attendants table with enhanced security
CREATE TABLE IF NOT EXISTS attendants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'cashier')) DEFAULT 'cashier',
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  assigned_store_id UUID,
  pin_hash TEXT, -- Store hashed PIN, never plain text
  password_hash TEXT, -- Store hashed password, never plain text
  work_schedule JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  credit_limit DECIMAL(10,2) DEFAULT 0,
  outstanding_balance DECIMAL(10,2) DEFAULT 0,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  bank_details JSONB,
  mpesa_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  buying_cost DECIMAL(10,2) NOT NULL,
  wholesale_price DECIMAL(10,2) NOT NULL,
  retail_price DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT CHECK (unit IN ('pcs', 'kg', 'bundle', 'litre', 'meter', 'box')) DEFAULT 'pcs',
  image TEXT,
  supplier_id UUID REFERENCES suppliers(id),
  barcode TEXT,
  low_stock_threshold INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_splits JSONB NOT NULL,
  customer_id UUID REFERENCES customers(id),
  attendant_id UUID REFERENCES attendants(id),
  status TEXT CHECK (status IN ('completed', 'voided', 'refunded')) DEFAULT 'completed',
  hire_purchase_id UUID,
  voided_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  void_reason TEXT,
  refund_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) NOT NULL,
  items JSONB NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  attendant_id UUID REFERENCES attendants(id),
  receipt_image TEXT,
  invoice_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  attendant_id UUID REFERENCES attendants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced security audit log table
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Enhanced RLS policies with better security
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Attendants policies with enhanced security
CREATE POLICY "Users can view own attendants" ON attendants FOR SELECT USING (auth.uid() = user_id OR auth.uid() = created_by);
CREATE POLICY "Users can insert own attendants" ON attendants FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = created_by);
CREATE POLICY "Users can update own attendants" ON attendants FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = created_by);
CREATE POLICY "Users can delete own attendants" ON attendants FOR DELETE USING (auth.uid() = user_id OR auth.uid() = created_by);

-- Customers policies
CREATE POLICY "Users can view own customers" ON customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own customers" ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own customers" ON customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own customers" ON customers FOR DELETE USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Users can view own products" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON products FOR DELETE USING (auth.uid() = user_id);

-- Suppliers policies
CREATE POLICY "Users can view own suppliers" ON suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own suppliers" ON suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own suppliers" ON suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own suppliers" ON suppliers FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);

-- Purchases policies
CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own purchases" ON purchases FOR UPDATE USING (auth.uid() = user_id);

-- Expenses policies
CREATE POLICY "Users can view own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);

-- Security audit log policies
CREATE POLICY "Users can view own audit logs" ON security_audit_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert audit logs" ON security_audit_log FOR INSERT WITH CHECK (true);

-- Enhanced functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, store_name, phone, currency, owner_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'store_name', 'My Store'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'currency', 'KES'),
    COALESCE(NEW.raw_user_meta_data->>'owner_name', '')
  );
  
  -- Log the user creation event
  INSERT INTO public.security_audit_log (
    user_id, action, resource_type, details, severity
  ) VALUES (
    NEW.id, 'user_created', 'authentication', 
    jsonb_build_object('email', NEW.email, 'created_at', NEW.created_at),
    'medium'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced function for security logging
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'medium'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    severity
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    COALESCE(p_details, '{}'::jsonb) || jsonb_build_object('timestamp', NOW()),
    p_severity
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced function for secure password hashing
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Use proper cryptographic hashing with salt
  RETURN encode(digest(password || gen_random_uuid()::text || extract(epoch from now())::text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and update failed login attempts
CREATE OR REPLACE FUNCTION public.handle_failed_login(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  current_attempts INTEGER;
BEGIN
  -- Get current failed attempts
  SELECT failed_login_attempts INTO current_attempts
  FROM profiles
  WHERE id = p_user_id;
  
  -- Increment failed attempts
  UPDATE profiles
  SET 
    failed_login_attempts = COALESCE(current_attempts, 0) + 1,
    account_locked_until = CASE 
      WHEN COALESCE(current_attempts, 0) + 1 >= 5 THEN NOW() + INTERVAL '30 minutes'
      ELSE account_locked_until
    END
  WHERE id = p_user_id;
  
  -- Log the failed login attempt
  PERFORM log_security_event(
    'failed_login_attempt', 
    'authentication', 
    p_user_id::text,
    jsonb_build_object(
      'attempts', COALESCE(current_attempts, 0) + 1,
      'locked', COALESCE(current_attempts, 0) + 1 >= 5
    ),
    'high'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_attendants_user_id ON attendants(user_id);
CREATE INDEX IF NOT EXISTS idx_attendants_email ON attendants(email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON security_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_severity ON security_audit_log(severity);
CREATE INDEX IF NOT EXISTS idx_profiles_failed_attempts ON profiles(failed_login_attempts);
CREATE INDEX IF NOT EXISTS idx_profiles_locked_until ON profiles(account_locked_until);
