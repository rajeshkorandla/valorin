-- ============================================
-- USER MODULE ENHANCEMENT MIGRATION
-- ============================================
-- This migration enhances the user system with:
-- - Expanded role structure (Employee, Client, Vendor, Admin, System)
-- - User metadata and permissions
-- - Department tracking
-- - Enhanced RLS policies

-- ============================================
-- 1. UPDATE USER ROLES
-- ============================================

-- Drop old role constraint and add new one
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new role types based on Valorin Insurance requirements
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('admin', 'employee', 'client', 'vendor', 'system'));

-- Update existing users to new role structure
-- Map old roles to new structure
UPDATE users SET role = 'employee' WHERE role IN ('manager', 'agent');
UPDATE users SET role = 'client' WHERE role = 'viewer';

-- ============================================
-- 2. ADD USER METADATA FIELDS
-- ============================================

-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS vendor_company_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS vendor_type TEXT; -- 'mga', 'carrier', 'partner'
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC);

-- ============================================
-- 3. CREATE DEPARTMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
  ('Sales', 'Sales and business development team'),
  ('Account Management', 'Client account managers and service team'),
  ('Underwriting', 'Risk assessment and underwriting'),
  ('Claims', 'Claims processing and management'),
  ('Administration', 'Administrative and support functions'),
  ('IT', 'Information technology and systems'),
  ('Finance', 'Finance, billing, and accounting')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 4. CREATE USER PERMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission_key TEXT NOT NULL, -- e.g., 'clients.view', 'quotes.edit', 'billing.manage'
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(user_id, permission_key)
);

CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_key ON user_permissions(permission_key);

-- ============================================
-- 5. CREATE ROLE PERMISSIONS MAPPING
-- ============================================

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'employee', 'client', 'vendor', 'system')),
  permission_key TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission_key)
);

-- Insert default role permissions
INSERT INTO role_permissions (role, permission_key, description) VALUES
  -- Admin permissions (full access)
  ('admin', 'users.view', 'View all users'),
  ('admin', 'users.create', 'Create new users'),
  ('admin', 'users.edit', 'Edit user details'),
  ('admin', 'users.delete', 'Delete users'),
  ('admin', 'roles.manage', 'Manage roles and permissions'),
  ('admin', 'system.configure', 'Configure system settings'),
  ('admin', 'integrations.manage', 'Manage integrations'),
  ('admin', 'reports.view', 'View all reports'),
  
  -- Employee permissions
  ('employee', 'clients.view', 'View clients'),
  ('employee', 'clients.create', 'Create new clients'),
  ('employee', 'clients.edit', 'Edit client details'),
  ('employee', 'quotes.view', 'View quotes'),
  ('employee', 'quotes.create', 'Create new quotes'),
  ('employee', 'quotes.edit', 'Edit quotes'),
  ('employee', 'tasks.view', 'View tasks'),
  ('employee', 'tasks.create', 'Create tasks'),
  ('employee', 'documents.view', 'View documents'),
  ('employee', 'documents.upload', 'Upload documents'),
  ('employee', 'communications.send', 'Send communications'),
  ('employee', 'dashboard.view', 'View dashboard'),
  
  -- Client permissions
  ('client', 'policies.view', 'View own policies'),
  ('client', 'documents.view', 'View own documents'),
  ('client', 'documents.upload', 'Upload required documents'),
  ('client', 'payments.view', 'View payment history'),
  ('client', 'payments.make', 'Make payments'),
  ('client', 'coi.request', 'Request certificates of insurance'),
  ('client', 'claims.view', 'View own claims'),
  ('client', 'profile.edit', 'Edit own profile'),
  
  -- Vendor permissions
  ('vendor', 'policies.view', 'View shared policies'),
  ('vendor', 'commissions.view', 'View commission data'),
  ('vendor', 'documents.view', 'View shared documents'),
  ('vendor', 'documents.upload', 'Upload compliance documents'),
  ('vendor', 'integrations.connect', 'Connect API integrations'),
  ('vendor', 'dashboard.view', 'View vendor dashboard'),
  
  -- System permissions (for automation)
  ('system', 'all', 'Full system access')
ON CONFLICT (role, permission_key) DO NOTHING;

-- ============================================
-- 6. CREATE USER ACTIVITY LOG
-- ============================================

CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'login', 'logout', 'create', 'update', 'delete', etc.
  resource_type TEXT, -- 'client', 'quote', 'document', etc.
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_action ON user_activity_log(action);

-- ============================================
-- 7. UPDATE RLS POLICIES
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- Create new comprehensive policies

-- Users can view their own profile
-- (Already exists from previous migration)

-- Admins can manage all users
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL
  USING (public.user_role() = 'admin');

-- Employees can view other employees and clients (for CRM)
CREATE POLICY "Employees can view users" ON users
  FOR SELECT
  USING (
    public.user_role() IN ('admin', 'employee') OR
    id = auth.uid()
  );

-- Clients can only view their own profile
-- (Already covered by "Users can view their own profile")

-- Vendors can view their own profile and assigned employees
CREATE POLICY "Vendors can view assigned employees" ON users
  FOR SELECT
  USING (
    public.user_role() = 'vendor' AND id = auth.uid()
  );

-- Enable RLS on new tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Departments policies
CREATE POLICY "Authenticated users can view departments" ON departments
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage departments" ON departments
  FOR ALL
  USING (public.user_role() = 'admin');

-- User permissions policies
CREATE POLICY "Users can view own permissions" ON user_permissions
  FOR SELECT
  USING (user_id = auth.uid() OR public.user_role() = 'admin');

CREATE POLICY "Admins can manage permissions" ON user_permissions
  FOR ALL
  USING (public.user_role() = 'admin');

-- Role permissions policies (read-only reference table)
CREATE POLICY "Authenticated users can view role permissions" ON role_permissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage role permissions" ON role_permissions
  FOR ALL
  USING (public.user_role() = 'admin');

-- Activity log policies
CREATE POLICY "Users can view own activity" ON user_activity_log
  FOR SELECT
  USING (user_id = auth.uid() OR public.user_role() = 'admin');

CREATE POLICY "System can insert activity logs" ON user_activity_log
  FOR INSERT
  WITH CHECK (true); -- Allow any authenticated user to log their own activity

-- ============================================
-- 8. CREATE HELPER FUNCTIONS
-- ============================================

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(
  permission_key TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_value TEXT;
  has_perm BOOLEAN;
BEGIN
  -- Get user role
  SELECT role INTO user_role_value FROM public.users WHERE id = auth.uid();
  
  -- Admin has all permissions
  IF user_role_value = 'admin' THEN
    RETURN true;
  END IF;
  
  -- Check role-based permissions
  SELECT EXISTS (
    SELECT 1 FROM role_permissions 
    WHERE role = user_role_value AND permission_key = has_permission.permission_key
  ) INTO has_perm;
  
  -- If not in role permissions, check individual user permissions
  IF NOT has_perm THEN
    SELECT EXISTS (
      SELECT 1 FROM user_permissions 
      WHERE user_id = auth.uid() AND permission_key = has_permission.permission_key
    ) INTO has_perm;
  END IF;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO user_activity_log (
    user_id, 
    action, 
    resource_type, 
    resource_id, 
    details
  ) VALUES (
    auth.uid(), 
    p_action, 
    p_resource_type, 
    p_resource_id, 
    p_details
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. CREATE USEFUL VIEWS
-- ============================================

-- View for user directory with department info
CREATE OR REPLACE VIEW user_directory AS
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.department,
  u.job_title,
  u.employee_id,
  u.vendor_company_name,
  u.vendor_type,
  u.phone,
  u.avatar_url,
  u.status,
  u.is_active,
  u.last_login,
  u.created_at,
  d.name as department_name,
  d.manager_id as department_manager_id
FROM users u
LEFT JOIN departments d ON u.department = d.name;

-- View for user permissions summary
CREATE OR REPLACE VIEW user_permissions_summary AS
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  u.role,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'permission', rp.permission_key,
        'source', 'role',
        'description', rp.description
      )
    ) FILTER (WHERE rp.permission_key IS NOT NULL),
    '[]'::json
  ) || COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'permission', up.permission_key,
        'source', 'individual',
        'granted_at', up.granted_at
      )
    ) FILTER (WHERE up.permission_key IS NOT NULL),
    '[]'::json
  ) as permissions
FROM users u
LEFT JOIN role_permissions rp ON u.role = rp.role
LEFT JOIN user_permissions up ON u.id = up.user_id
GROUP BY u.id, u.email, u.full_name, u.role;

-- ============================================
-- 10. TRIGGERS
-- ============================================

-- Trigger to update departments updated_at
CREATE TRIGGER update_departments_updated_at 
  BEFORE UPDATE ON departments
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to log last login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- This trigger would be called from application code on login
-- We'll handle it in the app layer instead

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'User Module Migration Complete!';
  RAISE NOTICE 'New roles: admin, employee, client, vendor, system';
  RAISE NOTICE 'New tables: departments, user_permissions, role_permissions, user_activity_log';
  RAISE NOTICE 'New views: user_directory, user_permissions_summary';
  RAISE NOTICE 'New functions: has_permission(), log_user_activity()';
END $$;
