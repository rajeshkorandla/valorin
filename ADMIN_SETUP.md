# Admin User Setup Guide

## Quick Setup Instructions

Follow these steps to create your first admin user in Supabase:

### Step 1: Create Authentication User

1. Go to your Supabase Dashboard: [supabase.com](https://supabase.com)
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"**
4. Fill in:
   - **Email**: Your admin email (e.g., `admin@insurance.com`)
   - **Password**: Choose a secure password (save this!)
   - **Auto Confirm User**: ✅ **ENABLE THIS** (important!)
5. Click **"Create User"**

### Step 2: Run SQL Script

1. Go to **SQL Editor** in your Supabase Dashboard
2. Copy and paste this SQL (replace the email with yours):

```sql
-- Update user metadata to grant admin role
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@insurance.com';

-- Add user to admin_users table
INSERT INTO admin_users (email)
VALUES ('admin@insurance.com')
ON CONFLICT (email) DO NOTHING;

-- Verify setup
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE email = 'admin@insurance.com';
```

3. Click **"Run"**
4. You should see your user with `role: "admin"` in the results

### Step 3: Test Login

1. Go to your app's Admin Login page
2. Enter:
   - **Email**: The email you created
   - **Password**: The password you set
3. Click **"Sign In"**

You should now have access to the Admin Dashboard!

---

## Adding More Admin Users

To add additional admin users, repeat the process above with different email addresses.

## Troubleshooting

**Can't log in?**
- Make sure you enabled "Auto Confirm User" when creating the user
- Verify the SQL ran successfully and the role is set to "admin"
- Check that your SUPABASE_URL and SUPABASE_ANON_KEY secrets are correctly configured

**"Access denied" error?**
- Run the verification SQL query to confirm the user has `role: "admin"` in their metadata
- Make sure the user exists in the `admin_users` table

---

## Security Note

The admin authentication system uses Supabase's built-in security:
- Passwords are securely hashed
- Row Level Security (RLS) policies protect data
- Only users with `role: "admin"` metadata can access admin features
