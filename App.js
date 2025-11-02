import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/contexts/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import ClientInfoScreen from './src/screens/ClientInfoScreen';
import InsuranceQuoteScreen from './src/screens/InsuranceQuoteScreen';
import SubmissionsScreen from './src/screens/SubmissionsScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminSubmissionsScreen from './src/screens/AdminSubmissionsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
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
    </AuthProvider>
  );
}
