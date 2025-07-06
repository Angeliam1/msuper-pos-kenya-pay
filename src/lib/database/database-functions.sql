
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
  
  -- Log the tenant creation
  PERFORM log_security_event(
    'tenant_created',
    'tenant',
    v_tenant_id::text,
    jsonb_build_object('tenant_name', p_tenant_name, 'owner_id', p_owner_id),
    'info'
  );
  
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

-- Enhanced security event logging function
CREATE OR REPLACE FUNCTION log_security_event(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS VOID AS $$
BEGIN
  -- Insert into security events table
  INSERT INTO security_events (
    event_type,
    resource_type,
    resource_id,
    user_id,
    details,
    severity,
    ip_address,
    user_agent
  ) VALUES (
    p_action,
    p_resource_type,
    p_resource_id,
    auth.uid(),
    COALESCE(p_details, '{}'::jsonb),
    p_severity,
    inet_client_addr(),
    current_setting('request.headers')::json->>'user-agent'
  );
  
  -- Also log to database logs for immediate visibility
  RAISE NOTICE 'Security Event: % on % (%) - Details: % - Severity: %', 
    p_action, p_resource_type, p_resource_id, p_details, p_severity;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Function to create secure super admin (must be called manually)
CREATE OR REPLACE FUNCTION create_super_admin(
  p_user_id UUID,
  p_store_name TEXT DEFAULT 'Super Admin'
)
RETURNS VOID AS $$
BEGIN
  -- Only allow if no super admin exists
  IF EXISTS (SELECT 1 FROM profiles WHERE is_super_admin = true) THEN
    RAISE EXCEPTION 'Super admin already exists';
  END IF;
  
  -- Create or update the profile
  INSERT INTO profiles (id, store_name, is_super_admin, tenant_id) 
  VALUES (p_user_id, p_store_name, true, null)
  ON CONFLICT (id) DO UPDATE SET 
    is_super_admin = true,
    store_name = p_store_name;
    
  -- Log the super admin creation
  PERFORM log_security_event(
    'super_admin_created',
    'user',
    p_user_id::text,
    jsonb_build_object('store_name', p_store_name),
    'critical'
  );
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Function to hash passwords (for attendant authentication)
CREATE OR REPLACE FUNCTION hash_password(p_password TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Use pgcrypto extension for secure password hashing
  RETURN crypt(p_password, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Function to verify passwords
CREATE OR REPLACE FUNCTION verify_password(p_password TEXT, p_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_hash = crypt(p_password, p_hash);
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Function to handle failed login attempts
CREATE OR REPLACE FUNCTION handle_failed_login(p_attendant_id UUID)
RETURNS VOID AS $$
DECLARE
  v_failed_attempts INTEGER;
BEGIN
  -- Increment failed attempts
  UPDATE attendants 
  SET failed_attempts = failed_attempts + 1,
      locked_until = CASE 
        WHEN failed_attempts + 1 >= 5 THEN NOW() + INTERVAL '30 minutes'
        ELSE locked_until
      END
  WHERE id = p_attendant_id
  RETURNING failed_attempts INTO v_failed_attempts;
  
  -- Log the failed attempt
  PERFORM log_security_event(
    'failed_login_attempt',
    'attendant',
    p_attendant_id::text,
    jsonb_build_object('failed_attempts', v_failed_attempts),
    CASE WHEN v_failed_attempts >= 5 THEN 'high' ELSE 'medium' END
  );
END;
$$ LANGUAGE plpgsql SECURITY definer;
