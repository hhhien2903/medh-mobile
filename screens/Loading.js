import React, { useEffect } from 'react';
import { Spinner, HStack, Heading, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { firebaseApp } from '../config/firebase';
const Loading = () => {
  const navigation = useNavigation();
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
      <HStack space={2} alignItems="center" justifyContent="center">
        <Spinner accessibilityLabel="Loading" size="lg" style={{ height: 100 }} />
        <Heading color="info.500" fontSize="lg">
          Loading
        </Heading>
      </HStack>
    </Center>
  );
};

export default Loading;
