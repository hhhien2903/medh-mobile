import { Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import PatientDetail from '../PatientDetail';
import AppTabNavigator from './AppTabNavigator';
import CameraScreen from '../CameraScreen';
import Spinner from 'react-native-loading-spinner-overlay';
import sharedStore from '../../store/sharedStore';
const Stack = createStackNavigator();

const AppStackNavigator = () => {
  const { isLoadingSpinnerOverLay } = sharedStore((state) => state);
  return (
    <>
      <Spinner visible={isLoadingSpinnerOverLay} color="#1E96F0" size="large" />
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: '#1E96F0',
          },
          headerTintColor: '#fff',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen
          name="Patient"
          options={{
            title: 'Bệnh Nhân',
            headerShown: false,
          }}
          component={AppTabNavigator}
        />
        <Stack.Screen
          name="PatientDetail"
          options={{
            title: 'Chi Tiết Bệnh Nhân',
            headerLeft: null,
          }}
          component={PatientDetail}
        />
        <Stack.Screen
          name="CameraScreen"
          options={{ headerShown: false }}
          component={CameraScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppStackNavigator;
