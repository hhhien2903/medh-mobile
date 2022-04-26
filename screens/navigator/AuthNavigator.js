import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Login';
import LoginPhone from '../LoginPhone';
import Register from '../Register';
import sharedStore from '../../store/sharedStore';
import Spinner from 'react-native-loading-spinner-overlay';

const Stack = createStackNavigator();
const AuthNavigator = () => {
  const { isLoadingSpinnerOverLay } = sharedStore((state) => state);
  return (
    <>
      <Spinner visible={isLoadingSpinnerOverLay} color="#1E96F0" />
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#1E96F0',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false,
          }}
          component={Login}
        />
        <Stack.Screen
          name="LoginPhone"
          component={LoginPhone}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          options={{
            headerShown: false,
          }}
          component={Register}
        />
      </Stack.Navigator>
    </>
  );
};

export default AuthNavigator;
