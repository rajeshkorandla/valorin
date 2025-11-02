import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, useWindowDimensions, View } from 'react-native';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import ClientInfoScreen from './src/screens/ClientInfoScreen';
import InsuranceQuoteScreen from './src/screens/InsuranceQuoteScreen';
import SubmissionsScreen from './src/screens/SubmissionsScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminSubmissionsScreen from './src/screens/AdminSubmissionsScreen';
import AdminRouter from './src/admin/AdminRouter';

const Stack = createNativeStackNavigator();

// Web URL configuration
const linking = {
  prefixes: [],
  config: {
    screens: {
      Home: '',
      ClientInfo: 'client-info',
      InsuranceQuote: 'quote',
      Submissions: 'submissions',
      AdminLogin: 'admin',
      AdminDashboard: 'admin/dashboard',
      AdminSubmissions: 'admin/submissions',
    },
  },
};

// Client-facing Expo navigation
function ExpoNavigation() {
  return (
    <NavigationContainer linking={Platform.OS === 'web' ? linking : undefined}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E40AF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Insurance Services' }}
        />
        <Stack.Screen 
          name="ClientInfo" 
          component={ClientInfoScreen}
          options={{ title: 'Client Information' }}
        />
        <Stack.Screen 
          name="InsuranceQuote" 
          component={InsuranceQuoteScreen}
          options={{ title: 'Request Quote' }}
        />
        <Stack.Screen 
          name="Submissions" 
          component={SubmissionsScreen}
          options={{ title: 'Your Submissions' }}
        />
        <Stack.Screen 
          name="AdminLogin" 
          component={AdminLoginScreen}
          options={{ title: 'Admin Login' }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen}
          options={{ title: 'Admin Dashboard' }}
        />
        <Stack.Screen 
          name="AdminSubmissions" 
          component={AdminSubmissionsScreen}
          options={{ title: 'Manage Submissions' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// App router that switches between Expo and Admin CRM
function AppContent() {
  const location = useLocation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Use desktop Admin CRM for admin routes on desktop
  if (Platform.OS === 'web' && isDesktop && isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    );
  }

  // Use Expo navigation for everything else
  return <ExpoNavigation />;
}

export default function App() {
  // For web: use React Router wrapper
  if (Platform.OS === 'web') {
    return (
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    );
  }

  // For mobile: just use Expo navigation
  return (
    <AuthProvider>
      <ExpoNavigation />
    </AuthProvider>
  );
}
