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
import { AuthContext } from '../contexts/AuthProvider';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

export const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const handleLoginGoogle = () => {
    Google.logInAsync(OAuthConfig)
      .then((result) => {
        if (result.type === 'cancel') {
          return;
        }
        onSignIn(result);
        console.log(result);
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
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized

    const unsubscribe = firebaseApp.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        let credential = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken);
        // Sign in with credential from the Google user.
        firebaseApp
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            console.log('user signed in ', result);
            navigation.navigate('Home');
          })
          .catch(function (error) {
            // Handle Errors here.
            console.log(error);
            // ...
          });
      } else {
        navigation.navigate('Home');
        console.log('User already signed-in Firebase.');
      }
    });
  };

  useEffect(() => {
    const checkIfLoggedIn = () => {
      firebaseApp.auth().onAuthStateChanged((user) => {
        if (user) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Login');
        }
      });
    };

    checkIfLoggedIn();
  }, []);
  return (
    <Center flex={1}>
      <Image source={medHLogo} alt="Alternate Text" height={150} resizeMode="contain" />
      <Box mb={350} w="80%">
        <HStack justifyContent="center" mt="5">
          <Heading fontWeight="bold" color="coolGray.800" fontSize={30}>
            Đăng Nhập
          </Heading>
        </HStack>
        <VStack space={3} mt="5">
          <Button
            startIcon={<AntDesign name="google" size={25} color="white" />}
            mt="2"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18 }}
            onPress={() => handleLoginGoogle()}
          >
            Đăng Nhập Với Google
          </Button>
          <Button
            startIcon={<AntDesign name="mobile1" size={25} color="white" />}
            bg="info.500"
            height={50}
            _text={{ fontSize: 18 }}
          >
            Đăng Nhập Với Số Điện Thoại
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
