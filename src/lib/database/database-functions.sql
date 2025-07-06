
-- Database utility functions for tenant management and operations

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

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS VOID AS $$
BEGIN
  -- In a real implementation, this would log to a security events table
  -- For now, we'll just log to the database logs
  RAISE NOTICE 'Security Event: % on % (%) - Details: % - Severity: %', 
    p_action, p_resource_type, p_resource_id, p_details, p_severity;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Insert initial super admin (replace with actual super admin details)
INSERT INTO profiles (id, store_name, is_super_admin, tenant_id) 
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid, 
  'Super Admin', 
  true, 
  null
) ON CONFLICT (id) DO UPDATE SET is_super_admin = true;
