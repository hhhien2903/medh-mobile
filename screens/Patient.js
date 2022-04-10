import { Avatar, Box, FlatList, Spacer, HStack, VStack, Stack } from 'native-base';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { firebaseApp } from '../config/firebase';
import ActionButton from 'react-native-circular-action-menu';
import sharedStore from '../store/sharedStore';
import { useNavigation } from '@react-navigation/native';
const Patient = ({ navigation }) => {
  const { currentUser } = sharedStore((state) => state);
  // const navigation = useNavigation();
  const dataTest = [
    {
      id: 4,
      uuid: '771c5de8-c26f-4e0f-8b76-d8a3f6915dac',
      createdAt: '2022-03-27T00:00:00.000Z',
      updatedAt: '2022-03-27T00:00:00.000Z',
      cmnd: '717-09-3854',
      dateOfBirth: '2021-11-30T05:49:59.000Z',
      email: 'gthirlwall0@soup.io',
      gender: true,
      insuranceCode: '30009282824718',
      mobile: '5916807257',
      name: 'Gleda',
      surname: 'Thirlwall',
      address: 'China',
      search: 'Gleda Thirlwall',
      cityId: 34,
      districtId: 588,
      wardId: 20996,
      temp: 37,
      avatarUrl: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
    },
    {
      id: 5,
      uuid: '1013d352-0dea-49b4-b504-3f8a2719d547',
      createdAt: '2022-03-27T00:00:00.000Z',
      updatedAt: '2022-03-27T00:00:00.000Z',
      cmnd: '484-35-2686',
      dateOfBirth: '2021-05-29T04:53:51.000Z',
      email: 'vbalcon1@constantcontact.com',
      gender: false,
      insuranceCode: '6379758122670733',
      mobile: '5652116523',
      name: 'Vanny',
      surname: 'Balcon',
      address: 'Iran',
      search: 'Vanny Balcon',
      cityId: 35,
      districtId: 588,
      wardId: 20999,
      temp: 38,
      avatarUrl: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
    },
    {
      id: 6,
      uuid: '5c2b5eaf-6d02-42e7-a167-d0cf061d97cc',
      createdAt: '2022-03-27T00:00:00.000Z',
      updatedAt: '2022-03-27T00:00:00.000Z',
      cmnd: '594-05-8317',
      dateOfBirth: '2021-09-12T10:40:59.000Z',
      email: 'wwylder2@cnn.com',
      gender: true,
      insuranceCode: '5602235758900354',
      mobile: '3974480088',
      name: 'Wileen',
      surname: 'Wylder',
      address: 'Indonesia',
      search: 'Wileen Wylder',
      temp: 37.5,
      cityId: 36,
      districtId: 588,
      wardId: 20992,
      avatarUrl: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
    },
  ];
  return (
    <View style={{ height: '100%' }}>
      <Button title="Test" onPress={() => navigation.navigate('PatientDetail')}></Button>
      <FlatList
        data={dataTest}
        renderItem={({ item }) => (
          <Box
            borderBottomWidth="1"
            _dark={{
              borderColor: 'gray.600',
            }}
            borderColor="coolGray.200"
            height="20"
            pl="4"
            pr="5"
            py="2"
          >
            <HStack space={3} justifyContent="space-between" alignItems="center" height="100%">
              <Avatar
                size="48px"
                source={{
                  uri: item.avatarUrl,
                }}
              />
              <VStack>
                <Text
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  color="coolGray.800"
                  bold
                >
                  {item.name}
                </Text>
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}
                >
                  Nhiệt độ: {item.temp} °C
                </Text>
              </VStack>
              <Spacer />
              <Text
                fontSize="xs"
                _dark={{
                  color: 'warmGray.50',
                }}
                color="coolGray.800"
                alignSelf="flex-start"
              >
                {item.timeStamp}
              </Text>
            </HStack>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={{ position: 'absolute', bottom: 25, right: 60 }}>
        <ActionButton
          buttonColor="#1890FF"
          onPress={() => {
            console.log('hi');
          }}
        />
      </View>
    </View>
  );
};

export default Patient;
