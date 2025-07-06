
-- Enable Row Level Security with enhanced JWT configuration
-- IMPORTANT: Replace this with a cryptographically secure random string in production
-- Generate using: openssl rand -base64 32
ALTER DATABASE postgres SET "app.jwt_secret" TO 'REPLACE_WITH_SECURE_RANDOM_JWT_SECRET_IN_PRODUCTION_USE_OPENSSL_RAND_BASE64_32';

-- Create tenants table for multi-tenant architecture
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  subscription_plan TEXT CHECK (subscription_plan IN ('basic', 'premium', 'enterprise')) DEFAULT 'basic',
  subscription_status TEXT CHECK (subscription_status IN ('active', 'past_due', 'cancelled', 'suspended', 'trial')) DEFAULT 'trial',
  monthly_fee DECIMAL(10,2) DEFAULT 29.99,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  grace_period_ends TIMESTAMP WITH TIME ZONE,
  days_overdue INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  max_stores INTEGER DEFAULT 1,
  max_users INTEGER DEFAULT 5,
  max_products INTEGER DEFAULT 1000,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenant_users junction table for user-tenant relationships
CREATE TABLE IF NOT EXISTS tenant_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'manager', 'staff')) DEFAULT 'staff',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Update profiles table to include tenant reference
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- Update stores table to include tenant reference
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  manager_id UUID REFERENCES auth.users(id),
  manager_name TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending', 'suspended')) DEFAULT 'active',
  total_sales DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  receipt_settings JSONB DEFAULT '{}',
  pricing_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add tenant_id to all existing tables for proper isolation
ALTER TABLE attendants ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- Add store_id references where appropriate
ALTER TABLE customers ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Enhanced RLS policies for multi-tenant architecture
-- Tenants policies (only super admins can manage tenants)
CREATE POLICY "Super admins can manage all tenants" ON tenants FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
);

CREATE POLICY "Users can view their tenant" ON tenants FOR SELECT USING (
  id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Tenant users policies
CREATE POLICY "Users can view tenant users in their tenant" ON tenant_users FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Tenant owners can manage tenant users" ON tenant_users FOR ALL USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_users 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- Stores policies with tenant isolation
CREATE POLICY "Users can view stores in their tenant" ON stores FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Tenant admins can manage stores" ON stores FOR ALL USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_users 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- Update existing RLS policies to include tenant isolation
DROP POLICY IF EXISTS "Users can view own attendants" ON attendants;
CREATE POLICY "Users can view attendants in their tenant" ON attendants FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view own customers" ON customers;
CREATE POLICY "Users can view customers in their tenant" ON customers FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view own products" ON products;
CREATE POLICY "Users can view products in their tenant" ON products FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view own suppliers" ON suppliers;
CREATE POLICY "Users can view suppliers in their tenant" ON suppliers FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view transactions in their tenant" ON transactions FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Insert and update policies with tenant context
CREATE POLICY "Users can insert data in their tenant" ON customers FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert products in their tenant" ON products FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert transactions in their tenant" ON transactions FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Function to get current user's tenant
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
$$ LANGUAGE plpgsql SECURITY definer;

-- Function to create a new tenant with initial setup
CREATE OR REPLACE FUNCTION create_tenant(
  p_tenant_name TEXT,
  p_owner_id UUID,
  p_subscription_plan TEXT DEFAULT 'basic'
)
RETURNS UUID AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Create the tenant
  INSERT INTO tenants (name, subscription_plan)
  VALUES (p_tenant_name, p_subscription_plan)
  RETURNING id INTO v_tenant_id;
  
  -- Add the owner to the tenant
  INSERT INTO tenant_users (tenant_id, user_id, role)
  VALUES (v_tenant_id, p_owner_id, 'owner');
  
  -- Update the user's profile with tenant reference
  UPDATE profiles 
  SET tenant_id = v_tenant_id 
  WHERE id = p_owner_id;
  
  -- Create default store for the tenant
  INSERT INTO stores (tenant_id, name, manager_id)
  VALUES (v_tenant_id, p_tenant_name || ' - Main Store', p_owner_id);
  
  RETURN v_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Function to deactivate tenant (kill switch)
CREATE OR REPLACE FUNCTION deactivate_tenant(p_tenant_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Only super admins can deactivate tenants
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true) THEN
    RAISE EXCEPTION 'Access denied: Super admin privileges required';
  END IF;
  
  -- Deactivate the tenant
  UPDATE tenants 
  SET is_active = false, subscription_status = 'suspended', updated_at = NOW()
  WHERE id = p_tenant_id;
  
  -- Deactivate all stores in the tenant
  UPDATE stores 
  SET is_active = false, status = 'suspended', updated_at = NOW()
  WHERE tenant_id = p_tenant_id;
  
  -- Log the action
  PERFORM log_security_event(
    'tenant_deactivated',
    'tenant',
    p_tenant_id::text,
    jsonb_build_object('deactivated_by', auth.uid()),
    'critical'
  );
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Create indexes for performance with tenant isolation
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_tenant_id ON stores(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendants_tenant_id ON attendants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant_id ON transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);

-- Insert initial super admin (replace with actual super admin details)
INSERT INTO profiles (id, store_name, is_super_admin, tenant_id) 
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid, 
  'Super Admin', 
  true, 
  null
) ON CONFLICT (id) DO UPDATE SET is_super_admin = true;
