import { AntDesign } from '@expo/vector-icons';
import {
  Box,
  Button,
  FormControl,
  Heading,
  Icon,
  Image,
  Input,
  KeyboardAvoidingView,
  VStack,
  Select,
  CheckIcon,
  ScrollView,
  AlertDialog,
  useToast,
} from 'native-base';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import medHLogo from '../assets/images/med-h-logo.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { firebaseApp } from '../config/firebase';
import sharedStore from '../store/sharedStore';
import doctorAPI from '../api/doctorAPI';
import hospitalAPI from '../api/hospitalAPI';

const Register = () => {
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date(946713509000));
  const navigation = useNavigation();
  const { setIsNotRegistered, isShowRegisterSuccessfulAlert, setIsShowRegisterSuccessfulAlert } =
    sharedStore((state) => state);
  const [isReadOnlyPhoneNumberField, setIsReadOnlyPhoneNumberField] = useState(false);
  const [isReadOnlyEmailField, setIsReadOnlyEmailField] = useState(false);
  const [formRegisterData, setFormRegisterData] = useState({});
  const [hospitalList, setHospitalList] = useState([]);
  const toast = useToast();

  const showDatepicker = () => {
    setIsShowDatePicker(true);
  };
  const onChangeDatePicker = (event, selectedDate) => {
    let currentDate = selectedDate;
    if (!selectedDate) {
      currentDate = new Date();
    }
    setIsShowDatePicker(false);
    setDate(currentDate);
  };

  const checkExistingInfo = () => {
    const { email, phoneNumber } = firebaseApp.auth().currentUser;
    if (email) {
      setIsReadOnlyEmailField(true);
      setFormRegisterData({ ...formRegisterData, email: email });
    }
    if (phoneNumber) {
      setIsReadOnlyPhoneNumberField(true);
      setFormRegisterData({ ...formRegisterData, mobile: '0' + phoneNumber.substring(3) });
    }
  };

  const getAllHospital = async () => {
    try {
      const result = await hospitalAPI.getAllHospital();
      setHospitalList(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkExistingInfo();
    getAllHospital();
  }, []);

  const handleClickRegister = async () => {
    // if (!validateForm('phoneNumberField')) {
    //   return;
    // }
    // console.log(formRegisterData);
    try {
      const data = {
        ...formRegisterData,
        dateOfBirth: moment(date).toISOString(),
      };
      console.log(data);
      const result = await doctorAPI.register(data);
      console.log(result);
      setIsShowRegisterSuccessfulAlert(true);
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        toast.show({
          title: 'Đăng Ký Không Thành Công.',
          // status: 'warning',
          placement: 'top',
          description:
            'Email/SĐT của bạn đã từng được đăng ký trước đây, hãy bấm nút Quay Lại và tiến hành đăng nhập lại.',
        });
      }
    }
  };

  const goBackToLoginScreen = () => {
    setIsShowRegisterSuccessfulAlert(false);
    firebaseApp.auth().signOut();
    setIsNotRegistered(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <ScrollView>
      <Box safeArea p="2">
        <VStack justifyContent="center" alignItems="center" mt="30px">
          <Image source={medHLogo} alt="Alternate Text" height={120} resizeMode="contain" />
          <Heading fontWeight="bold" color="coolGray.800" size="lg" mt="25px">
            ĐĂNG KÝ TÀI KHOẢN
          </Heading>
        </VStack>
        <VStack space={2} px={8} mt="20px">
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Họ Và Tên:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="Họ Và Tên"
              fontSize={16}
              height={50}
              onChangeText={(value) => setFormRegisterData({ ...formRegisterData, name: value })}
            />
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Giới Tính:</FormControl.Label>
            <Select
              height={50}
              borderColor="info.500"
              accessibilityLabel="Giới Tính"
              placeholder="Giới Tính"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              fontSize={16}
              onValueChange={(value) => setFormRegisterData({ ...formRegisterData, gender: value })}
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
              height={50}
              isReadOnly
              value={moment(date).format('DD/MM/YYYY')}
              onValueChange={(value) =>
                setFormRegisterData({ ...formRegisterData, dateOfBirth: value })
              }
              InputRightElement={
                <Icon
                  as={<AntDesign name="calendar" />}
                  size={5}
                  mr="1"
                  color="muted.400"
                  onPress={showDatepicker}
                />
              }
            />
            <FormControl.ErrorMessage></FormControl.ErrorMessage>
          </FormControl>

          {isShowDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              is24Hour={true}
              onChange={onChangeDatePicker}
            />
          )}
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>CMND/CCCD:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="CMND/CCCD"
              fontSize={16}
              height={50}
              onChangeText={(value) => setFormRegisterData({ ...formRegisterData, cmnd: value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Số Điện Thoại:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="Số Điện Thoại"
              fontSize={16}
              height={50}
              defaultValue={firebaseApp.auth().currentUser?.phoneNumber}
              isReadOnly={isReadOnlyPhoneNumberField}
              onChangeText={(value) => setFormRegisterData({ ...formRegisterData, mobile: value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Email:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="Email"
              fontSize={16}
              height={50}
              value={firebaseApp.auth().currentUser?.email}
              isReadOnly={isReadOnlyEmailField}
              onChangeText={(value) => setFormRegisterData({ ...formRegisterData, email: value })}
            />
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Bệnh Viện Công Tác:</FormControl.Label>
            <Select
              height={50}
              borderColor="info.500"
              accessibilityLabel="Bệnh Viện Công Tác"
              placeholder="Bệnh Viện Công Tác"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              fontSize={16}
              onValueChange={(value) =>
                setFormRegisterData({ ...formRegisterData, hospitalId: value })
              }
            >
              {hospitalList.map((hospital) => {
                return <Select.Item key={hospital.id} label={hospital.name} value={hospital.id} />;
              })}
            </Select>
            <FormControl.ErrorMessage></FormControl.ErrorMessage>
          </FormControl>
          <Button
            mt="2"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={handleClickRegister}
          >
            Đăng Ký
          </Button>
          <Button
            mt="2"
            bg="warmGray.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={goBackToLoginScreen}
          >
            Quay lại
          </Button>
        </VStack>
      </Box>
      <AlertDialog isOpen={isShowRegisterSuccessfulAlert}>
        <AlertDialog.Content>
          <AlertDialog.Header>Đăng Ký Thông Tin Thành Công</AlertDialog.Header>
          <AlertDialog.Body>
            Bạn đã đăng ký thông tin thành công. Người quản lý sẽ xem xét đơn đăng ký của bạn, hãy
            đăng nhập lại ứng dụng sau khi bạn nhận được email xác nhận của chúng tôi. Cảm ơn.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button colorScheme="success" onPress={goBackToLoginScreen}>
              Đồng Ý
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </ScrollView>
  );
};

export default Register;
