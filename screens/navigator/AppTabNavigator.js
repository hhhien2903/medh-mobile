import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import User from '../User';
import { HStack, Icon, IconButton, Menu, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Patient from '../Patient';
import Notification from '../Notification';
import sharedStore from '../../store/sharedStore';
import { Entypo } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppTabNavigator = () => {
  const {
    filterTreatedMedicalRecord,
    setFilterTreatedMedicalRecord,
    isVisibleNotificationBadge,
    notificationsSource,
    setIsVisibleAlertDialog,
    setDialogUsedFor,
  } = sharedStore((state) => state);

  const handleIsReadAllNotification = async () => {
    console.log('read All');
  };

  const handleLogoutPress = () => {
    setIsVisibleAlertDialog(true);
    setDialogUsedFor('logout');
  };

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
        component={Patient}
        options={{
          title: 'Bệnh Nhân',
          // headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Ionicons name={focused ? 'people-circle' : 'people-circle-outline'} />}
              color={focused ? 'info.500' : 'muted.400'}
              size={28}
            />
          ),
          headerRight: () => (
            <Menu
              // w={180}
              mr={2}
              trigger={(triggerProps) => {
                return (
                  <IconButton
                    {...triggerProps}
                    borderRadius="full"
                    size={50}
                    _icon={{ size: 25 }}
                    _pressed={{ bg: 'rgba(52, 52, 52, 0.2)' }}
                    icon={<Icon as={<Ionicons name="filter-sharp" />} color="white" />}
                  />
                );
              }}
            >
              <Menu.OptionGroup
                onChange={(selectedFilterValue) => {
                  setFilterTreatedMedicalRecord(selectedFilterValue);
                }}
                value={filterTreatedMedicalRecord}
                title="Tình Trạng Bệnh Án"
                type="radio"
              >
                <Menu.ItemOption value="false">Đang Điều Trị</Menu.ItemOption>
                <Menu.ItemOption value="true">Đã Điều Trị</Menu.ItemOption>
              </Menu.OptionGroup>
            </Menu>
          ),
        }}
      />
      {/* <Tab.Screen
        name="AddMedicalRecordTab"
        component={AddMedicalRecord}
        options={{
          // title: 'Thêm Bệnh Nhân',
          // headerShown: false,
          tabBarButton: () => null,
          tabBarVisible: false,
        }}
      /> */}
      <Tab.Screen
        name="NotificationTab"
        component={Notification}
        options={{
          title: 'Thông Báo',
          tabBarBadge: isVisibleNotificationBadge,
          tabBarBadgeStyle: {
            backgroundColor: 'red',
            minWidth: 10,
            minHeight: 10,
            maxWidth: 10,
            maxHeight: 10,
            borderRadius: 7,
            marginTop: 1,
            alignSelf: undefined,
          },
          tabBarIcon: ({ focused }) => (
            <Icon
              as={
                <Ionicons
                  name={focused ? 'notifications-circle' : 'notifications-circle-outline'}
                />
              }
              color={focused ? 'info.500' : 'muted.400'}
              size={28}
            />
          ),
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
              <Menu.Item value="false" onPress={handleIsReadAllNotification}>
                <HStack>
                  <Ionicons name="checkmark-done" color="black" size={20} />
                  <Text ml={1}>Đánh Dấu Đã Xem Tất Cả</Text>
                </HStack>
              </Menu.Item>
            </Menu>
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
              <Menu.Item value="false" onPress={handleLogoutPress}>
                <HStack alignItems="center">
                  <SimpleLineIcons name="logout" color="red" size={20} />
                  <Text ml={2} color="danger.500" bold>
                    Đăng Xuất
                  </Text>
                </HStack>
              </Menu.Item>
            </Menu>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabNavigator;
