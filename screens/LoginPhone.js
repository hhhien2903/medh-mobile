import { View, Text } from 'react-native';
import React, { useRef, useState } from 'react';
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
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import medHLogo from '../assets/images/med-h-logo.png';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseApp, OAuthConfig } from '../config/firebase';
import firebase from 'firebase';

const LoginPhone = () => {
  const recaptchaVerifier = useRef();
  const [phoneNumber, setPhoneNumber] = useState();
  const [verificationId, setVerificationId] = useState();
  const [verificationCode, setVerificationCode] = useState();

  const handleGetOTPCode = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      console.log('sended');
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitOTP = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await firebaseApp.auth().signInWithCredential(credential);
      console.log('login success');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <KeyboardAvoidingView behavior="position">
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
            Tiếp Tục Với Số Điện Thoại
          </Heading>
        </VStack>
        <VStack space={5} px={8} mt="25px">
          <FormControl>
            <FormControl.Label _text={{ fontSize: 17 }}>Số Điện Thoại:</FormControl.Label>
            <Input
              borderColor="info.500"
              InputLeftElement={
                <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
              }
              placeholder="Số Điện Thoại"
              fontSize={16}
              height={50}
              onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
            />
          </FormControl>
          <FormControl>
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
                  isDisabled={!phoneNumber}
                >
                  Nhận OTP
                </Button>
              }
              onChangeText={(otpCode) => setVerificationCode(otpCode)}
            />
          </FormControl>

          <Button
            mt="5"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18 }}
            onPress={handleSubmitOTP}
          >
            Đăng Nhập
          </Button>
        </VStack>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default LoginPhone;
