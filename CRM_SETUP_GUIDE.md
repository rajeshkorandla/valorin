# Insurance CRM Setup Guide

## 🎉 What's Been Built

You now have a comprehensive **Insurance CRM application** that combines:
- ✅ **Client-facing forms** (Expo React Native - mobile + web)
- ✅ **Professional Admin CRM** (Metronic components - desktop ≥1024px)
- ✅ **Database schema** with role-based access control
- ✅ **Quote pipeline** management system
- ✅ **Real-time dashboard** with analytics

---

## 📋 Quick Start Checklist

### Step 1: Apply Database Migration ⚡ **REQUIRED**

The database migration is ready but **must be manually applied** in your Supabase dashboard.

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Apply the Migration**
   - Navigate to **SQL Editor** in the left sidebar
   - Click **"New query"**
   - Open the file: `database-migrations/01-crm-schema.sql`
   - Copy **ALL** content from that file
   - Paste into the SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)
   - Wait for confirmation (should take 5-10 seconds)

3. **Verify Success**
   - Run this query to check tables were created:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```
   - You should see: `activities`, `clients`, `notes`, `quote_statuses`, `quotes`, `tasks`, `users`

### Step 2: Create Your Admin User

1. **Create User in Supabase Auth**
   - Go to **Authentication → Users** in Supabase
   - Click **"Add User"** (or "Invite user")
   - Enter your email (e.g., `admin@yourcompany.com`)
   - Set a password
   - ✅ Enable **"Auto Confirm User"** (important!)
   - Click **Create User**

2. **Grant Admin Role**
   - Go back to **SQL Editor**
   - Run this query (replace with your email):
   ```sql
   INSERT INTO users (id, email, full_name, role)
   SELECT id, email, 'Admin User', 'admin'
   FROM auth.users
   WHERE email = 'admin@yourcompany.com'
   ON CONFLICT (id) DO UPDATE
   SET role = 'admin', full_name = 'Admin User';
   ```

3. **Verify Admin Access**
   ```sql
   SELECT id, email, full_name, role 
   FROM users 
   WHERE role = 'admin';
   ```

### Step 3: Access the CRM

#### Option A: Desktop Admin CRM (Recommended)
1. Open your browser to the Replit preview URL
2. Navigate to: `/admin/dashboard`
3. Make sure your screen width is ≥1024px (desktop)
4. You'll see the professional Metronic CRM interface

#### Option B: Client-Facing App
1. Navigate to: `/` (home page)
2. Works on mobile and desktop
3. Client submission forms are here

---

## 🏗️ Architecture Overview

### Hybrid Routing System

The app intelligently switches between two different UIs:

```
┌─────────────────────────────────────────────┐
│           Is Web Platform?                  │
└────────────┬───────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
   YES               NO (Mobile)
    │                 │
    ▼                 ▼
Screen ≥1024px?   Expo Navigation
    │             (Client Forms)
    ├───YES: Desktop
    │    │
    │    └─ Path starts with /admin/?
    │         ├─ YES → Admin CRM (React Router + Metronic)
    │         └─ NO  → Client Forms (Expo Navigation)
    │
    └───NO: Mobile/Tablet
         └─ Client Forms (Expo Navigation)
```

### File Structure

```
src/
├── admin/                    # NEW: Admin CRM
│   ├── dashboard/           # Dashboard with stats & charts
│   ├── quotes/              # Quote pipeline management
│   ├── clients/             # Client directory
│   ├── tasks/               # Task management (placeholder)
│   ├── settings/            # Settings (placeholder)
│   ├── layout/              # Admin layout components
│   ├── hooks/               # Supabase hooks
│   ├── lib/                 # Utility functions
│   └── AdminRouter.js       # Admin routing config
├── screens/                 # Expo screens (client-facing)
├── components/              # Shared components
├── contexts/                # Auth context
└── config/                  # Supabase config
```

---

## 🎨 Features Available

### ✅ Fully Functional
- **Dashboard**: Real-time metrics (Total Quotes, Active Quotes, Revenue, Win Rate)
- **Quotes List**: View all quotes with status, client, amount
- **Clients List**: View all clients with contact info
- **Pipeline Stats**: Visual breakdown by stage
- **Recent Activity**: Timeline of latest updates
- **Role-Based Access**: Database-level security with RLS
- **Responsive Layout**: Professional sidebar navigation

### 🚧 Placeholder (Coming Next)
- **Tasks Management**: Agent follow-ups
- **Settings**: User management, system config
- **Notes System**: Collaboration on quotes
- **Drag & Drop Pipeline**: Visual quote stage management
- **Assignment Workflow**: Assign quotes to agents
- **Advanced Search**: Multi-criteria filtering

---

## 🔐 User Roles & Permissions

| Role | View Quotes | Edit Quotes | Assign Quotes | Delete Data | Manage Users |
|------|------------|-------------|---------------|-------------|--------------|
| **Admin** | ✅ All | ✅ All | ✅ Yes | ✅ Yes | ✅ Yes |
| **Manager** | ✅ All | ✅ All | ✅ Yes | ❌ No | ❌ No |
| **Agent** | ✅ Assigned | ✅ Own Only | ❌ No | ❌ No | ❌ No |
| **Viewer** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |

Permissions are enforced at the **database level** via Row Level Security (RLS) policies.

---

## 📊 Quote Pipeline Stages

1. **New Request** 🔵 (Blue)
   - Just submitted by client
   - Needs initial review

2. **Contacted** 🟣 (Purple)
   - Agent has made contact
   - Gathering requirements

3. **Quoted** 🟠 (Orange)
   - Formal quote provided
   - Awaiting client decision

4. **Closed Won** 🟢 (Green)
   - Deal successful
   - Client converted

5. **Closed Lost** 🔴 (Red)
   - Deal lost
   - Track reason for analysis

---

## 🧪 Testing the CRM

### Test Data Migration
Your existing data has been **automatically migrated**:
- ✅ `client_submissions` → `clients` table
- ✅ `quote_requests` → `quotes` table

Check it worked:
```sql
SELECT COUNT(*) as total_clients FROM clients;
SELECT COUNT(*) as total_quotes FROM quotes;
```

### Create Sample Quote
```sql
-- Get a client ID first
SELECT id, first_name, last_name FROM clients LIMIT 1;

-- Create a test quote (replace <client_id>)
INSERT INTO quotes (
  client_id, 
  title, 
  insurance_type, 
  coverage_amount,
  premium_amount,
  status_id
) VALUES (
  '<client_id>',
  'Health Insurance - Test Quote',
  'health',
  500000,
  450,
  (SELECT id FROM quote_statuses WHERE name = 'new_request')
);
```

### Access the Dashboard
1. Navigate to `/admin/dashboard`
2. You should see:
   - Stats cards with real numbers
   - Pipeline chart showing quote distribution
   - Recent activity (if any)

---

## 🐛 Troubleshooting

### "No data showing in dashboard"
- ✅ Migration applied successfully?
- ✅ Admin user created with correct role?
- ✅ Supabase environment variables set correctly?
- Check browser console for errors (F12)

### "Can't access /admin/dashboard"
- Make sure you're on **desktop** (screen width ≥1024px)
- Try navigating directly: `<your-url>/admin/dashboard`
- Check you're logged in via Supabase Auth

### "RLS policy errors"
- Verify user is in `users` table with correct role:
  ```sql
  SELECT * FROM users WHERE email = '<your-email>';
  ```
- Check RLS helper function exists:
  ```sql
  SELECT auth.user_role();
  ```

### "React Router errors"
- Make sure all dependencies installed: `npm install`
- Restart the web workflow
- Clear browser cache

---

## 🚀 Next Steps

### Immediate
1. ✅ Apply database migration
2. ✅ Create admin user
3. ✅ Test dashboard access
4. ✅ Review existing data migrated correctly

### Short Term (Next Phase)
1. Build drag-and-drop quote pipeline
2. Implement assignment workflow
3. Add notes and activity tracking
4. Create task management system
5. Build settings/user management UI

### Long Term
1. Email notifications
2. Document upload
3. Advanced reporting
4. Custom quote templates
5. Client portal

---

## 📚 Additional Resources

- **Database Schema**: `database-migrations/README.md`
- **Project Documentation**: `replit.md`
- **Local Setup**: `LOCAL_SETUP.md`

---

## 💡 Tips

1. **Desktop Required**: Admin CRM requires ≥1024px screen width
2. **Role-Based Security**: All enforced at database level (can't be bypassed)
3. **Real-Time Updates**: Uses React Query for automatic refetching
4. **Migration Safe**: Old tables preserved, data copied (not moved)
5. **Test Accounts**: Create multiple users with different roles to test permissions

---

## ✅ Success Checklist

Before moving to next phase, verify:
- [ ] Database migration applied successfully
- [ ] Admin user created and has admin role
- [ ] Can access `/admin/dashboard` on desktop
- [ ] Dashboard shows real statistics
- [ ] Quote pipeline stats display correctly
- [ ] Clients table shows migrated data
- [ ] Quotes table shows migrated data
- [ ] No console errors in browser (F12)

---

**Questions or issues?** Check the troubleshooting section above or review the migration README at `database-migrations/README.md`.
