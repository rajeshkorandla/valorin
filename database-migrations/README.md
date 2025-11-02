# Database Migrations

## Overview
This directory contains SQL migration files for the Insurance CRM database schema.

## Migration Files

### `01-crm-schema.sql` - Insurance CRM Schema
Comprehensive database schema that adds full CRM functionality to the insurance app.

**What it creates:**
- ✅ **Users table** with role-based access (Admin, Manager, Agent, Viewer)
- ✅ **Quote pipeline stages** (New Request → Contacted → Quoted → Closed Won/Lost)
- ✅ **Enhanced clients table** with additional fields
- ✅ **Quotes table** with pipeline management, assignments, and deal tracking
- ✅ **Activities table** for timeline/audit trail
- ✅ **Notes table** for collaboration
- ✅ **Tasks table** for agent follow-ups
- ✅ **Row Level Security (RLS)** policies for role-based permissions
- ✅ **Automatic timestamps** with triggers
- ✅ **Analytics views** for reporting

**What it migrates:**
- Existing `client_submissions` → `clients` table
- Existing `quote_requests` → `quotes` table (preserves all data)

## How to Apply Migrations

### Step 1: Backup Your Data
Before running any migrations, **always backup your Supabase database**:
1. Go to your Supabase Dashboard
2. Navigate to Database → Backups
3. Create a manual backup

### Step 2: Run the Migration
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Create a new query
4. Copy the contents of `01-crm-schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 3: Create Your First Admin User
After the migration runs successfully:

1. **Create a user in Supabase Authentication:**
   - Go to **Authentication → Users**
   - Click **Add User**
   - Enter email: `admin@insurance.com` (or your email)
   - Set a password
   - Enable **Auto Confirm User**
   - Click **Create User**

2. **Grant admin role to the user:**
   - Go back to **SQL Editor**
   - Run this query (replace with your email):
   ```sql
   INSERT INTO users (id, email, full_name, role)
   SELECT id, email, 'Admin User', 'admin'
   FROM auth.users
   WHERE email = 'admin@insurance.com'
   ON CONFLICT (id) DO UPDATE
   SET role = 'admin', full_name = 'Admin User';
   ```

3. **Verify the setup:**
   ```sql
   SELECT * FROM users WHERE role = 'admin';
   ```

### Step 4: Verify Migration Success
Run these queries to confirm everything is set up correctly:

```sql
-- Check all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check quote statuses
SELECT * FROM quote_statuses ORDER BY sort_order;

-- Check migrated data
SELECT COUNT(*) as total_clients FROM clients;
SELECT COUNT(*) as total_quotes FROM quotes;

-- View pipeline stats
SELECT * FROM quote_pipeline_stats;
```

## Database Schema

### Core Tables

#### `users`
Manages all CRM users with role-based access control.
- **Roles:** admin, manager, agent, viewer
- Links to Supabase `auth.users`

#### `clients`
Insurance clients/prospects.
- Migrated from `client_submissions`
- Enhanced with company, source, notes fields

#### `quotes`
Insurance quote requests with pipeline management.
- Replaces `quote_requests` with enhanced functionality
- Includes status tracking, assignments, premium amounts
- Links to clients and assigned agents

#### `quote_statuses`
Pipeline stages for the quote workflow.
- Default stages: New Request, Contacted, Quoted, Closed Won, Closed Lost
- Customizable colors and order

#### `activities`
Audit trail and timeline for all quote/client interactions.
- Tracks status changes, notes, emails, calls, meetings
- Full activity history

#### `notes`
Collaborative notes on quotes and clients.
- Can be pinned for importance
- Linked to specific quotes or clients

#### `tasks`
Agent tasks and follow-ups.
- Assigned to specific users
- Linked to quotes/clients
- Due dates and priorities

## Row Level Security (RLS)

All tables have RLS policies based on user roles:

### Permission Matrix

| Action | Admin | Manager | Agent | Viewer |
|--------|-------|---------|-------|--------|
| View all quotes | ✅ | ✅ | Own only | ✅ |
| Edit quotes | ✅ | ✅ | Own only | ❌ |
| Delete quotes | ✅ | ❌ | ❌ | ❌ |
| Assign quotes | ✅ | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ |
| View clients | ✅ | ✅ | ✅ | ✅ |
| Edit clients | ✅ | ✅ | ✅ | ❌ |

## Useful Analytics Views

### `quote_pipeline_stats`
Real-time pipeline metrics by stage:
```sql
SELECT * FROM quote_pipeline_stats;
```

### `agent_performance`
Agent performance metrics:
```sql
SELECT * FROM agent_performance;
```

## Troubleshooting

### Migration Errors
If you encounter errors:
1. Check the error message in the SQL Editor
2. Ensure you have proper permissions
3. Verify existing tables don't conflict
4. Check that the `auth.users` table exists

### RLS Policy Errors
If users can't see data:
1. Verify user is in `users` table with correct role
2. Check RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
3. Test with: `SELECT auth.uid(), auth.user_role();`

### Need to Rollback?
If you need to undo the migration:
```sql
-- WARNING: This will delete all CRM data!
DROP VIEW IF EXISTS agent_performance CASCADE;
DROP VIEW IF EXISTS quote_pipeline_stats CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS quote_statuses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS auth.user_role() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

## Next Steps

After running the migration:
1. ✅ Create admin users
2. ✅ Add sample data (optional)
3. ✅ Test role-based permissions
4. ✅ Configure the frontend to use new tables
5. ✅ Update API endpoints to work with new schema
