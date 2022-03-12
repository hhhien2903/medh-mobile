import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { Icon, NativeBaseProvider } from 'native-base';
import Home from './screens/Home';
import LoginPhone from './screens/LoginPhone';
import sharedStore from './store/sharedStore';
import { firebaseApp } from './config/firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import User from './screens/User';
import { Ionicons } from '@expo/vector-icons';
import LoadingWelcome from './screens/LoadingWelcome';
import Register from './screens/Register';
import OneSignal from 'react-native-onesignal';
// Define the config
// const config = {
//   useSystemColorMode: false,
//   initialColorMode: 'dark',
// };

// extend the theme
// export const theme = extendTheme({ config });

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { currentUser, isLoading, setCurrentUser, setIsLoading } = sharedStore((state) => state);
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(true);
  OneSignal.setAppId('c06aa8f4-562c-4a2e-aa5c-5c3a529a3ec9');

  useEffect(() => {
    const unsubscribed = firebaseApp.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        console.log('running logged');
        setTimeout(() => {
          setIsLoadingWelcome(false);
          setCurrentUser(firebaseUser);
        }, 2000);
      } else {
        console.log('running');
        setTimeout(() => {
          setIsLoadingWelcome(false);
          setCurrentUser(null);
        }, 2000);
      }
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {currentUser === null ? (
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#1E96F0',
              },
              headerTintColor: '#fff',
            }}
          >
            {isLoadingWelcome && (
              <Stack.Screen
                name="LoadingWelcome"
                options={{
                  headerShown: false,
                }}
                component={LoadingWelcome}
              />
            )}
            <Stack.Screen
              name="Register"
              options={{
                headerShown: false,
              }}
              component={Register}
            />
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
          </Stack.Navigator>
        ) : (
          <Tab.Navigator
            screenOptions={{
              // headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#1E96F0',
              },
              headerTintColor: '#fff',
              tabBarStyle: {
                height: 60,
                paddingBottom: 5,
                paddingTop: 5,
              },
              tabBarLabelStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                title: 'Trang Chủ',
                tabBarIcon: ({ focused }) => (
                  <Icon
                    as={<Ionicons name={focused ? 'home' : 'home-outline'} />}
                    color={focused ? 'info.500' : 'muted.400'}
                    size={28}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="User"
              component={User}
              options={{
                title: 'Cá Nhân',
                tabBarIcon: ({ focused }) => (
                  <Icon
                    as={<Ionicons name={focused ? 'person' : 'person-outline'} />}
                    color={focused ? 'info.500' : 'muted.400'}
                    size={28}
                  />
                ),
              }}
            />
            {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
