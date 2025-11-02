# Local Development Setup Guide

This guide will help you run the Insurance Services app on your local laptop for development.

## Prerequisites

Make sure you have these installed on your computer:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

## Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all the necessary packages.

## Step 2: Set Up Environment Variables

The app needs access to your Supabase database. Follow these steps:

### 2.1 Create a .env file

In the **root folder** of the project (same location as `package.json`), create a new file named `.env`:

```bash
# On Mac/Linux
touch .env

# On Windows (in Command Prompt)
type nul > .env
```

### 2.2 Get Your Supabase Credentials

1. Go to your Supabase project dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click on your **Insurance Services** project
3. Go to **Settings** → **API**
4. You'll find:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Click "Reveal" to see it

### 2.3 Add Credentials to .env File

Open the `.env` file you just created and add your credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SESSION_SECRET=any-random-string-here-for-session-security
```

**Replace** the values with your actual Supabase credentials from step 2.2.

**Important:** 
- Never commit this `.env` file to Git (it's already in `.gitignore`)
- Never share these credentials publicly

## Step 3: Start the Development Servers

You need to run **two servers** - the backend API and the frontend web app.

### Option A: Run Both Servers Together

Open **one terminal** and run:

```bash
npm run dev
```

This will start both:
- Backend API on `http://localhost:3000`
- Frontend Web App on `http://localhost:5000`

### Option B: Run Servers Separately

If you prefer to run them in separate terminals:

**Terminal 1 - Backend API:**
```bash
node server/index.js
```

**Terminal 2 - Frontend Web App:**
```bash
EXPO_PUBLIC_SUPABASE_URL=$SUPABASE_URL EXPO_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY npx expo start --web --port 5000
```

## Step 4: Access the App

Open your web browser and go to:

```
http://localhost:5000
```

You should see the Insurance Services homepage!

## Step 5: Set Up Admin Access (Optional)

If you want to test the admin panel locally, follow the instructions in `ADMIN_SETUP.md` to create an admin user in your Supabase database.

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solution:** Make sure your `.env` file exists in the root folder and contains the correct `SUPABASE_URL` and `SUPABASE_ANON_KEY` values.

### Error: "Port 5000 is already in use"

**Solution:** Another application is using port 5000. Either:
1. Stop the other application
2. Or change the port in the command:
   ```bash
   npx expo start --web --port 8080
   ```

### Error: "Module not found" or "Cannot find package"

**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

### Changes aren't showing up in the browser

**Solution:** 
1. Stop the server (Ctrl+C)
2. Clear the cache: `npx expo start --web --clear --port 5000`
3. Hard refresh your browser (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)

## Testing on Mobile Devices (Optional)

### iOS Simulator (Mac only)

```bash
npx expo start
# Press 'i' to open iOS simulator
```

### Android Emulator

```bash
npx expo start
# Press 'a' to open Android emulator
```

### Physical Device

1. Install **Expo Go** app from:
   - iOS: App Store
   - Android: Google Play Store

2. Run:
   ```bash
   npx expo start
   ```

3. Scan the QR code with:
   - **iOS:** Camera app
   - **Android:** Expo Go app

## Development Tips

1. **Hot Reload:** The app automatically refreshes when you save code changes
2. **Console Logs:** Check your terminal for server logs and browser console for frontend logs
3. **Database Changes:** Use Supabase dashboard to view/edit data during development
4. **Environment Variables:** If you change `.env`, restart the servers

## Next Steps

- Read `README.md` for project overview
- Check `ADMIN_SETUP.md` for admin user setup
- Review `database-schema.sql` to understand the database structure
- Explore the code in `src/` folder

## Need Help?

If you encounter issues not covered here:
1. Check the browser console for error messages
2. Check the terminal where servers are running for error logs
3. Verify your Supabase credentials are correct
4. Make sure your Supabase database has the correct tables (see `database-schema.sql`)

Happy coding!
