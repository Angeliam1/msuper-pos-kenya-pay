
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

-- Profiles policies - COMPLETE COVERAGE
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (
  id = auth.uid()
);

CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (
  id = auth.uid()
);

CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (
  id = auth.uid()
);

CREATE POLICY "Super admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
);

-- Core table policies with COMPLETE CRUD coverage
-- Attendants policies
CREATE POLICY "Users can view attendants in their tenant" ON attendants FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert attendants in their tenant" ON attendants FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update attendants in their tenant" ON attendants FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete attendants in their tenant" ON attendants FOR DELETE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Customers policies
CREATE POLICY "Users can view customers in their tenant" ON customers FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert customers in their tenant" ON customers FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update customers in their tenant" ON customers FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete customers in their tenant" ON customers FOR DELETE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Products policies
CREATE POLICY "Users can view products in their tenant" ON products FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert products in their tenant" ON products FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update products in their tenant" ON products FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete products in their tenant" ON products FOR DELETE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Suppliers policies
CREATE POLICY "Users can view suppliers in their tenant" ON suppliers FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert suppliers in their tenant" ON suppliers FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update suppliers in their tenant" ON suppliers FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete suppliers in their tenant" ON suppliers FOR DELETE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Transactions policies
CREATE POLICY "Users can view transactions in their tenant" ON transactions FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert transactions in their tenant" ON transactions FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update transactions in their tenant" ON transactions FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete transactions in their tenant" ON transactions FOR DELETE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Purchases policies
CREATE POLICY "Users can view purchases in their tenant" ON purchases FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert purchases in their tenant" ON purchases FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update purchases in their tenant" ON purchases FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete purchases in their tenant" ON purchases FOR DELETE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Expenses policies
CREATE POLICY "Users can view expenses in their tenant" ON expenses FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert expenses in their tenant" ON expenses FOR INSERT WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update expenses in their tenant" ON expenses FOR UPDATE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete expenses in their tenant" ON expenses FOR DELETE USING (
  tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
);

-- Security events policies
CREATE POLICY "Super admins can view all security events" ON security_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
);

CREATE POLICY "Users can view their own security events" ON security_events FOR SELECT USING (
  user_id = auth.uid()
);

CREATE POLICY "System can insert security events" ON security_events FOR INSERT WITH CHECK (true);
