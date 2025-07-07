
-- Create enhanced stores table with all required details
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  manager_id UUID REFERENCES auth.users(id),
  kra_pin TEXT,
  mpesa_paybill TEXT,
  mpesa_account TEXT,
  mpesa_till TEXT,
  bank_account TEXT,
  payment_instructions TEXT,
  receipt_header TEXT DEFAULT 'Thank you for shopping with us!',
  receipt_footer TEXT DEFAULT 'Please come again',
  show_store_name BOOLEAN DEFAULT true,
  show_store_address BOOLEAN DEFAULT true,
  show_store_phone BOOLEAN DEFAULT true,
  show_kra_pin BOOLEAN DEFAULT true,
  currency TEXT DEFAULT 'KES',
  tax_rate DECIMAL(5,2) DEFAULT 16.00,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending', 'suspended')) DEFAULT 'active',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for role-based access
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('super_admin', 'owner', 'admin', 'manager', 'cashier', 'staff')) DEFAULT 'staff',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, store_id, role)
);

-- Update customers table to properly link to stores
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);

-- Enable RLS on new tables
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to get user role for a specific store
CREATE OR REPLACE FUNCTION public.get_user_role_for_store(p_user_id UUID, p_store_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = p_user_id
    AND (store_id = p_store_id OR role = 'super_admin')
    AND is_active = true
  ORDER BY 
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'owner' THEN 2
      WHEN 'admin' THEN 3
      WHEN 'manager' THEN 4
      WHEN 'cashier' THEN 5
      WHEN 'staff' THEN 6
    END
  LIMIT 1;
$$;

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role_in_store(p_user_id UUID, p_store_id UUID, p_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = p_user_id
      AND (store_id = p_store_id OR role = 'super_admin')
      AND (role = p_role OR role = 'super_admin')
      AND is_active = true
  );
$$;

-- RLS Policies for stores
CREATE POLICY "Users can view stores they have access to"
ON public.stores
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND (ur.store_id = stores.id OR ur.role = 'super_admin')
      AND ur.is_active = true
  )
);

CREATE POLICY "Store managers can update their stores"
ON public.stores
FOR UPDATE
TO authenticated
USING (
  public.has_role_in_store(auth.uid(), id, 'manager') OR
  public.has_role_in_store(auth.uid(), id, 'admin') OR
  public.has_role_in_store(auth.uid(), id, 'owner')
);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  public.has_role_in_store(auth.uid(), store_id, 'admin') OR
  public.has_role_in_store(auth.uid(), store_id, 'owner')
);

-- Update customers RLS to be store-specific
DROP POLICY IF EXISTS "Users can manage customers" ON public.customers;
CREATE POLICY "Users can manage store customers"
ON public.customers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND (ur.store_id = customers.store_id OR ur.role = 'super_admin')
      AND ur.is_active = true
  )
);

-- Insert super admin role for development
INSERT INTO public.user_roles (user_id, role, is_active)
SELECT id, 'super_admin', true
FROM auth.users
WHERE email = 'admin@msuper.com'
ON CONFLICT DO NOTHING;
