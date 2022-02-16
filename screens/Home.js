import React from 'react';
import { View, Text, Button } from 'react-native';
import { firebaseApp } from '../config/firebase';
const Home = () => {
  console.log('home ne', firebaseApp.auth().currentUser);
  return (
    <View>
      <Text>{firebaseApp.auth().currentUser.phoneNumber}</Text>
      <Button title="Sign out" onPress={() => firebaseApp.auth().signOut()} />
    </View>
  );
};

export default Home;
