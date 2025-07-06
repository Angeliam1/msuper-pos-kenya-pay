
-- Tenant management schema
-- Multi-tenant architecture with subscription management

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

-- Create stores table with tenant reference
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

-- Add foreign key constraints for tenant isolation
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
ALTER TABLE attendants ADD CONSTRAINT fk_attendants_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
ALTER TABLE customers ADD CONSTRAINT fk_customers_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
ALTER TABLE suppliers ADD CONSTRAINT fk_suppliers_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
ALTER TABLE products ADD CONSTRAINT fk_products_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
ALTER TABLE purchases ADD CONSTRAINT fk_purchases_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);
ALTER TABLE expenses ADD CONSTRAINT fk_expenses_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id);

-- Add store references where appropriate
ALTER TABLE customers ADD CONSTRAINT fk_customers_store FOREIGN KEY (store_id) REFERENCES stores(id);
ALTER TABLE products ADD CONSTRAINT fk_products_store FOREIGN KEY (store_id) REFERENCES stores(id);
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_store FOREIGN KEY (store_id) REFERENCES stores(id);

-- Enable RLS on tenant tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Create indexes for tenant-related tables
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_tenant_id ON stores(tenant_id);
