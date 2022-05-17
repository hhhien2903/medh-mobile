import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  Image,
  AlertDialog,
} from 'native-base';
import medHLogo from '../assets/images/med-h-logo.png';
import { firebaseApp, OAuthConfig } from '../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import sharedStore from '../store/sharedStore';
import { useFocusEffect } from '@react-navigation/native';

export const Login = () => {
  const navigation = useNavigation();
  const {
    setCurrentUser,
    tokenTest,
    isNotRegistered,
    isLoadingSpinnerOverLay,
    setIsLoadingSpinnerOverLay,
    isShowRegisterSuccessfulAlert,
    setIsShowRegisterSuccessfulAlert,
    setIsNotRegistered,
    isShowDisabledAlert,
    setIsShowDisabledAlert,
    currentUser,
  } = sharedStore((state) => state);
  const handleLoginGoogle = async () => {
    Google.logInAsync(OAuthConfig)
      .then((result) => {
        if (result.type === 'cancel') {
          return;
        }
        onSignIn(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let checkIsNotRegistered = setTimeout(() => {
      if (isNotRegistered) {
        navigation.navigate('Register');
      }
    }, 500);
    return () => {
      clearTimeout(checkIsNotRegistered);
    };
  }, [isNotRegistered]);

  // useEffect(() => {
  //   if (isNotRegistered) {
  //     console.log('login nhung chua dang ky ne');
  //     console.log('why');
  //     navigation.navigate('Register');
  //   }
  // }, []);

  // useFocusEffect(() => {
  //   useCallback(() => {
  //     console.log('login nhung chua dang ky ne');
  //     console.log('why');
  //     // navigation.navigate('Register');
  //   }, []);
  // });

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      let providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = (googleUser) => {
    // console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized
    // Check if we are already signed-in Firebase with the correct user.
    // Build Firebase credential with the Google ID token.
    setIsLoadingSpinnerOverLay(true);
    let credential = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken);
    // Sign in with credential from the Google user.
    firebaseApp
      .auth()
      .signInWithCredential(credential)
      .then((value) => {
        setIsLoadingSpinnerOverLay(false);
      })
      .catch((error) => {
        setIsLoadingSpinnerOverLay(false);
      });
    // .then(function (result) {
    //   console.log('user signed in ', result);
    //   setCurrentUser(result);
    // })
    // .catch(function (error) {
    //   // Handle Errors here.
    //   console.log(error);
    //   // ...
    // });
  };

  const goBackToLoginScreen = () => {
    firebaseApp.auth().signOut();
    setIsNotRegistered(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <Center mt={140}>
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

      <AlertDialog isOpen={isShowDisabledAlert}>
        <AlertDialog.Content>
          <AlertDialog.Header>Tài Khoản Bị Vô Hiệu Hoá</AlertDialog.Header>
          <AlertDialog.Body>
            Tài Khoản của bạn đã bị vô hiệu hoá. Vui lòng liên hệ quản trị viên.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              colorScheme="error"
              onPress={() => {
                setIsShowDisabledAlert(false);
                goBackToLoginScreen();
              }}
            >
              Đồng Ý
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Image source={medHLogo} alt="Alternate Text" height={150} resizeMode="contain" />
      <Box w="80%">
        <HStack justifyContent="center" mt="5">
          {/* <Heading fontWeight="bold" color="coolGray.800" fontSize={30}>
            ĐĂNG NHẬP
          </Heading> */}
        </HStack>
        <VStack space={3} mt="5">
          {/* <Text selectable fontWeight="bold" color="coolGray.800" fontSize={15}>
            {tokenTest}
          </Text>
          <Text selectable fontWeight="bold" color="coolGray.800" fontSize={15}>
            {firebaseApp.auth().currentUser?.email}
          </Text> */}
          <Button
            startIcon={<AntDesign name="google" size={25} color="white" />}
            mt="2"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={() => handleLoginGoogle()}
          >
            Tiếp Tục Với Google
          </Button>
          <Button
            startIcon={<AntDesign name="mobile1" size={25} color="white" />}
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={() => {
              navigation.navigate('LoginPhone');
            }}
          >
            Tiếp Tục Với Số Điện Thoại
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;
