
-- Row Level Security (RLS) policies for multi-tenant data isolation
-- Ensures users can only access data within their tenant

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

-- Core table policies with tenant isolation
CREATE POLICY "Users can view attendants in their tenant" ON attendants FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view customers in their tenant" ON customers FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view products in their tenant" ON products FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view suppliers in their tenant" ON suppliers FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view transactions in their tenant" ON transactions FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view purchases in their tenant" ON purchases FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view expenses in their tenant" ON expenses FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Insert and update policies with tenant context
CREATE POLICY "Users can insert customers in their tenant" ON customers FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert products in their tenant" ON products FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert transactions in their tenant" ON transactions FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert attendants in their tenant" ON attendants FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert suppliers in their tenant" ON suppliers FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert purchases in their tenant" ON purchases FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert expenses in their tenant" ON expenses FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Update and delete policies
CREATE POLICY "Users can update data in their tenant" ON customers FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update products in their tenant" ON products FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update attendants in their tenant" ON attendants FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update suppliers in their tenant" ON suppliers FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (
  id = auth.uid()
);

CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (
  id = auth.uid()
);
