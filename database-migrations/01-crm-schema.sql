-- ============================================
-- INSURANCE CRM DATABASE SCHEMA MIGRATION
-- ============================================
-- This migration adds CRM functionality to the existing insurance app
-- Run this in your Supabase SQL Editor after the initial schema

-- ============================================
-- 1. USER ROLES & PERMISSIONS
-- ============================================

-- Drop and recreate admin_users table with enhanced role support
DROP TABLE IF EXISTS admin_users CASCADE;

CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'agent', 'viewer')) DEFAULT 'viewer',
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for role-based queries
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. QUOTE PIPELINE STAGES
-- ============================================

CREATE TABLE quote_statuses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  color TEXT, -- Hex color code for UI
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pipeline stages
INSERT INTO quote_statuses (name, display_name, color, sort_order) VALUES
  ('new_request', 'New Request', '#3B82F6', 1),
  ('contacted', 'Contacted', '#8B5CF6', 2),
  ('quoted', 'Quoted', '#F59E0B', 3),
  ('closed_won', 'Closed Won', '#10B981', 4),
  ('closed_lost', 'Closed Lost', '#EF4444', 5);

-- ============================================
-- 3. ENHANCED CLIENTS TABLE
-- ============================================

CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  avatar_url TEXT,
  company_name TEXT,
  notes TEXT,
  source TEXT, -- How they found us (referral, website, etc.)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_name ON clients(last_name, first_name);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- ============================================
-- 4. ENHANCED QUOTES TABLE (replaces quote_requests)
-- ============================================

CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Quote Details
  title TEXT NOT NULL, -- e.g., "Auto Insurance - John Smith"
  insurance_type TEXT NOT NULL CHECK (insurance_type IN ('health', 'auto', 'life', 'property', 'business')),
  coverage_amount NUMERIC(12, 2),
  premium_amount NUMERIC(12, 2), -- Monthly/Annual premium quoted
  currency TEXT DEFAULT 'USD',
  
  -- Pipeline Management
  status_id UUID REFERENCES quote_statuses(id),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  
  -- Assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Additional Info
  additional_info TEXT,
  internal_notes TEXT, -- Private notes for staff
  
  -- Deal Tracking
  probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contacted_at TIMESTAMP WITH TIME ZONE,
  quoted_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quotes_client ON quotes(client_id);
CREATE INDEX idx_quotes_status ON quotes(status_id);
CREATE INDEX idx_quotes_assigned_to ON quotes(assigned_to);
CREATE INDEX idx_quotes_insurance_type ON quotes(insurance_type);
CREATE INDEX idx_quotes_submitted_at ON quotes(submitted_at DESC);
CREATE INDEX idx_quotes_expected_close_date ON quotes(expected_close_date);

-- ============================================
-- 5. ACTIVITIES / TIMELINE
-- ============================================

CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'status_change', 'note_added', 'email_sent', 'call_made', 
    'meeting_scheduled', 'quote_sent', 'document_uploaded', 'assigned'
  )),
  
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB, -- Additional structured data
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activities_quote ON activities(quote_id);
CREATE INDEX idx_activities_client ON activities(client_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);

-- ============================================
-- 6. NOTES
-- ============================================

CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notes_quote ON notes(quote_id);
CREATE INDEX idx_notes_client ON notes(client_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

-- ============================================
-- 7. TASKS
-- ============================================

CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_quote ON tasks(quote_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ============================================
-- 8. MIGRATE EXISTING DATA
-- ============================================

-- Migrate client_submissions to clients table
INSERT INTO clients (first_name, last_name, email, phone, date_of_birth, address, city, state, zip_code, created_at)
SELECT 
  first_name, 
  last_name, 
  email, 
  phone, 
  date_of_birth, 
  address, 
  city, 
  state, 
  zip_code, 
  created_at
FROM client_submissions
ON CONFLICT DO NOTHING;

-- Migrate quote_requests to quotes table
INSERT INTO quotes (
  client_id, 
  title, 
  insurance_type, 
  coverage_amount, 
  additional_info, 
  status_id,
  submitted_at, 
  created_at
)
SELECT 
  c.id,
  qr.insurance_type || ' Insurance - ' || qr.full_name,
  qr.insurance_type,
  NULLIF(REGEXP_REPLACE(qr.coverage_amount, '[^0-9.]', '', 'g'), '')::NUMERIC,
  qr.additional_info,
  (SELECT id FROM quote_statuses WHERE name = 'new_request'),
  qr.submitted_at,
  qr.created_at
FROM quote_requests qr
LEFT JOIN clients c ON c.email = qr.email
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- USERS table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (auth.user_role() = 'admin');

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (auth.user_role() = 'admin');

CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (auth.user_role() = 'admin');

-- QUOTE_STATUSES policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view statuses" ON quote_statuses
  FOR SELECT USING (auth.role() = 'authenticated');

-- CLIENTS policies
CREATE POLICY "Anyone can insert clients" ON clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view clients" ON clients
  FOR SELECT USING (
    auth.user_role() IN ('admin', 'manager', 'agent', 'viewer')
  );

CREATE POLICY "Staff can update clients" ON clients
  FOR UPDATE USING (
    auth.user_role() IN ('admin', 'manager', 'agent')
  );

CREATE POLICY "Admins can delete clients" ON clients
  FOR DELETE USING (auth.user_role() = 'admin');

-- QUOTES policies
CREATE POLICY "Anyone can insert quotes" ON quotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view all quotes" ON quotes
  FOR SELECT USING (
    auth.user_role() IN ('admin', 'manager', 'viewer') OR
    assigned_to = auth.uid()
  );

CREATE POLICY "Staff can update quotes" ON quotes
  FOR UPDATE USING (
    auth.user_role() IN ('admin', 'manager') OR
    assigned_to = auth.uid()
  );

CREATE POLICY "Admins can delete quotes" ON quotes
  FOR DELETE USING (auth.user_role() = 'admin');

-- ACTIVITIES policies
CREATE POLICY "Staff can view activities" ON activities
  FOR SELECT USING (
    auth.user_role() IN ('admin', 'manager', 'agent', 'viewer')
  );

CREATE POLICY "Staff can insert activities" ON activities
  FOR INSERT WITH CHECK (
    auth.user_role() IN ('admin', 'manager', 'agent')
  );

-- NOTES policies
CREATE POLICY "Staff can view notes" ON notes
  FOR SELECT USING (
    auth.user_role() IN ('admin', 'manager', 'agent', 'viewer')
  );

CREATE POLICY "Staff can manage their own notes" ON notes
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins and managers can manage all notes" ON notes
  FOR ALL USING (
    auth.user_role() IN ('admin', 'manager')
  );

-- TASKS policies
CREATE POLICY "Staff can view tasks" ON tasks
  FOR SELECT USING (
    auth.user_role() IN ('admin', 'manager', 'viewer') OR
    assigned_to = auth.uid() OR
    created_by = auth.uid()
  );

CREATE POLICY "Staff can create tasks" ON tasks
  FOR INSERT WITH CHECK (
    auth.user_role() IN ('admin', 'manager', 'agent')
  );

CREATE POLICY "Assigned users can update their tasks" ON tasks
  FOR UPDATE USING (
    auth.user_role() IN ('admin', 'manager') OR
    assigned_to = auth.uid()
  );

-- ============================================
-- 10. TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. USEFUL VIEWS
-- ============================================

-- View for quote pipeline analytics
CREATE OR REPLACE VIEW quote_pipeline_stats AS
SELECT 
  qs.display_name as stage,
  qs.color,
  COUNT(q.id) as count,
  COALESCE(SUM(q.premium_amount), 0) as total_value,
  COALESCE(AVG(q.probability), 0) as avg_probability
FROM quote_statuses qs
LEFT JOIN quotes q ON q.status_id = qs.id
GROUP BY qs.id, qs.display_name, qs.color, qs.sort_order
ORDER BY qs.sort_order;

-- View for agent performance
CREATE OR REPLACE VIEW agent_performance AS
SELECT 
  u.id,
  u.full_name,
  u.email,
  COUNT(q.id) as total_quotes,
  COUNT(CASE WHEN qs.name = 'closed_won' THEN 1 END) as won_deals,
  COUNT(CASE WHEN qs.name = 'closed_lost' THEN 1 END) as lost_deals,
  COALESCE(SUM(CASE WHEN qs.name = 'closed_won' THEN q.premium_amount ELSE 0 END), 0) as total_revenue,
  CASE 
    WHEN COUNT(CASE WHEN qs.name IN ('closed_won', 'closed_lost') THEN 1 END) > 0
    THEN ROUND(100.0 * COUNT(CASE WHEN qs.name = 'closed_won' THEN 1 END) / 
         COUNT(CASE WHEN qs.name IN ('closed_won', 'closed_lost') THEN 1 END), 2)
    ELSE 0 
  END as win_rate
FROM users u
LEFT JOIN quotes q ON q.assigned_to = u.id
LEFT JOIN quote_statuses qs ON q.status_id = qs.id
WHERE u.role IN ('agent', 'manager')
GROUP BY u.id, u.full_name, u.email;

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Create a sample admin user (update with your email)
-- First, create this user in Supabase Authentication UI
-- Then uncomment and run the following:

-- INSERT INTO users (id, email, full_name, role)
-- SELECT id, email, 'Admin User', 'admin'
-- FROM auth.users
-- WHERE email = 'admin@insurance.com'
-- ON CONFLICT (id) DO UPDATE
-- SET role = 'admin', full_name = 'Admin User';
