# Insurance Services App

## Overview
An Expo React Native + Web application for an insurance services business that provides form submissions for clients. The app is deployable to Android, iOS, and web platforms.

## Business Context
- Business provides insurance services to different clients
- Has partnerships with major insurance companies
- Clients can submit their details and request insurance quotes
- Insurance types: Health, Auto, Life, Property, Business

## Tech Stack
- **Frontend**: Expo (React Native for Web + Mobile)
- **Navigation**: React Navigation
- **Backend**: Express.js API (port 3000)
- **Data Storage**: In-memory storage (MVP phase)

## Project Structure
```
/
├── App.js                          # Main app with navigation
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── server/
│   └── index.js                    # Express.js API server
└── src/
    ├── screens/
    │   ├── HomeScreen.js           # Home screen with navigation cards
    │   ├── ClientInfoScreen.js     # Client information form
    │   ├── InsuranceQuoteScreen.js # Insurance quote request form
    │   └── SubmissionsScreen.js    # View all submissions
    └── components/                 # (Future: Reusable components)
```

## Features (MVP)
1. **Home Screen**: Navigation hub with cards for different actions
2. **Client Information Form**: Captures client personal details with validation
   - Name, email, phone, date of birth
   - Address (street, city, state, ZIP)
   - Form validation with error messages
3. **Insurance Quote Request**: Request quotes for different insurance types
   - Select insurance type (Health, Auto, Life, Property, Business)
   - Coverage amount and additional information
   - Form validation
4. **Submissions View**: Display all submitted forms
   - Client information submissions
   - Quote requests with status

## API Endpoints
- `POST /api/client-info` - Submit client information
- `POST /api/quote-request` - Submit quote request
- `GET /api/submissions` - Get all submissions

## Running the Project
1. **Frontend (Web)**: `npm run web` (port 5000)
2. **Backend API**: `npm run server` (port 3000)

## Deployment Targets
- Android Play Store (future)
- Apple App Store (future)
- Web deployment to cloud (Replit deployment)

## Next Phase Features
- PostgreSQL database for persistent storage
- Admin dashboard to manage client submissions
- Document upload functionality
- Different form types for insurance categories
- Email notifications on form submission
- Client portal to track submission status

## Recent Changes
- November 1, 2025: Initial project setup with Expo and Express.js
- Created all core screens with professional insurance-themed UI
- Implemented form validation and API integration
- Cross-platform support for mobile and web
