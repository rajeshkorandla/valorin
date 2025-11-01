import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ClientInfoScreen from './src/screens/ClientInfoScreen';
import InsuranceQuoteScreen from './src/screens/InsuranceQuoteScreen';
import SubmissionsScreen from './src/screens/SubmissionsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
