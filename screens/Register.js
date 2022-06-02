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
  Text,
} from 'native-base';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import medHLogo from '../assets/images/med_we_vertical.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { firebaseApp } from '../config/firebase';
import sharedStore from '../store/sharedStore';
import doctorAPI from '../api/doctorAPI';
import hospitalAPI from '../api/hospitalAPI';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { emailRegex, phoneNumberRegex, vietnameseNameRegex } from '../utils/regex';

const Register = () => {
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  // const [date, setDate] = useState(new Date(946713509000));
  const navigation = useNavigation();
  const { setIsNotRegistered, isShowRegisterSuccessfulAlert, setIsShowRegisterSuccessfulAlert } =
    sharedStore((state) => state);
  const [isReadOnlyPhoneNumberField, setIsReadOnlyPhoneNumberField] = useState(false);
  const [isReadOnlyEmailField, setIsReadOnlyEmailField] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);
  const [isVisibleConfirmCreateDialog, setIsVisibleConfirmCreateDialog] = useState(false);
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
    formik.setFieldValue('dateOfBirth', currentDate);
  };

  const checkExistingInfo = () => {
    const { email, phoneNumber } = firebaseApp.auth().currentUser;
    // setCurrentUser({ email: email, mobile: phoneNumber });
    // formik.setFieldValue({ email: email, mobile: phoneNumber });
    formik.setFieldValue('email', email ? email : '');
    formik.setFieldValue('mobile', phoneNumber ? phoneNumber.replace('+84', '0') : '');

    if (email) {
      setIsReadOnlyEmailField(true);
    }
    if (phoneNumber) {
      setIsReadOnlyPhoneNumberField(true);
    }
  };

  const getAllHospital = async () => {
    try {
      const result = await hospitalAPI.getAllHospital();
      setHospitalList(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkExistingInfo();
    getAllHospital();
  }, []);

  const handleClickRegister = async () => {
    try {
      const data = {
        ...formik.values,
        dateOfBirth: moment(formik.values.dateOfBirth).toISOString(),
      };
      console.log(data);
      const result = await doctorAPI.register(data);
      setIsShowRegisterSuccessfulAlert(true);
      setIsVisibleConfirmCreateDialog(false);
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
        return;
      } else {
        setIsShowRegisterSuccessfulAlert(true);
        setIsVisibleConfirmCreateDialog(false);
      }
    }
  };

  const goBackToLoginScreen = () => {
    setIsShowRegisterSuccessfulAlert(false);
    firebaseApp.auth().signOut();
    setIsNotRegistered(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const formik = useFormik({
    initialValues: {
      mobile: '',
      email: '',
      name: '',
      gender: '',
      cmnd: '',
      hospitalId: null,
      dateOfBirth: new Date(946713509000),
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, 'Họ Và Tên tối thiểu 5 ký tự trở lên.')
        .matches(vietnameseNameRegex, 'Họ Và Tên không đúng định dạng.')
        .required('Họ Và Tên không được để trống.'),
      cmnd: Yup.string()
        .min(9, 'CMND tối thiểu 9 ký tự trở lên.')
        .matches(new RegExp(/^[0-9]+$/), 'CMND chỉ được chứa ký tự số.')
        .required('CMND Không được để trống.'),
      email: Yup.string()
        .required('Email không được để trống.')
        .matches(emailRegex, 'Email không đúng định dạng.'),
      mobile: Yup.string()
        .matches(phoneNumberRegex, 'Số Điện Thoại không đúng định dạng.')
        .required('Số Điện Thoại không được để trống.'),
      gender: Yup.boolean().required('Giới Tính không được để trống.'),
      hospitalId: Yup.number().typeError('Bệnh Viện Công Tác không được để trống.'),
    }),

    onSubmit: (form) => {
      // console.log(form);
      // setFormData(form);
      // handleVisibleConfirmDialogUpdateInfo();
      setIsVisibleConfirmCreateDialog(true);
    },
  });

  return (
    <ScrollView>
      <Box safeArea p="2">
        <VStack justifyContent="center" alignItems="center" mt="30px">
          <Image source={medHLogo} alt="Alternate Text" height={140} resizeMode="contain" />
          <Heading fontWeight="bold" color="coolGray.800" size="lg" mt="15px">
            ĐĂNG KÝ TÀI KHOẢN
          </Heading>
        </VStack>
        <VStack space={2} px={4} mt="15px">
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Họ Và Tên:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="Họ Và Tên"
              fontSize={16}
              height={50}
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
            />
            {formik.errors.name && formik.touched.name && (
              <Text color="danger.500">{formik.errors.name}</Text>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Giới Tính:</FormControl.Label>
            <Select
              height={50}
              borderColor="info.500"
              accessibilityLabel="Giới Tính"
              placeholder="Giới Tính"
              _selectedItem={{
                bg: 'blue.300',
                borderRadius: '5',
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              fontSize={16}
              _item={{ _pressed: { bg: 'gray.400', borderRadius: '5' }, mb: 1 }}
              selectedValue={formik.values?.gender}
              onValueChange={(value) => formik.setFieldValue('gender', value)}
            >
              <Select.Item label="Nam" value={true} />
              <Select.Item label="Nữ" value={false} />
            </Select>
            {formik.errors.gender && formik.touched.gender && (
              <Text color="danger.500">{formik.errors.gender}</Text>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Ngày Sinh:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="Ngày Sinh"
              fontSize={16}
              height={50}
              isReadOnly
              value={moment(formik.values?.dateOfBirth).format('DD/MM/YYYY')}
              // onValueChange={(value) =>
              //   setFormRegisterData({ ...formRegisterData, dateOfBirth: value })
              // }
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
            <FormControl.Label _text={{ fontSize: 17 }}>CMND / CCCD:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="CMND/CCCD"
              fontSize={16}
              height={50}
              value={formik.values.cmnd}
              onChangeText={formik.handleChange('cmnd')}
            />
          </FormControl>
          {formik.errors.cmnd && formik.touched.cmnd && (
            <Text color="danger.500">{formik.errors.cmnd}</Text>
          )}
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Số Điện Thoại:</FormControl.Label>
            <Input
              borderColor="info.500"
              _readOnly={{ bg: 'gray.300' }}
              placeholder="Số Điện Thoại"
              fontSize={16}
              height={50}
              value={formik.values?.mobile}
              isReadOnly={isReadOnlyPhoneNumberField}
              onChangeText={formik.handleChange('mobile')}
            />
            {formik.errors.mobile && formik.touched.mobile && (
              <Text color="danger.500">{formik.errors.mobile}</Text>
            )}
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Email:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="Email"
              fontSize={16}
              height={50}
              _readOnly={{ bg: 'gray.300' }}
              value={formik.values.email}
              isReadOnly={isReadOnlyEmailField}
              onChangeText={formik.handleChange('email')}
            />
            {formik.errors.email && formik.touched.email && (
              <Text color="danger.500">{formik.errors.email}</Text>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Bệnh Viện Công Tác:</FormControl.Label>
            <Select
              height={50}
              borderColor="info.500"
              accessibilityLabel="Bệnh Viện Công Tác"
              placeholder="Bệnh Viện Công Tác"
              _selectedItem={{
                bg: 'blue.300',
                borderRadius: '5',
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              fontSize={16}
              _item={{ _pressed: { bg: 'gray.400', borderRadius: '5' }, mb: 1 }}
              selectedValue={formik.values?.hospitalId}
              onValueChange={(value) => formik.setFieldValue('hospitalId', value)}
            >
              {hospitalList.map((hospital) => {
                return <Select.Item key={hospital.id} label={hospital.name} value={hospital.id} />;
              })}
            </Select>
            {formik.errors.hospitalId && formik.touched.hospitalId && (
              <Text color="danger.500">{formik.errors.hospitalId}</Text>
            )}
          </FormControl>
          <Button
            mt="2"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={formik.handleSubmit}
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

      <AlertDialog
        isOpen={isVisibleConfirmCreateDialog}
        onClose={() => setIsVisibleConfirmCreateDialog(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Xác Nhận</AlertDialog.Header>
          <AlertDialog.Body>Bạn có chắc chắn với các thông tin đã nhập?</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setIsVisibleConfirmCreateDialog(false)}
              >
                Huỷ
              </Button>
              <Button colorScheme="primary" onPress={() => handleClickRegister()}>
                Đồng Ý
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </ScrollView>
  );
};

export default Register;
