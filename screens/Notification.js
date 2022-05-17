import { RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Box, HStack, Text, Spacer, FlatList, VStack, Image, Pressable } from 'native-base';
import moment from 'moment';
import notificationIcon from '../assets/images/notification_icon.png';
import { Octicons } from '@expo/vector-icons';
import pushDeviceAPI from '../api/pushDeviceAPI';
import sharedStore from '../store/sharedStore';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import EmptyListMessage from '../components/EmptyListMessage';

const Notification = () => {
  const {
    currentUser,
    setIsLoadingSpinnerOverLay,
    notificationsSource,
    setNotificationsSource,
    getAllNotification,
    setIsVisibleNotificationBadge,
  } = sharedStore((state) => state);
  const navigation = useNavigation();
  const [isRefreshActive, setIsRefreshActive] = useState(false);
  const data = [
    {
      id: 99,
      uuid: '9db097c8-df51-4c84-810e-520f8e1db820',
      createdAt: '2022-05-04T15:54:46.47211Z',
      updatedAt: '2022-05-05T08:56:44.387035Z',
      data: '{"type":"1"}',
      status: true,
      title: 'Thay Đổi Trạng Thái',
      content: 'Trạng thái theo dõi của Bệnh nhân Nguyen Hau. Vừa thay đổi thành Level 2',
      isRead: false,
      pushDeviceId: 59,
      avatarUrl:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: 104,
      uuid: '9db097c8-df51-4c84-810e-520f8e1db820',
      createdAt: '2022-05-04T15:54:46.47211Z',
      updatedAt: '2022-05-05T08:56:44.387035Z',
      data: '{"type":"1"}',
      status: true,
      title: 'Thay Đổi Trạng Thái',
      content: 'Trạng thái theo dõi của Bệnh nhân Nguyen Hau. Vừa thay đổi thành Level 2',
      isRead: true,
      pushDeviceId: 59,
      avatarUrl:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: 103,
      uuid: '9db097c8-df51-4c84-810e-520f8e1db820',
      createdAt: '2022-05-04T15:54:46.47211Z',
      updatedAt: '2022-05-05T08:56:44.387035Z',
      data: '{"type":"1"}',
      status: true,
      title: 'Thay Đổi Trạng Thái',
      content: 'Trạng thái theo dõi của Bệnh ',
      isRead: true,
      pushDeviceId: 59,
      avatarUrl:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: 102,
      uuid: '9db097c8-df51-4c84-810e-520f8e1db820',
      createdAt: '2022-05-04T15:54:46.47211Z',
      updatedAt: '2022-05-05T08:56:44.387035Z',
      data: '{"type":"1"}',
      status: true,
      title: 'Thay Đổi Trạng Thái',
      content: 'Trạng thái theo dõi của Bệnh ',
      isRead: true,
      pushDeviceId: 59,
      avatarUrl:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
  ];

  // const getAllNotification = async () => {
  //   try {
  //     setIsLoadingSpinnerOverLay(true);
  //     // const notificationResult = await pushDeviceAPI.getNotificationByDoctorId(currentUser.id);
  //     const notificationResult = await pushDeviceAPI.getNotificationByDoctorId(28);
  //     setNotificationSource(notificationResult);
  //     setIsLoadingSpinnerOverLay(false);
  //     setIsRefreshActive(false);
  //   } catch (error) {
  //     setIsLoadingSpinnerOverLay(false);
  //     setIsRefreshActive(false);
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getAllNotification();
  // }, []);

  const handleRefresh = async () => {
    setIsRefreshActive(true);
    await getAllNotification(28);
    setIsRefreshActive(false);
  };

  const handleUpdateIsReadNotification = async (notificationId) => {
    try {
      const updateNotificationResult = await pushDeviceAPI.updateNotificationIsRead(notificationId);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePressNotificationItem = (notification) => {
    navigation.navigate('PatientDetail', { medicalRecordId: 40 });
    const notificationIndex = notificationsSource.findIndex(
      (notificationItem) => notification.id === notificationItem.id
    );
    let notifications = [...notificationsSource];
    notifications[notificationIndex] = { ...notification, isRead: true };
    setNotificationsSource(notifications);
    handleUpdateIsReadNotification(notification.id);
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getAllNotification(28);
  //   }, [])
  // );

  useEffect(() => {
    if (notificationsSource.find((notification) => notification.isRead === false)) {
      setIsVisibleNotificationBadge('');
    } else {
      setIsVisibleNotificationBadge(null);
    }
  }, [notificationsSource]);

  return (
    <Box>
      {/* <Heading fontSize="xl" p="4" pb="3">
        Inbox
      </Heading> */}
      <FlatList
        ListEmptyComponent={<EmptyListMessage />}
        refreshControl={<RefreshControl refreshing={isRefreshActive} onRefresh={handleRefresh} />}
        data={notificationsSource}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePressNotificationItem(item)}>
            <Box
              borderBottomWidth="1"
              borderColor="coolGray.200"
              pl="2"
              pr="5"
              pt="2"
              pb="2"
              bg={item.isRead ? '#FFF' : 'coolGray.50'}
            >
              <HStack space={3} justifyContent="space-between">
                <Image
                  size="35"
                  // resizeMode={'contain'}
                  borderRadius="full"
                  source={notificationIcon}
                  alt="Alternate Text"
                />
                <VStack w="60%">
                  <Text
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800"
                    bold={item.isRead ? false : true}
                    fontSize="sm"
                    mb={0.5}
                  >
                    {item?.title}
                  </Text>
                  <Text
                    color="coolGray.800"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    fontSize="sm"
                    bold={item.isRead ? false : true}
                  >
                    {item?.content}
                  </Text>
                </VStack>
                <Spacer />
                <VStack>
                  <Text
                    fontSize="11"
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.500"
                    alignSelf="flex-end"
                  >
                    {moment(item?.createdAt).format('DD/MM/YYYY')}
                  </Text>
                  <Text
                    fontSize="11"
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.500"
                    alignSelf="flex-end"
                  >
                    {moment(item?.createdAt).format('hh:mm A')}
                  </Text>

                  {!item?.isRead ? (
                    <Box alignSelf="flex-end" flexGrow={1} mr={2} mt={1}>
                      <Octicons name="primitive-dot" size={20} color="#1E96F0" />
                    </Box>
                  ) : (
                    <Box></Box>
                  )}
                </VStack>
              </HStack>
            </Box>
          </Pressable>
        )}
        keyExtractor={(item) => item?.id.toString()}
      />
    </Box>
  );
};

export default Notification;
