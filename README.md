# Insurance Services App

A cross-platform mobile and web application built with Expo React Native for insurance services businesses. This app enables clients to submit their information and request insurance quotes from multiple insurance companies.

## Features

### Client-Facing Features
- **Client Information Form**: Comprehensive form to capture client details
  - Personal information (name, email, phone, date of birth)
  - Address details (street, city, state, ZIP code)
  - Real-time form validation
  
- **Insurance Quote Requests**: Request quotes for various insurance types
  - Health Insurance
  - Auto Insurance
  - Life Insurance
  - Property Insurance
  - Business Insurance
  - Coverage amount specification
  - Additional information field

- **Submissions Viewer**: View all submitted forms and quote requests
  - Client information submissions
  - Quote requests with status
  - Timestamp tracking
  - Pull-to-refresh functionality

### Admin Panel Features
- **Secure Admin Authentication**: Login system powered by Supabase Auth
- **Admin Dashboard**: Overview with statistics and quick actions
  - Total client submissions count
  - Total quote requests count
  - Overall submission tracking
- **Submissions Management**: Full CRUD operations for admin users
  - View all client information submissions
  - View all quote requests
  - Search and filter submissions
  - Delete submissions
  - Pull-to-refresh functionality

### Technical Features
- Cross-platform support (Android, iOS, and Web)
- Professional insurance-themed UI design
- Client-side and server-side form validation
- Responsive design for all screen sizes
- **Supabase PostgreSQL database** for persistent storage
- **Supabase Authentication** for admin panel security
- RESTful API backend

## Tech Stack

- **Frontend**: Expo (React Native for Web + Mobile)
- **Navigation**: React Navigation
- **Backend**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager
- A Supabase account (free tier works fine)

### Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install
```

3. Install dotenv for local development:
```bash
npm install dotenv
```

### Setting Up Supabase

1. **Create a Supabase Project**
   - Go to https://supabase.com and sign up
   - Create a new project
   - Wait for the project to initialize (~2 minutes)

2. **Set Up Database Tables**
   - In Supabase dashboard, go to **SQL Editor**
   - Open the `database-schema.sql` file from this project
   - Copy and paste the SQL into the editor
   - Click **Run** to create the tables

3. **Get Your API Credentials**
   - Go to **Settings** → **API** in Supabase dashboard
   - Copy these values:
     - **Project URL** (your `SUPABASE_URL`)
     - **anon/public key** (your `SUPABASE_ANON_KEY`)
     - **service_role key** (your `SUPABASE_SERVICE_ROLE_KEY`)

4. **Create Environment Variables**
   
   **For Local Development (on your laptop):**
   - Create a `.env` file in the root directory:
   ```bash
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   SESSION_SECRET=any-random-string-here
   ```
   
   **For Replit:**
   - Open **Tools** → **Secrets** in Replit
   - Add the same keys (without the `.env` file)

### Running the Application

#### For Web Development (Local Laptop)
Start the backend server:
```bash
node server/index.js
```

In a new terminal, start the frontend:
```bash
npm run web
```
The web app will be available at `http://localhost:5000`

#### For Mobile Development (Android)
```bash
npm run android
```
Requires Android Studio and an Android emulator or physical device.

#### For Mobile Development (iOS)
```bash
npm run ios
```
Requires Xcode (macOS only) and an iOS simulator or physical device.

#### Backend API Server
The backend API runs automatically via the configured workflow on port 3000.
To run manually:
```bash
npm run server
```

## Project Structure

```
/
├── App.js                            # Main app entry with navigation setup
├── app.json                          # Expo configuration
├── package.json                      # Dependencies and scripts
├── database-schema.sql               # Database schema for Supabase
├── server/
│   ├── index.js                      # Express.js API server
│   └── supabase.js                   # Supabase client configuration
└── src/
    ├── config/
    │   ├── api.js                    # API configuration and endpoints
    │   └── supabase.js               # Supabase client for frontend
    ├── contexts/
    │   └── AuthContext.js            # Authentication context provider
    └── screens/
        ├── HomeScreen.js             # Home screen with navigation
        ├── ClientInfoScreen.js       # Client information form
        ├── InsuranceQuoteScreen.js   # Insurance quote request form
        ├── SubmissionsScreen.js      # View submissions
        ├── AdminLoginScreen.js       # Admin login screen
        ├── AdminDashboardScreen.js   # Admin dashboard
        └── AdminSubmissionsScreen.js # Admin submissions management
```

## Admin Panel Access

### Setting Up Admin Users
To access the admin panel, you must create an admin user with the proper admin role in your Supabase project. **Admin access is granted ONLY to users with `"role": "admin"` in their metadata.**

#### Method 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Users
3. Click "Add User" and create an account with your desired email and password
4. After creating the user, click on the user in the list to edit
5. Scroll to the "User Metadata" or "App Metadata" section
6. Add the admin role to the metadata JSON:
   ```json
   {
     "role": "admin"
   }
   ```
7. Save the changes

#### Method 2: Using Supabase SQL Editor (Easiest!)
Since Supabase doesn't have a UI button to edit user metadata, use the SQL Editor instead:

1. Go to **SQL Editor** in your Supabase dashboard (left sidebar)
2. Click "New query"
3. Run this SQL query to grant admin role to a user:
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin@example.com';
```

**Important**: Replace `'your-admin@example.com'` with the actual email address of the user you want to make an admin.

**Verify it worked:**
```sql
SELECT email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'your-admin@example.com';
```
You should see `{"role": "admin"}` in the result.

### Accessing the Admin Panel
1. From the home screen, scroll to the bottom and click "🔐 Admin Login"
2. Enter your admin email and password
3. Once logged in, you'll have access to:
   - **Dashboard**: View submission statistics
   - **Manage Submissions**: View, search, and delete client and quote submissions

**Security Note**: 
- Only users with `"role": "admin"` in their user_metadata or app_metadata can access admin endpoints
- Regular users cannot access the admin panel even if they create an account
- Admin role must be explicitly set via Supabase Dashboard or SQL - there are no shortcuts or bypasses
- For maximum security, disable public signups in Supabase (Authentication → Settings → Auth Providers → Disable "Enable Email Signup")

## API Endpoints

### Backend API (Port 3000)

- **POST** `/api/client-info` - Submit client information
  - Required fields: firstName, lastName, email, phone, address, city, state, zipCode
  - Optional fields: dateOfBirth
  - Stores data in Supabase `client_submissions` table
  
- **POST** `/api/quote-request` - Submit insurance quote request
  - Required fields: fullName, email, phone, insuranceType
  - Optional fields: coverageAmount, additionalInfo
  - Stores data in Supabase `quote_requests` table
  
- **GET** `/api/submissions` - Retrieve all submissions
  - Returns: clientSubmissions and quoteRequests arrays from Supabase database

## Deployment

### Web Deployment
This app is ready to deploy to the web using Replit's deployment feature:

1. Click the "Publish" button in your Replit workspace
2. Choose "Deploy to production"
3. Your app will be available at a public URL

### Mobile App Deployment

#### Android (Google Play Store)
1. Build the Android app bundle:
```bash
eas build --platform android
```

2. Follow the [Expo EAS Build documentation](https://docs.expo.dev/build/introduction/) for detailed steps

#### iOS (Apple App Store)
1. Build the iOS app:
```bash
eas build --platform ios
```

2. Follow the [Expo EAS Build documentation](https://docs.expo.dev/build/introduction/) for detailed steps

**Note**: Mobile app deployment requires an Expo account and EAS Build setup.

## Database Setup

This application uses Supabase as the database backend. To set up:

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Run the SQL from `database-schema.sql` in the Supabase SQL Editor to create tables
4. Get your project credentials from Settings → API
5. Add the following environment variables:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_ANON_KEY`: Your anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep secret!)

The app will automatically connect to your Supabase database.

## Future Enhancements

### Planned Features
- Document upload functionality for supporting documents
- Email notifications on form submission
- Client portal to track submission status
- Different form types for various insurance categories
- Integration with insurance company APIs
- Payment processing integration
- Multi-language support
- Advanced analytics and reporting in admin panel
- Export submissions to CSV/PDF
- Automated quote generation

## Browser Compatibility

The web version is compatible with:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Mobile Compatibility

- iOS 13.4 or higher
- Android 6.0 (API 23) or higher

## Support

For issues or questions about this application, please contact your development team.

## License

Proprietary - All rights reserved
