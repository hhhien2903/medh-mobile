import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Patient';
import User from './User';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import PatientStackNavigator from './PatientStackNavigator';

const Tab = createBottomTabNavigator();

const AppTabNavigator = () => {
  return (
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
        name="PatientTab"
        component={PatientStackNavigator}
        options={{
          title: 'Bệnh Nhân',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Ionicons name={focused ? 'people-circle' : 'people-circle-outline'} />}
              color={focused ? 'info.500' : 'muted.400'}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="UserTab"
        component={User}
        options={{
          title: 'Cá Nhân',
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} />}
              color={focused ? 'info.500' : 'muted.400'}
              size={28}
            />
          ),
        }}
      />
      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    </Tab.Navigator>
  );
};

export default AppTabNavigator;
