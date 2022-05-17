import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import PatientDetail from '../PatientDetail';
import AppTabNavigator from './AppTabNavigator';
import CameraScreen from '../CameraScreen';
import Spinner from 'react-native-loading-spinner-overlay';
import sharedStore from '../../store/sharedStore';
import AddMedicalRecord from '../AddMedicalRecord';
import { HStack, IconButton, Menu, Text, Icon } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import EditMedicalRecord from '../EditMedicalRecord';
import { useNavigation } from '@react-navigation/native';
const Stack = createStackNavigator();

const AppStackNavigator = () => {
  const { isLoadingSpinnerOverLay, setIsShowEndMedicalRecord } = sharedStore((state) => state);
  const navigation = useNavigation();

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
          component={PatientDetail}
          options={{
            title: 'Chi Tiết Bệnh Nhân',
            headerLeft: null,
            headerRight: () => (
              <Menu
                mr={2}
                trigger={(triggerProps) => {
                  return (
                    <IconButton
                      {...triggerProps}
                      borderRadius="full"
                      _pressed={{ bg: 'rgba(52, 52, 52, 0.2)' }}
                      icon={
                        <Icon as={<Entypo name="dots-three-vertical" />} color="white" size={5} />
                      }
                    ></IconButton>
                  );
                }}
              >
                <Menu.Item value={1} onPress={() => navigation.navigate('EditMedicalRecord')}>
                  <HStack alignItems="center">
                    <AntDesign name="edit" color="black" size={20} />
                    <Text ml={2} bold>
                      Sửa Bệnh Án
                    </Text>
                  </HStack>
                </Menu.Item>
                <Menu.Item value={2} onPress={() => setIsShowEndMedicalRecord(true)}>
                  <HStack alignItems="center">
                    <Ionicons name="checkmark-done" color="red" size={20} />
                    <Text ml={2} color="danger.500" bold>
                      Kết Thúc Bệnh Án
                    </Text>
                  </HStack>
                </Menu.Item>
              </Menu>
            ),
          }}
        />
        <Stack.Screen
          name="CameraScreen"
          options={{ headerShown: false }}
          component={CameraScreen}
        />
        <Stack.Screen
          name="AddMedicalRecord"
          options={{
            title: 'Tạo Bệnh Án',
            headerLeft: null,
          }}
          component={AddMedicalRecord}
        />
        <Stack.Screen
          name="EditMedicalRecord"
          options={{
            title: 'Chỉnh Sửa Bệnh Án',
            headerLeft: null,
          }}
          component={EditMedicalRecord}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppStackNavigator;
