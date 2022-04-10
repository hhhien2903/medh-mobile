import { Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientDetail from './PatientDetail';
import Patient from './Patient';

const Stack = createNativeStackNavigator();

const PatientStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'left',
        headerStyle: {
          backgroundColor: '#1E96F0',
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="Patient"
        options={{
          title: 'Bệnh Nhân',
          // headerShown: false,
        }}
        component={Patient}
      />
      <Stack.Screen
        name="PatientDetail"
        options={{
          title: 'Chi Tiết Bệnh Nhân',
        }}
        component={PatientDetail}
      />
    </Stack.Navigator>
  );
};

export default PatientStackNavigator;
