import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import LoginPhone from './LoginPhone';
import Register from './Register';

const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#1E96F0',
        },
        headerTintColor: '#fff',
      }}
    >
      {/* {isLoadingWelcome && (
        <Stack.Screen
          name="LoadingWelcome"
          options={{
            headerShown: false,
          }}
          component={LoadingWelcome}
        />
      )} */}
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
  );
};

export default AuthNavigator;
