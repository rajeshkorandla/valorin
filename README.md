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

### Technical Features
- Cross-platform support (Android, iOS, and Web)
- Professional insurance-themed UI design
- Client-side and server-side form validation
- Responsive design for all screen sizes
- In-memory data storage (MVP - upgradeable to PostgreSQL)
- RESTful API backend

## Tech Stack

- **Frontend**: Expo (React Native for Web + Mobile)
- **Navigation**: React Navigation
- **Backend**: Express.js
- **Data Storage**: In-memory (MVP phase)

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install
```

### Running the Application

#### For Web Development
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
├── App.js                          # Main app entry with navigation setup
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── server/
│   └── index.js                    # Express.js API server
└── src/
    ├── config/
    │   └── api.js                  # API configuration and endpoints
    └── screens/
        ├── HomeScreen.js           # Home screen with navigation
        ├── ClientInfoScreen.js     # Client information form
        ├── InsuranceQuoteScreen.js # Insurance quote request form
        └── SubmissionsScreen.js    # View submissions
```

## API Endpoints

### Backend API (Port 3000)

- **POST** `/api/client-info` - Submit client information
  - Required fields: firstName, lastName, email, phone, address, city, state, zipCode
  
- **POST** `/api/quote-request` - Submit insurance quote request
  - Required fields: fullName, email, phone, insuranceType
  - Optional fields: coverageAmount, additionalInfo
  
- **GET** `/api/submissions` - Retrieve all submissions
  - Returns: clientSubmissions and quoteRequests arrays

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

## Future Enhancements

### Planned Features
- PostgreSQL database for persistent storage
- Admin dashboard for managing submissions
- Document upload functionality for supporting documents
- Email notifications on form submission
- Client portal to track submission status
- Different form types for various insurance categories
- Integration with insurance company APIs
- Payment processing integration
- Multi-language support

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
