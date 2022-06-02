import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from 'firebase';
import { useFormik } from 'formik';
import {
  AlertDialog,
  Box,
  Button,
  FormControl,
  Heading,
  Icon,
  Image,
  Input,
  KeyboardAvoidingView,
  Text,
  useToast,
  VStack,
} from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import * as Yup from 'yup';
import medHLogo from '../assets/images/med_we_vertical.png';
import { firebaseApp } from '../config/firebase';
import sharedStore from '../store/sharedStore';
import { phoneNumberRegex } from '../utils/regex';
const LoginPhone = () => {
  const recaptchaVerifier = useRef();
  const [verificationId, setVerificationId] = useState();
  const navigation = useNavigation();
  const toast = useToast();
  const {
    setIsLoadingSpinnerOverLay,
    setIsShowRegisterSuccessfulAlert,
    isNotRegistered,
    setIsNotRegistered,
    isShowRegisterSuccessfulAlert,
  } = sharedStore((state) => state);

  const formik = useFormik({
    initialValues: {
      mobile: '',
      otpCode: '',
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .matches(phoneNumberRegex, 'Số Điện Thoại không đúng định dạng.')
        .required('Số Điện Thoại không được để trống.'),
      otpCode: Yup.string()
        .matches(new RegExp(/^[0-9]{1,6}$\b/), 'Mã OTP không đúng định dạng.')
        .required('Mã OTP không được để trống.'),
    }),

    onSubmit: () => {
      handleSubmitOTP();
    },
  });

  const handleGetOTPCode = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      let phoneNumber = formik.values.mobile;
      if (phoneNumber.substring(0, 2) === '84') {
        phoneNumber = '+' + phoneNumber;
      } else {
        phoneNumber = '+84' + phoneNumber.substring(1, phoneNumber.length);
      }
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      Keyboard.dismiss();
      toast.show({
        title: 'Mã OTP đã được gửi đến Số điện thoại của bạn.',
        status: 'success',
        placement: 'top',
      });
    } catch (err) {
      console.log(err);
      toast.show({
        title: err.message,
        status: 'warning',
        placement: 'top',
      });
    }
  };

  const handleSubmitOTP = async () => {
    try {
      setIsLoadingSpinnerOverLay(true);
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        formik.values.otpCode
      );
      await firebaseApp
        .auth()
        .signInWithCredential(credential)
        .then((value) => {
          setIsLoadingSpinnerOverLay(false);
        });
    } catch (err) {
      console.log(err);
      setIsLoadingSpinnerOverLay(false);
      await toast.closeAll();
      toast.show({
        title: 'Mã OTP không đúng!',
        status: 'warning',
        placement: 'top',
      });
    }
  };

  const goBackToLoginScreen = () => {
    firebaseApp.auth().signOut();
    setIsNotRegistered(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  useEffect(() => {
    if (isNotRegistered) {
      console.log('login nhung chua dang ky ne');
      navigation.navigate('Register');
    }
  }, [isNotRegistered]);

  return (
    <KeyboardAvoidingView behavior="position">
      <AlertDialog isOpen={isShowRegisterSuccessfulAlert}>
        <AlertDialog.Content>
          <AlertDialog.Header>Đăng Ký Thông Tin Thành Công</AlertDialog.Header>
          <AlertDialog.Body>
            Bạn đã đăng ký thông tin thành công. Người quản lý sẽ xem xét đơn đăng ký của bạn, hãy
            đăng nhập lại ứng dụng sau khi bạn nhận được email xác nhận của chúng tôi. Cảm ơn.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              colorScheme="success"
              onPress={() => {
                setIsShowRegisterSuccessfulAlert(false);
                goBackToLoginScreen();
              }}
            >
              Đồng Ý
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Box safeArea p="2">
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseApp.options}
          androidHardwareAccelerationDisabled
          attemptInvisibleVerification
        />
        <VStack justifyContent="center" alignItems="center" mt="50px">
          <Image source={medHLogo} alt="Alternate Text" height={150} resizeMode="contain" />
          <Heading fontWeight="bold" color="coolGray.800" size="lg" mt="25px">
            TIẾP TỤC VỚI SỐ ĐIỆN THOẠI
          </Heading>
        </VStack>
        <VStack space={4} px={4} mt="25px">
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Số Điện Thoại:</FormControl.Label>
            <Input
              borderColor="info.500"
              InputLeftElement={
                <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
              }
              placeholder="Số Điện Thoại"
              fontSize={16}
              height={50}
              value={formik.values.mobile}
              onChangeText={formik.handleChange('mobile')}
            />
            {formik.errors.mobile && <Text color="danger.500">{formik.errors.mobile}</Text>}
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Mã OTP:</FormControl.Label>
            <Input
              borderColor="info.500"
              InputLeftElement={
                <Icon as={<AntDesign name="lock" />} size={5} ml="2" color="muted.400" />
              }
              placeholder="Mã OTP"
              fontSize={16}
              height={50}
              value={formik.values.otpCode}
              InputRightElement={
                <Button
                  rounded="none"
                  w="1/3"
                  h="full"
                  bg="info.500"
                  _text={{ fontWeight: 'bold' }}
                  onPress={handleGetOTPCode}
                  isDisabled={
                    formik.errors.mobile ? true : false || !formik.values.mobile ? true : false
                  }
                >
                  Nhận OTP
                </Button>
              }
              onChangeText={formik.handleChange('otpCode')}
            />
            {formik.errors.otpCode && formik.touched.otpCode && (
              <Text color="danger.500">{formik.errors.otpCode}</Text>
            )}
          </FormControl>

          <Button
            mt="2"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={formik.handleSubmit}
          >
            Đăng Nhập
          </Button>
          <Button
            mt="5"
            bg="warmGray.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={goBackToLoginScreen}
          >
            Quay lại
          </Button>
        </VStack>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default LoginPhone;
