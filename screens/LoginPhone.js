import { Keyboard } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import {
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  VStack,
  Box,
  Icon,
  Image,
  HStack,
  KeyboardAvoidingView,
  AlertDialog,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import medHLogo from '../assets/images/med-h-logo.png';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseApp, OAuthConfig } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase';
import { useToast } from 'native-base';
import sharedStore from '../store/sharedStore';
const LoginPhone = () => {
  const recaptchaVerifier = useRef();
  // const [phoneNumber, setPhoneNumber] = useState();
  const [verificationId, setVerificationId] = useState();
  // const [verificationCode, setVerificationCode] = useState();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const navigation = useNavigation();

  const toast = useToast();
  const {
    isLoadingSpinnerOverLay,
    setIsLoadingSpinnerOverLay,
    setIsShowRegisterSuccessfulAlert,
    isNotRegistered,
    setIsNotRegistered,
    isShowRegisterSuccessfulAlert,
  } = sharedStore((state) => state);

  const validateForm = (validateField) => {
    switch (validateField) {
      case 'phoneNumberField': {
        const phoneRegex = new RegExp(/(^(84|0)[3|5|7|8|9])+([0-9]{8})\b/);
        if (!formData.phoneNumber) {
          toast.show({
            title: 'Số điện thoại không được để trống.',
            status: 'warning',
            placement: 'top',
          });
          return false;
        }
        if (!phoneRegex.test(formData.phoneNumber)) {
          toast.show({
            title: 'Số điện thoại không đúng định dạng.',
            status: 'warning',
            placement: 'top',
          });
          return false;
        }
        return true;
      }
      case 'OTPCodeField': {
        const OTPRegex = new RegExp(/^[0-9]{1,6}$\b/);
        if (!formData.OTPCode) {
          toast.show({
            title: 'Mã OTP không được để trống.',
            status: 'warning',
            placement: 'top',
          });
          return false;
        }
        if (!OTPRegex.test(formData.OTPCode)) {
          toast.show({
            title: 'Mã OTP không đúng định dạng.',
            status: 'warning',
            placement: 'top',
          });
          return false;
        }
        return true;
      }
      default:
        return false;
    }
  };
  const handleGetOTPCode = async () => {
    if (!validateForm('phoneNumberField')) {
      return;
    }
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      let { phoneNumber } = formData;
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
        title: 'Mã OTP đã được gửi!',
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
    if (!validateForm('phoneNumberField') || !validateForm('OTPCodeField')) {
      return;
    }
    try {
      setIsLoadingSpinnerOverLay(true);
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        formData.OTPCode
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

        // description: 'This is to inform you that your network connectivity is restored',
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
        <VStack space={5} px={8} mt="25px">
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
              onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
            />
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
              InputRightElement={
                <Button
                  rounded="none"
                  w="1/3"
                  h="full"
                  bg="info.500"
                  onPress={handleGetOTPCode}
                  isDisabled={!formData.phoneNumber}
                >
                  Nhận OTP
                </Button>
              }
              onChangeText={(value) => setFormData({ ...formData, OTPCode: value })}
            />
            <FormControl.ErrorMessage></FormControl.ErrorMessage>
          </FormControl>

          <Button
            mt="2"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={handleSubmitOTP}
          >
            Đăng Nhập
          </Button>
          <Button
            mt="5"
            bg="trueGray.300"
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
