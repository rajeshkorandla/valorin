# Insurance CRM Application

## Overview
A full-featured Insurance CRM application combining Expo React Native (mobile + web) for client-facing forms with Metronic-powered admin dashboard for internal sales team management. Supports Android, iOS, and web deployment with desktop-optimized admin experience.

## Business Context
- Insurance services business with partnerships with major insurance companies
- Clients submit details and request insurance quotes via mobile/web forms
- Sales team (Admins, Managers, Agents) manage quotes through pipeline stages
- Insurance types: Health, Auto, Life, Property, Business
- Quote pipeline: New Request → Contacted → Quoted → Closed Won/Lost

## Tech Stack
### Client-Facing App
- **Frontend**: Expo (React Native for Web + Mobile)
- **Navigation**: React Navigation
- **Forms**: React Native forms with validation

### Admin CRM (Desktop)
- **Framework**: Metronic Vite + React 19
- **UI**: Tailwind CSS v4, Radix UI components
- **Data Tables**: Tanstack Table with sorting/filtering
- **Charts**: ApexCharts, Recharts
- **Forms**: React Hook Form + Zod validation
- **Drag & Drop**: DnD Kit (for pipeline stages)

### Backend & Database
- **API**: Express.js (port 3000)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with role-based access
- **Storage**: Supabase (future: document uploads)

## Project Structure
```
/
├── App.js                          # Main Expo app with navigation
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── database-migrations/            # Supabase SQL migrations
│   ├── 01-crm-schema.sql          # CRM database schema
│   └── README.md                  # Migration instructions
├── server/
│   ├── index.js                   # Express.js API server
│   └── supabase.js                # Supabase client configuration
├── src/
│   ├── screens/                   # Expo screens (client-facing)
│   │   ├── HomeScreen.js
│   │   ├── ClientInfoScreen.js
│   │   ├── InsuranceQuoteScreen.js
│   │   ├── AdminLoginScreen.js
│   │   ├── AdminDashboardScreen.js
│   │   └── AdminSubmissionsScreen.js
│   ├── admin/                     # NEW: Metronic CRM (desktop admin)
│   │   ├── dashboard/             # Dashboard with analytics
│   │   ├── quotes/                # Quote pipeline management
│   │   ├── clients/               # Client directory
│   │   ├── tasks/                 # Task management
│   │   └── settings/              # Admin settings
│   ├── components/
│   │   ├── AdminNavBar.js
│   │   └── DesktopNavBar.js
│   ├── contexts/
│   │   └── AuthContext.js         # Supabase authentication
│   └── config/
│       ├── api.js
│       └── supabase.js
└── attached_assets/
    └── vite/                      # Metronic CRM components
        └── src/crm/               # CRM layout, pages, mock data
```

## Features

### Client-Facing (Mobile & Web)
1. **Home Screen**: Navigation hub for clients
2. **Client Information Form**: Personal details with validation
3. **Insurance Quote Request**: Multi-type insurance quotes (Health, Auto, Life, Property, Business)
4. **Public Submissions View**: Track submission status

### Admin CRM (Desktop ≥1024px)
1. **Dashboard**: Real-time analytics and KPIs
   - Total Quotes, Active Quotes, Coverage Value, Win Rate
   - Revenue charts and trends
   - Quote pipeline visualization
   - Recent activity feed
2. **Quotes Pipeline**: Visual deal management
   - Drag-and-drop between stages (New Request → Contacted → Quoted → Won/Lost)
   - Assignment to agents
   - Priority and probability tracking
   - Search, filter, sort functionality
3. **Client Management**: Complete client directory
   - Client profiles with quote history
   - Contact information
   - Activity timeline
4. **Tasks & Follow-ups**: Agent task management
   - Due dates and priorities
   - Quote/client associations
5. **Notes & Collaboration**: Internal notes on quotes and clients
6. **User Management**: (Admin only)
   - Create/edit users (Admins, Managers, Agents, Viewers)
   - Role-based permissions
7. **Reports & Analytics**: Performance metrics and pipeline stats

## Database Schema

### Core Tables
- **users**: CRM users with roles (admin, manager, agent, viewer)
- **clients**: Insurance clients/prospects
- **quotes**: Insurance quote requests with pipeline stages
- **quote_statuses**: Pipeline stage definitions
- **activities**: Audit trail and timeline
- **notes**: Collaborative notes
- **tasks**: Agent tasks and follow-ups

### User Roles & Permissions
| Role | Permissions |
|------|------------|
| **Admin** | Full access, user management, delete operations |
| **Manager** | View all quotes, assign to agents, edit quotes/clients |
| **Agent** | View assigned quotes, update own quotes, add notes/tasks |
| **Viewer** | Read-only access to quotes and clients |

### Quote Pipeline Stages
1. **New Request** (Blue) - Just submitted
2. **Contacted** (Purple) - Initial contact made
3. **Quoted** (Orange) - Quote provided to client
4. **Closed Won** (Green) - Deal won
5. **Closed Lost** (Red) - Deal lost

## API Endpoints

### Public (Client-Facing)
- `POST /api/client-info` - Submit client information
- `POST /api/quote-request` - Submit quote request
- `GET /api/submissions` - Get submissions (public view)

### Admin CRM (Authenticated)
- All endpoints use Supabase client with RLS policies
- Direct database access via Supabase SDK
- Role-based access enforced at database level

## Running the Project

### Development
1. **Frontend (Web)**: `npm run web` (port 5000)
2. **Backend API**: `npm run server` (port 3000)
3. **Full Stack**: `npm run dev` (runs both concurrently)

### Local Development Setup
See `LOCAL_SETUP.md` for detailed environment variable configuration.

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SESSION_SECRET` - Express session secret

## Deployment
- **Web**: Replit deployment (auto-configured)
- **Android**: Expo build for Play Store
- **iOS**: Expo build for App Store

## Database Setup

1. **Run Migration**:
   - See `database-migrations/README.md` for instructions
   - Apply `01-crm-schema.sql` in Supabase SQL Editor

2. **Create Admin User**:
   - Create user in Supabase Authentication
   - Grant admin role via SQL (see migration README)

3. **Test Connection**:
   - Verify RLS policies work correctly
   - Test role-based permissions

## Recent Changes

### November 2, 2025: Insurance CRM Implementation
- ✅ **Database Schema**: Comprehensive CRM schema with users, quotes, clients, activities, notes, tasks
- ✅ **Role-Based Access**: Admin, Manager, Agent, Viewer roles with RLS policies
- ✅ **Quote Pipeline**: 5-stage workflow (New Request → Contacted → Quoted → Won/Lost)
- ✅ **Metronic Integration**: Professional CRM UI components from Metronic Vite template
- ✅ **Migration Scripts**: SQL migrations with automatic data migration from old schema
- ✅ **Documentation**: Comprehensive README files and database setup guides

### Previous Updates
- November 1, 2025: Initial project setup with Expo and Express.js
- Admin login and basic dashboard
- Supabase authentication integration
- Client submission forms
- Cross-platform support (mobile + web)
