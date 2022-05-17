import React, { useState, useEffect, useRef } from 'react';
import sharedStore from '../store/sharedStore';
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
  Text,
} from 'native-base';
import moment from 'moment';
import { firebaseApp } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import doctorAPI from '../api/doctorAPI';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import avatarDefault from '../assets/images/avatar_default.png';
import pushDeviceAPI from '../api/pushDeviceAPI';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { vietnameseNameRegex } from '../utils/regex';
import { RefreshControl } from 'react-native';

const User = () => {
  const currentUser = sharedStore((state) => state.currentUser);
  const setCurrentUser = sharedStore((state) => state.setCurrentUser);
  const {
    setIsLoadingSpinnerOverLay,
    tokenPushDevice,
    isVisibleAlertDialog,
    setIsVisibleAlertDialog,
    dialogUsedFor,
    setDialogUsedFor,
  } = sharedStore((state) => state);
  const navigation = useNavigation();
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const toast = useToast();
  const [isRefreshActive, setIsRefreshActive] = useState(false);
  const scrollRef = useRef();
  const getCurrentUserInfo = async () => {
    try {
      setIsLoadingSpinnerOverLay(true);
      const userInfoResult = await doctorAPI.getDoctorByDoctorId(currentUser.id);
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
    // setFormData({ ...formData, dateOfBirth: currentDate });

    formik.setFieldValue('dateOfBirth', currentDate);
  };

  const handleUpdateUser = async () => {
    try {
      const sendData = {
        name: formik.values.name,
        gender: formik.values.gender,
        dateOfBirth: formik.values.dateOfBirth,
        id: formik.values.id,
        hospital: formik.values.hospital.id,
      };
      await doctorAPI.updateInfo(sendData);
      await getCurrentUserInfo();
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
      formik.setFieldValue('name', currentUser?.name);
      formik.setFieldValue('mobile', currentUser?.mobile);
      formik.setFieldValue('email', currentUser?.email);
      formik.setFieldValue('gender', currentUser?.gender);
      formik.setFieldValue('dateOfBirth', currentUser?.dateOfBirth);
      formik.setFieldValue('cmnd', currentUser?.cmnd);
      formik.setFieldValue('hospital', currentUser?.hospital);
      formik.setFieldValue('id', currentUser?.id);
      scrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
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
        toast.closeAll();
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

  const formik = useFormik({
    initialValues: {
      name: currentUser?.name,
      mobile: currentUser?.mobile,
      email: currentUser?.email,
      gender: currentUser?.gender,
      dateOfBirth: currentUser?.dateOfBirth,
      cmnd: currentUser?.cmnd,
      hospital: currentUser?.hospital,
      id: currentUser?.id,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, 'Họ Và Tên tối thiểu 5 ký tự trở lên.')
        .matches(vietnameseNameRegex, 'Họ Và Tên không đúng định dạng.')
        .required('Họ Và Tên không được để trống!'),
    }),

    onSubmit: (form) => {
      // setFormData(form);
      handleVisibleConfirmDialogUpdateInfo();
    },
  });

  const handleRefresh = async () => {
    setIsRefreshActive(true);
    await getCurrentUserInfo();
    setIsRefreshActive(false);
  };

  return (
    <ScrollView
      ref={scrollRef}
      refreshControl={<RefreshControl refreshing={isRefreshActive} onRefresh={handleRefresh} />}
    >
      <Box safeArea>
        <HStack justifyContent="center" alignItems="center">
          <Box style={{ position: 'relative' }}>
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
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
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
          </Box>
        </HStack>
        <VStack space={2} px={5} mt="3">
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Họ Và Tên:</FormControl.Label>
            <Input
              borderColor="gray.500"
              placeholder="Họ Và Tên"
              fontSize={16}
              height="10"
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              value={formik.values.name}
            />
            {formik.errors.name && <Text color="danger.500">{formik.errors.name}</Text>}
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Số Điện Thoại:</FormControl.Label>
            <Input
              borderColor="gray.500"
              isReadOnly="true"
              placeholder="Số Điện Thoại"
              fontSize={16}
              height="10"
              value={formik.values?.mobile}
              backgroundColor="#DCDCDC"
              onChangeText={formik.handleChange('mobile')}
              // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Email:</FormControl.Label>
            <Input
              borderColor="gray.500"
              isReadOnly="true"
              placeholder="Email"
              fontSize={16}
              height="10"
              value={formik.values?.email}
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
                bg: 'blue.300',
                borderRadius: '5',
                endIcon: <CheckIcon size={5} />,
              }}
              _item={{ _pressed: { bg: 'gray.400', borderRadius: '5' }, mb: 1 }}
              fontSize={16}
              selectedValue={formik.values?.gender}
              onValueChange={(value) => formik.setFieldValue('gender', value)}
            >
              <Select.Item label="Nam" value={true} />
              <Select.Item label="Nữ" value={false} />
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Ngày Sinh:</FormControl.Label>
            <Input
              placeholder="Ngày Sinh"
              fontSize={16}
              height="10"
              isReadOnly
              borderColor="gray.500"
              value={moment(formik.values?.dateOfBirth).format('DD/MM/YYYY')}
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
          </FormControl>
          {isShowDatePicker && (
            <DateTimePicker
              maximumDate={moment().subtract(18, 'year').endOf('year').toDate()}
              value={moment(formik.values?.dateOfBirth).toDate()}
              mode="date"
              is24Hour={true}
              onChange={onChangeDatePicker}
            />
          )}
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>CMND / CCCD:</FormControl.Label>
            <Input
              borderColor="gray.500"
              sReadOnly="true"
              placeholder="CMND/CCCD"
              fontSize={16}
              height="10"
              value={formik.values?.cmnd}
              backgroundColor="#DCDCDC"
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Bệnh Viện Công Tác:</FormControl.Label>
            <Input
              borderColor="gray.500"
              sReadOnly="true"
              placeholder="Bệnh Viện Công Tác"
              fontSize={16}
              height="10"
              value={formik.values?.hospital.name}
              backgroundColor="#DCDCDC"
            />
          </FormControl>
          <Button
            mt="2"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={formik.handleSubmit}
            mb="2"
          >
            Cập Nhật Thông Tin
          </Button>
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
