# User Module Documentation

## Overview

The User Module provides comprehensive user management capabilities aligned with the Valorin Insurance role structure, supporting five distinct user types with granular permissions.

---

## User Roles

### 1. **Admin** (System Administrator)
- **Full system access** with all permissions
- Can create, edit, and delete users
- Manage roles and permissions
- Configure system settings and integrations
- Access all reports and analytics

### 2. **Employee** (Internal Staff)
- Account Managers, Underwriters, Sales, Service Teams
- CRM management (clients, quotes, workflows)
- Task and workflow management
- Billing and commission access
- Document management
- Communications (chat, VOIP, WhatsApp)

### 3. **Client** (Policyholder)
- Self-service policy management
- View policies, payments, claims
- Request Certificates of Insurance (COI)
- Upload documents
- Make payments
- Limited to own data only

### 4. **Vendor** (MGA/Carrier Partner)
- View shared policies and commission data
- Upload compliance documents
- Connect API integrations
- Vendor-specific dashboard
- Limited to vendor-related data

### 5. **System** (Automation Bot)
- Automated processes and AI operations
- Background service access
- Workflow automation
- Cross-selling analytics
- System-level permissions

---

## Database Schema

### **Users Table** (Enhanced)
```sql
id                    UUID PRIMARY KEY
email                 TEXT UNIQUE NOT NULL
full_name             TEXT
role                  TEXT (admin, employee, client, vendor, system)
department            TEXT
job_title             TEXT
employee_id           TEXT UNIQUE
vendor_company_name   TEXT
vendor_type           TEXT (mga, carrier, partner)
permissions           JSONB
status                TEXT (active, inactive, suspended)
is_active             BOOLEAN
last_login            TIMESTAMP
timezone              TEXT
preferred_language    TEXT
phone                 TEXT
avatar_url            TEXT
created_at            TIMESTAMP
updated_at            TIMESTAMP
```

### **Departments Table**
- Tracks organizational departments
- Assigns department managers
- Default departments: Sales, Account Management, Underwriting, Claims, Administration, IT, Finance

### **User Permissions Table**
- Individual user permission assignments
- Overrides role-based permissions
- Tracks who granted permissions and when

### **Role Permissions Table**
- Maps permissions to roles
- Defines what each role can do system-wide
- Pre-configured with default permissions

### **User Activity Log**
- Tracks all user actions
- Stores IP addresses and user agents
- Audit trail for compliance

---

## Features Implemented

### ✅ **User List/Directory Page**
- **Location**: `/admin/users`
- Search users by name, email, or employee ID
- Filter by role (Admin, Employee, Client, Vendor, System)
- Filter by status (Active, Inactive, Suspended)
- Stats cards showing:
  - Total Users
  - Active Users
  - Employees
  - Clients
- Table view with:
  - User info (avatar, name, email, phone)
  - Role badge with color coding
  - Department/company info
  - Status indicator
  - Last login date
  - Action buttons (Edit, Delete)

### ✅ **Add/Edit User Form**
- **Location**: `/admin/users/new` (create) or `/admin/users/:id/edit` (edit)
- **Basic Information**:
  - Full Name
  - Email
  - Phone
- **Role & Permissions**:
  - Role selection (Admin, Employee, Client, Vendor, System)
  - Role descriptions
  - Status (Active, Inactive, Suspended)
- **Employment Details** (for Employee/Admin):
  - Employee ID
  - Job Title
  - Department selection
- **Vendor Details** (for Vendor):
  - Company Name
  - Vendor Type (MGA, Carrier, Partner)
- **Preferences**:
  - Timezone
  - Preferred Language

### ✅ **Data Hooks (Supabase Integration)**
- `useUsers(filters)` - Get filtered user list
- `useUser(userId)` - Get single user
- `useCreateUser()` - Create new user
- `useUpdateUser()` - Update user
- `useDeleteUser()` - Delete user
- `useDepartments()` - Get departments list
- `useUserPermissions(userId)` - Get user-specific permissions
- `useRolePermissions(role)` - Get role-based permissions
- `useUserActivityLog(userId)` - Get user activity history

---

## Permission System

### Permission Keys Format
Permissions use dot notation: `resource.action`

Examples:
- `clients.view` - View clients
- `quotes.edit` - Edit quotes
- `users.delete` - Delete users
- `system.configure` - Configure system
- `billing.manage` - Manage billing

### Role-Based Permissions (Pre-configured)

**Admin:**
- `users.*` (all user operations)
- `roles.manage`
- `system.configure`
- `integrations.manage`
- All other permissions

**Employee:**
- `clients.view/create/edit`
- `quotes.view/create/edit`
- `tasks.view/create`
- `documents.view/upload`
- `communications.send`
- `dashboard.view`

**Client:**
- `policies.view` (own only)
- `documents.view/upload` (own only)
- `payments.view/make`
- `coi.request`
- `profile.edit` (own only)

**Vendor:**
- `policies.view` (shared only)
- `commissions.view`
- `documents.view/upload`
- `integrations.connect`
- `dashboard.view`

**System:**
- `all` (full access for automation)

### Helper Functions

**`public.user_role()`**
- Returns current user's role
- Used in RLS policies
- Security definer function

**`public.has_permission(permission_key)`**
- Checks if current user has specific permission
- Combines role-based and individual permissions
- Returns boolean

**`public.log_user_activity(action, resource_type, resource_id, details)`**
- Logs user actions for audit trail
- Automatically captures user_id
- Returns activity ID

---

## Row Level Security (RLS)

### Users Table Policies
- Users can view their own profile
- Admins can manage all users
- Employees can view other employees and clients
- Vendors can only view their own profile

### Departments Policies
- All authenticated users can view departments
- Only admins can manage departments

### Permissions Policies
- Users can view their own permissions
- Admins can manage all permissions

### Activity Log Policies
- Users can view their own activity
- Admins can view all activity
- Any authenticated user can log their own activity

---

## UI Components

### **UsersPage** (`src/admin/users/UsersPage.js`)
Main user directory with search, filters, and table view.

**Props**: None
**Features**:
- Real-time search
- Multi-filter support
- Inline delete confirmation
- Color-coded role and status badges
- Responsive table layout

### **UserFormPage** (`src/admin/users/UserFormPage.js`)
Create/edit user form with dynamic fields based on role.

**Props**: None (uses `useParams()` for edit mode)
**Features**:
- Auto-populates fields in edit mode
- Role-specific fields (employee vs vendor)
- Validation
- Success/error handling

---

## Usage Examples

### Creating a New Employee
1. Navigate to `/admin/users`
2. Click "Add User"
3. Fill in:
   - Full Name: "John Smith"
   - Email: "john.smith@company.com"
   - Phone: "+1 (555) 123-4567"
   - Role: Employee
   - Employee ID: "EMP-001"
   - Job Title: "Account Manager"
   - Department: "Sales"
   - Status: Active
4. Click "Create User"

### Creating a Vendor
1. Click "Add User"
2. Select Role: "Vendor"
3. Fill in:
   - Full Name: "Jane Doe"
   - Email: "jane@mga-company.com"
   - Company Name: "MGA Company Inc."
   - Vendor Type: "MGA"
4. Click "Create User"

### Filtering Users
- Use search bar for quick text search
- Click role filters to see specific user types
- Click status filters to see active/inactive users
- Filters combine (AND logic)

---

## Integration with Other Modules

### CRM Module
- Assign quotes to employees
- Track client account managers
- View user activity on client records

### Task Module
- Assign tasks to users by role
- Filter tasks by assigned user
- Track user task completion

### Billing Module
- Track commission by employee
- Vendor commission reports
- Payment approvals by role

---

## Next Steps (Future Enhancements)

### Phase 2 - User Profile View
- Detailed user profile page
- Activity timeline
- Assigned resources (quotes, clients, tasks)
- Performance metrics
- Edit inline

### Phase 3 - Advanced Permissions
- Custom permission sets
- Permission groups
- Temporary permission grants
- Permission audit log

### Phase 4 - User Management Features
- Bulk user import/export
- User deactivation workflow
- Password reset functionality
- 2FA/MFA setup
- Session management
- IP whitelisting

---

## API Reference

### useUsers(filters)
```javascript
const { data: users, isLoading } = useUsers({
  role: 'employee',    // Optional
  status: 'active',    // Optional
  department: 'Sales'  // Optional
});
```

### useCreateUser()
```javascript
const createUser = useCreateUser();

await createUser.mutateAsync({
  email: 'user@example.com',
  full_name: 'User Name',
  role: 'employee',
  department: 'Sales',
  status: 'active'
});
```

### useUpdateUser()
```javascript
const updateUser = useUpdateUser();

await updateUser.mutateAsync({
  id: userId,
  data: {
    job_title: 'Senior Account Manager',
    department: 'Account Management'
  }
});
```

### useDeleteUser()
```javascript
const deleteUser = useDeleteUser();

await deleteUser.mutateAsync(userId);
```

---

## Testing Checklist

Before deploying to production:

- [ ] Apply database migration (`02-user-module.sql`)
- [ ] Create test users for each role
- [ ] Verify RLS policies work correctly
- [ ] Test permission checks
- [ ] Test search and filters
- [ ] Test create/edit/delete operations
- [ ] Verify activity logging
- [ ] Test role-specific field visibility
- [ ] Check responsive design
- [ ] Verify navigation works

---

## Troubleshooting

### "No users found" with existing users
- Check if RLS policies are enabled
- Verify current user has permissions to view users
- Check database migration was applied successfully

### Permission errors
- Verify `public.user_role()` function exists
- Check role_permissions table has default data
- Ensure user's role is correctly set

### Can't create users
- Verify admin permissions
- Check unique constraints (email, employee_id)
- Review Supabase error messages

---

## Security Considerations

1. **Never expose password fields** - Handle authentication via Supabase Auth
2. **Validate email addresses** - Prevent duplicate accounts
3. **Audit all user changes** - Use activity log
4. **Regular permission reviews** - Quarterly access audits
5. **Deactivate instead of delete** - Preserve audit trail
6. **Strong password policies** - Enforce via Supabase Auth settings
7. **Monitor failed login attempts** - Implement rate limiting
8. **Regular security training** - For all admin users

---

## Support

For issues or questions:
1. Check this documentation
2. Review database migration README
3. Check Supabase logs for errors
4. Review RLS policies in Supabase dashboard
5. Check user_activity_log for audit trail

---

**Last Updated**: November 2, 2025
**Version**: 1.0
**Module Status**: ✅ Complete (Phase 1)
