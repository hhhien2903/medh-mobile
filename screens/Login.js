import React, { useContext, useEffect } from 'react';
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
} from 'native-base';
import medHLogo from '../assets/images/med-h-logo.png';
import { firebaseApp, OAuthConfig } from '../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import sharedStore from '../store/sharedStore';

export const Login = () => {
  const navigation = useNavigation();
  const { setCurrentUser } = sharedStore((state) => state);
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
    let credential = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken);
    // Sign in with credential from the Google user.
    firebaseApp.auth().signInWithCredential(credential);
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

  return (
    <Center mt={140}>
      <Image source={medHLogo} alt="Alternate Text" height={150} resizeMode="contain" />
      <Box w="80%">
        <HStack justifyContent="center" mt="5">
          <Heading fontWeight="bold" color="coolGray.800" fontSize={30}>
            ĐĂNG NHẬP
          </Heading>
        </HStack>
        <VStack space={3} mt="5">
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

          {/* <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}
            >
              I'm a new user.{' '}
            </Text>
            <Link
              _text={{
                color: 'indigo.500',
                fontWeight: 'medium',
                fontSize: 'sm',
              }}
              href="#"
            >
              Sign Up
            </Link>
          </HStack> */}
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;
