import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { extendTheme, NativeBaseProvider } from 'native-base';
import Home from './screens/Home';
import AuthProvider from './contexts/AuthProvider';
import Loading from './screens/Loading';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

// extend the theme
export const theme = extendTheme({ config });

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTitleAlign: 'center' }}>
            <Stack.Screen
              name="Login"
              options={{
                title: 'Đăng Nhập MED-H',
                headerLeft: () => {
                  return <View></View>;
                },
              }}
              component={Login}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                title: 'Trang Chủ',
                headerLeft: () => {
                  return <View></View>;
                },
                gestureEnabled: false,
              }}
            />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
