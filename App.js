import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect, useState, useRef } from 'react';
import 'react-native-gesture-handler';
import doctorAPI from './api/doctorAPI';
import { firebaseApp } from './config/firebase';
import LoadingWelcome from './screens/LoadingWelcome';
import AuthNavigator from './screens/navigator/AuthNavigator';
import AppStackNavigator from './screens/navigator/AppStackNavigator';
import sharedStore from './store/sharedStore';
import pushDeviceAPI from './api/pushDeviceAPI';
import { LinearGradient } from 'expo-linear-gradient';
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
    // shouldSetBadge: false,
  }),
});

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

export default function App() {
  const {
    setCurrentUser,
    setTokenPushDevice,
    setIsNotRegistered,
    setIsShowRegisterSuccessfulAlert,
    setIsShowDisabledAlert,
    setNotificationsSource,
    setIsVisibleNotificationBadge,
    getAllNotification,
    setIsVisibleAlertDialog,
  } = sharedStore((state) => state);
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(true);
  const [isNotLogIn, setIsNotLogIn] = useState(true);
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigationRef = useNavigationContainerRef();
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
        const checkDoctorExistResult = await doctorAPI.checkAccountRegistered(phoneNumber, email);
        if (checkDoctorExistResult.isActive === false) {
          setIsShowRegisterSuccessfulAlert(true);
        }
        if (checkDoctorExistResult.isDisabled === true) {
          setIsShowDisabledAlert(true);
          return;
        }
        if (checkDoctorExistResult.isActive === true) {
          console.log('login va da active');
          const doctorDataResult = await doctorAPI.getDoctorByDoctorId(checkDoctorExistResult.id);
          await setCurrentUser(doctorDataResult);
          setIsVisibleAlertDialog(false);
          registerForPushNotificationsAsync().then(async (token) => {
            setTokenPushDevice(token);

            const sendPushDeviceData = {
              clientId: token,
              platform: 'app',
              doctorId: doctorDataResult.id,
            };
            try {
              await pushDeviceAPI.register(sendPushDeviceData);
              console.log('running');
            } catch (error) {
              if (error.status === 409) {
                console.log('đã push token');
                getAllNotification(doctorDataResult.id);
                setIsNotLogIn(false);
                return;
              }
            }
          });

          setIsNotLogIn(false);
        }
      } catch (error) {
        // Đăng nhập thành công nhưng chưa đăng ký

        if (error.status === 404) {
          console.log('đẩy qua register');
          setIsNotRegistered(true);
          return;
        }
        //Server sập
        if (error.status === 500) {
          return;
        }
      }
    });
    return () => {
      unsubscribed();
    };
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
    //     vibrationPattern: true,
    //     lightColor: '#FF231F7C',
    //     sound: ''
    //   });
    // }

    return token;
  }

  useEffect(() => {
    //handle listening receive new notification
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      // console.log(notification);
      setNotification(notification);
    });

    //handle press notification in Device Notification Bar
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      navigationRef.navigate('PatientDetail', {
        medicalRecordId: response.notification.request.content.data?.medicalRecordId,
      });
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
    <NativeBaseProvider config={config}>
      <NavigationContainer ref={navigationRef}>
        {isNotLogIn ? <AuthNavigator /> : <AppStackNavigator />}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
