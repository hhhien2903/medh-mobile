import React, { useState, useEffect } from 'react';
import sharedStore from '../store/sharedStore';
import { Camera } from 'expo-camera';
import {
  Avatar,
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Input,
  Select,
  VStack,
  ScrollView,
  Icon,
  Menu,
  Pressable,
  IconButton,
  Center,
  Image,
  AlertDialog,
  useToast,
} from 'native-base';
import moment from 'moment';
import { firebaseApp } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import doctorAPI from '../api/doctorAPI';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import avatarDefault from '../assets/images/avatar_default.png';
import medHLogo from '../assets/images/med-h-logo.png';
import pushDeviceAPI from '../api/pushDeviceAPI';

const User = () => {
  const currentUser = sharedStore((state) => state.currentUser);
  const setCurrentUser = sharedStore((state) => state.setCurrentUser);
  const { setIsLoadingSpinnerOverLay, tokenPushDevice } = sharedStore((state) => state);
  const [formData, setFormData] = useState(currentUser);
  const navigation = useNavigation();
  const [isVisibleAlertDialog, setIsVisibleAlertDialog] = useState(false);
  const [dialogUsedFor, setDialogUsedFor] = useState(null);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const toast = useToast();
  const getCurrentUserInfo = async () => {
    try {
      setIsLoadingSpinnerOverLay(true);
      const userInfoResult = await doctorAPI.getDoctorByDoctorId(currentUser.id);
      setFormData(userInfoResult);
      setCurrentUser(userInfoResult);
      setIsLoadingSpinnerOverLay(false);
    } catch (error) {
      setIsLoadingSpinnerOverLay(false);
      console.log(error);
    }
  };
  const onChangeDatePicker = (event, selectedDate) => {
    console.log(selectedDate);
    let currentDate = selectedDate;
    if (!selectedDate) {
      currentDate = new Date();
    }
    setIsShowDatePicker(false);
    setFormData({ ...formData, dateOfBirth: currentDate });
  };

  const handleUpdateUser = async () => {
    try {
      await doctorAPI.updateInfo(formData);
      getCurrentUserInfo();
      toast.show({
        title: 'Thao tác thành công.',
        placement: 'top',
      });
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Thao tác không thành công.',
        placement: 'top',
      });
    }
    setIsVisibleAlertDialog(false);
  };

  const handleVisibleConfirmDialogUpdateInfo = () => {
    setIsVisibleAlertDialog(true);
    setDialogUsedFor('updateInfo');
  };
  const handleVisibleConfirmDialogLogout = () => {
    setIsVisibleAlertDialog(true);
    setDialogUsedFor('logout');
  };

  useFocusEffect(
    React.useCallback(() => {
      getCurrentUserInfo();
    }, [])
  );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      try {
        const uploadAvatarForm = new FormData();
        uploadAvatarForm.append('file', {
          uri: result.uri,
          name: new Date().getSeconds().toString(),
          type: 'image/jpg',
        });
        console.log(uploadAvatarForm);

        await doctorAPI.uploadAvatar(currentUser.id, uploadAvatarForm);
        getCurrentUserInfo();
        toast.show({
          title: 'Thao tác thành công',
          placement: 'top',
        });
      } catch (error) {
        console.log(error);
        toast.show({
          title: 'Thao tác không thành công',
          placement: 'top',
        });
      }
    }
  };

  const handleLogout = () => {
    setIsLoadingSpinnerOverLay(true);

    firebaseApp
      .auth()
      .signOut()
      .then(async (value) => {
        try {
          const sendRemovePushDeviceData = {
            clientId: tokenPushDevice,
            doctorId: currentUser.id,
          };
          await pushDeviceAPI.remove(sendRemovePushDeviceData);
          setIsLoadingSpinnerOverLay(false);
        } catch (error) {
          console.log(error);
        }
      });
  };

  return (
    <ScrollView>
      <Box safeArea>
        <HStack justifyContent="center" alignItems="center">
          {currentUser?.avatar ? (
            <Avatar
              size="24"
              source={{
                uri: currentUser?.avatar,
              }}
            />
          ) : (
            <Image
              size={24}
              resizeMode={'contain'}
              borderRadius={100}
              source={avatarDefault}
              alt="Alternate Text"
            />
          )}

          <Menu
            placement="bottom"
            trigger={(triggerProps) => {
              return (
                <Box
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor: '#D5D1CB',
                    display: 'flex',
                    justifyContent: 'center',
                    // alignItems: 'center',
                    position: 'absolute',
                    bottom: -3,
                    right: 160,
                  }}
                >
                  <IconButton
                    borderRadius="full"
                    _pressed={{ bg: 'rgba(52, 52, 52, 0.2)' }}
                    {...triggerProps}
                    icon={<Icon as={<Ionicons name="camera" />} color="black" size={5} />}
                  ></IconButton>
                </Box>
              );
            }}
          >
            <Menu.Item onPress={() => navigation.navigate('CameraScreen')}>
              <HStack>
                <Icon as={<Ionicons name="camera-outline" color="black" />} size={5} />
                <Text> Chụp ảnh</Text>
              </HStack>
            </Menu.Item>
            <Menu.Item onPress={() => pickImage()}>
              <HStack>
                <Icon as={<Ionicons name="image-outline" color="black" />} size={5} />
                <Text> Chọn ảnh từ Thư Viện</Text>
              </HStack>
            </Menu.Item>
          </Menu>
        </HStack>
        <VStack space={3} px={5} mt="3">
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Họ Và Tên:</FormControl.Label>
            <Input
              borderColor="gray.500"
              // InputLeftElement={
              //   <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
              // }
              placeholder="Họ Và Tên"
              fontSize={16}
              height="10"
              value={formData?.name}
              // onChange={(value) => setFormData({ ...formData, name: value })}
              onChangeText={(value) => setFormData({ ...formData, name: value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Số Điện Thoại:</FormControl.Label>
            <Input
              borderColor="gray.500"
              // InputLeftElement={
              //   <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
              // }
              isReadOnly="true"
              placeholder="Số Điện Thoại"
              fontSize={16}
              height="10"
              value={currentUser?.mobile}
              backgroundColor="#DCDCDC"
              // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Email:</FormControl.Label>
            <Input
              // InputLeftElement={
              //   <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
              // }
              borderColor="gray.500"
              isReadOnly="true"
              placeholder="Email"
              fontSize={16}
              height="10"
              value={currentUser?.email}
              backgroundColor="#DCDCDC"
              // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Giới Tính:</FormControl.Label>
            <Select
              height="10"
              borderColor="gray.500"
              accessibilityLabel="Giới Tính"
              placeholder="Giới Tính"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size={5} />,
              }}
              defaultValue={formData?.gender}
              fontSize={16}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
            >
              <Select.Item label="Nam" value={true} />
              <Select.Item label="Nữ" value={false} />
            </Select>

            <FormControl.ErrorMessage></FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Ngày Sinh:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="Ngày Sinh"
              fontSize={16}
              height="10"
              isReadOnly
              value={moment(formData?.dateOfBirth).format('DD/MM/YYYY')}
              // onValueChange={(value) => setFormData({ ...formData, dateOfBirth: value })}
              InputRightElement={
                <Icon
                  as={<AntDesign name="calendar" />}
                  size={5}
                  mr="1"
                  color="muted.400"
                  onPress={() => setIsShowDatePicker(true)}
                />
              }
            />
            <FormControl.ErrorMessage></FormControl.ErrorMessage>
          </FormControl>
          {isShowDatePicker && (
            <DateTimePicker
              value={moment(formData?.dateOfBirth).toDate()}
              mode="date"
              is24Hour={true}
              onChange={onChangeDatePicker}
            />
          )}
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>CMND/CCCD:</FormControl.Label>
            <Input
              // InputLeftElement={
              //   <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
              // }
              borderColor="gray.500"
              sReadOnly="true"
              placeholder="CMND/CCCD"
              fontSize={16}
              height="10"
              value={currentUser?.cmnd}
              backgroundColor="#DCDCDC"
              // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Bệnh Viện Công Tác:</FormControl.Label>
            <Input
              // InputLeftElement={
              //   <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
              // }
              borderColor="gray.500"
              sReadOnly="true"
              placeholder="Bệnh Viện Công Tác"
              fontSize={16}
              height="10"
              value={currentUser?.hospital.name}
              backgroundColor="#DCDCDC"
              // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
            />
          </FormControl>
          <Button
            mt="2"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={handleVisibleConfirmDialogUpdateInfo}
          >
            Cập Nhật Thông Tin
          </Button>
          <Button
            mb={15}
            bg="warmGray.500"
            onPress={handleVisibleConfirmDialogLogout}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
          >
            Đăng Xuất
          </Button>

          {/* <FormControl isRequired>
          <FormControl.Label _text={{ fontSize: 15 }}>Bệnh Viện Công Tác:</FormControl.Label>
          <Select
            height="10"
            borderColor="info.500"
            accessibilityLabel="Bệnh Viện Công Tác"
            placeholder="Bệnh Viện Công Tác"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size={5} />,
            }}
            mt="1"
            fontSize={16}
            // onValueChange={(value) =>
            //   setFormRegisterData({ ...formRegisterData, hospitalId: value })
            // }
          >
          </Select>
          <FormControl.ErrorMessage></FormControl.ErrorMessage>
        </FormControl> */}
        </VStack>

        {/* Dialog Confirm Update */}
      </Box>
      <AlertDialog isOpen={isVisibleAlertDialog} onClose={() => setIsVisibleAlertDialog(false)}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Xác Nhận</AlertDialog.Header>
          <AlertDialog.Body>Bạn có chắc chắn thực hiện thao tác này?</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setIsVisibleAlertDialog(false)}
              >
                Huỷ
              </Button>
              <Button
                colorScheme="primary"
                onPress={() => {
                  switch (dialogUsedFor) {
                    case 'updateInfo':
                      return handleUpdateUser();
                    case 'logout':
                      return handleLogout();
                    default:
                      break;
                  }
                }}
              >
                Đồng Ý
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </ScrollView>
  );
};

export default User;
