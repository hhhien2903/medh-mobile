import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import doctorAPI from './api/doctorAPI';
import { firebaseApp } from './config/firebase';
import LoadingWelcome from './screens/LoadingWelcome';
import AuthNavigator from './screens/navigator/AuthNavigator';
import AppStackNavigator from './screens/navigator/AppStackNavigator';
import sharedStore from './store/sharedStore';
import pushDeviceAPI from './api/pushDeviceAPI';
// Define the config
// const config = {
//   useSystemColorMode: false,
//   initialColorMode: 'dark',
// };

// extend the theme
// export const theme = extendTheme({ config });

const Stack = createStackNavigator();

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
    tokenPushDevice,
    setTokenPushDevice,
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
          await setCurrentUser(doctorData);
          registerForPushNotificationsAsync().then(async (token) => {
            setTokenPushDevice(token);
            const sendPushDeviceData = {
              clientId: token,
              platform: 'app',
              doctorId: doctorData.id,
            };
            try {
              await pushDeviceAPI.register(sendPushDeviceData);
            } catch (error) {
              if (error.status === 409) {
                console.log('chay neee');
                setIsNotLogIn(false);
                return;
              }
            }
          });

          setIsNotLogIn(false);
        }
      } catch (error) {
        // Đăng nhập thành công nhưng chưa đăng ký
        if (error.status === 500) {
          console.log('đẩy qua register');
          setIsNotRegistered(true);
        }
        //Đăng nhập thành công, đã đăng ký, đã gửi push token
      }
    });
    return () => {
      unsubscribed();
    };
  }, []);

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) => {
  //     setTokenPushDevice(token);
  //   });
  // }, []);

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
        {isNotLogIn ? <AuthNavigator /> : <AppStackNavigator />}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
