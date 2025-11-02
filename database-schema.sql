-- Insurance Services App Database Schema
-- Run this in your Supabase SQL Editor to create the required tables

-- Client submissions table
CREATE TABLE IF NOT EXISTS client_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  insurance_type TEXT NOT NULL CHECK (insurance_type IN ('health', 'auto', 'life', 'property', 'business')),
  coverage_amount TEXT,
  additional_info TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_client_submissions_email ON client_submissions(email);
CREATE INDEX IF NOT EXISTS idx_client_submissions_submitted_at ON client_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_submitted_at ON quote_requests(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_insurance_type ON quote_requests(insurance_type);

-- Enable Row Level Security (RLS)
ALTER TABLE client_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for client submissions
-- Allow anyone to insert (for public form submissions)
CREATE POLICY "Anyone can insert client submissions" ON client_submissions
  FOR INSERT WITH CHECK (true);

-- Only admins can view, update, delete
CREATE POLICY "Admins can view all client submissions" ON client_submissions
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE email IN (SELECT email FROM admin_users))
  );

CREATE POLICY "Admins can update client submissions" ON client_submissions
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE email IN (SELECT email FROM admin_users))
  );

CREATE POLICY "Admins can delete client submissions" ON client_submissions
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE email IN (SELECT email FROM admin_users))
  );

-- Create policies for quote requests
-- Allow anyone to insert (for public form submissions)
CREATE POLICY "Anyone can insert quote requests" ON quote_requests
  FOR INSERT WITH CHECK (true);

-- Only admins can view, update, delete
CREATE POLICY "Admins can view all quote requests" ON quote_requests
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE email IN (SELECT email FROM admin_users))
  );

CREATE POLICY "Admins can update quote requests" ON quote_requests
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE email IN (SELECT email FROM admin_users))
  );

CREATE POLICY "Admins can delete quote requests" ON quote_requests
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE email IN (SELECT email FROM admin_users))
  );

-- Admin users policies
CREATE POLICY "Only admins can view admin users" ON admin_users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE email IN (SELECT email FROM admin_users))
  );

-- Insert a default admin user (replace with your email)
-- You'll need to create this user in Supabase Authentication first
-- Then run: INSERT INTO admin_users (email) VALUES ('your-email@example.com');

-- ============================================
-- ADMIN USER SETUP INSTRUCTIONS
-- ============================================

-- Step 1: Create a user in Supabase Authentication
-- Go to Authentication > Users > Add User
-- Set email and password, enable "Auto Confirm User"

-- Step 2: Update the user's metadata to grant admin role
-- Replace 'admin@insurance.com' with your actual admin email
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@insurance.com';

-- Step 3: Add the user to admin_users table
INSERT INTO admin_users (email)
VALUES ('admin@insurance.com')
ON CONFLICT (email) DO NOTHING;

-- Verify the admin user was set up correctly:
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE email = 'admin@insurance.com';
