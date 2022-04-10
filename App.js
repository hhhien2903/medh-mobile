import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { Icon, NativeBaseProvider } from 'native-base';
import LoginPhone from './screens/LoginPhone';
import sharedStore from './store/sharedStore';
import { firebaseApp } from './config/firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoadingWelcome from './screens/LoadingWelcome';
import Register from './screens/Register';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import doctorAPI from './api/doctorAPI';
import AuthNavigator from './screens/AuthNavigator';
import AppTabNavigator from './screens/AppTabNavigator';
// Define the config
// const config = {
//   useSystemColorMode: false,
//   initialColorMode: 'dark',
// };

// extend the theme
// export const theme = extendTheme({ config });

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const {
    currentUser,
    setCurrentUser,
    tokenTest,
    setTokenTest,
    setIsNotRegistered,
    setIsShowRegisterSuccessfulAlert,
    setIsShowDisabledAlert,
  } = sharedStore((state) => state);
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(true);
  const [isNotLogIn, setIsNotLogIn] = useState(true);

  useEffect(() => {
    const unsubscribed = firebaseApp.auth().onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        console.log('running');
        setTimeout(() => {
          setIsLoadingWelcome(false);
          setIsNotLogIn(true);
        }, 2000);
        return;
      }

      try {
        console.log('running logged');
        setTimeout(() => {
          setIsLoadingWelcome(false);
        }, 2000);
        let { phoneNumber, email } = firebaseUser;
        if (phoneNumber) {
          phoneNumber = '0' + phoneNumber.substring(3);
        }
        const doctorData = await doctorAPI.checkAccountRegistered(phoneNumber, email);
        if (doctorData.isActive === false) {
          setIsShowRegisterSuccessfulAlert(true);
        }
        if (doctorData.isDisabled === true) {
          setIsShowDisabledAlert(true);
          return;
        }
        if (doctorData.isActive === true) {
          console.log('login va da active');
          setIsNotLogIn(false);
          setCurrentUser(doctorData);
        }
      } catch (error) {
        if (error.status === 500) {
          console.log('chay ne');
          setIsNotRegistered(true);
        }
      }
    });
    return () => {
      unsubscribed();
    };
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setTokenTest(token);
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    // if (Platform.OS === 'android') {
    //   Notifications.setNotificationChannelAsync('default', {
    //     name: 'default',
    //     importance: Notifications.AndroidImportance.MAX,
    //     vibrationPattern: [0, 250, 250, 250],
    //     lightColor: '#FF231F7C',
    //   });
    // }

    return token;
  }

  if (isLoadingWelcome) {
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="LoadingWelcome"
              options={{
                headerShown: false,
              }}
              component={LoadingWelcome}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {isNotLogIn ? <AuthNavigator /> : <AppTabNavigator />}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
