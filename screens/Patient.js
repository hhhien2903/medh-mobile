import {
  Avatar,
  Box,
  FlatList,
  Spacer,
  HStack,
  VStack,
  Stack,
  Pressable,
  Input,
  Icon,
  IconButton,
  useToast,
  Text,
  Tooltip,
} from 'native-base';
import React, { useState, useEffect } from 'react';
import { View, RefreshControl, Keyboard } from 'react-native';
import ActionButton from 'react-native-circular-action-menu';
import sharedStore from '../store/sharedStore';
import doctorAPI from '../api/doctorAPI';
import medicalRecordAPI from '../api/medicalRecordAPI';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import EmptyListMessage from '../components/EmptyListMessage';
const Patient = ({ navigation }) => {
  const { currentUser } = sharedStore((state) => state);
  // const navigation = useNavigation();
  const [medicalRecordSource, setMedicalRecordSource] = useState([]);
  const { setIsLoadingSpinnerOverLay, filterTreatedMedicalRecord, setFilterTreatedMedicalRecord } =
    sharedStore((state) => state);
  const [inputSearch, setInputSearch] = useState('');
  const [isRefreshActive, setIsRefreshActive] = useState(false);
  const toast = useToast();

  const getBackgroundStatus = (status) => {
    if (status === 1) {
      return {
        backgroundColor: '#a1e887',
      };
    }
    if (status === 2) {
      return {
        backgroundColor: '#f08080',
      };
    }
  };

  const getAllMedicalRecordByDoctorId = async (treated) => {
    try {
      setIsLoadingSpinnerOverLay(true);
      const medicalRecordResult = await medicalRecordAPI.getAllMedicalRecordByDoctorId(
        currentUser?.id,
        treated
      );
      setMedicalRecordSource(medicalRecordResult);
      setIsLoadingSpinnerOverLay(false);
      setIsRefreshActive(false);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   console.log('back ne');
  //   getAllMedicalRecordByDoctorId(false);
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAllMedicalRecordByDoctorId(false);
    }, [])
  );

  useEffect(() => {
    const handleFilterMedicalRecord = () => {
      setInputSearch('');
      if (filterTreatedMedicalRecord === 'true') {
        getAllMedicalRecordByDoctorId(true);
      } else {
        getAllMedicalRecordByDoctorId(false);
      }
    };
    handleFilterMedicalRecord();
  }, [filterTreatedMedicalRecord]);

  const handleSearchPatient = async () => {
    Keyboard.dismiss();
    if (!inputSearch) {
      if (filterTreatedMedicalRecord === 'true') {
        await getAllMedicalRecordByDoctorId(true);
      } else {
        await getAllMedicalRecordByDoctorId(false);
      }
      return;
    }
    if (filterTreatedMedicalRecord === 'true') {
      setIsLoadingSpinnerOverLay(true);
      const medicalRecordResult = await medicalRecordAPI.getAllMedicalRecordByDoctorId(
        currentUser?.id,
        true
      );
      setIsLoadingSpinnerOverLay(false);
      let searchResult = medicalRecordResult.filter(
        (record) =>
          record.patient.name.includes(inputSearch) || record.patient.surname.includes(inputSearch)
      );
      if (searchResult.length < 1) {
        await toast.closeAll();
        toast.show({
          title: 'Không tìm thấy thông tin.',
          placement: 'top',
        });
      }
      setMedicalRecordSource(searchResult);
      return;
    } else {
      setIsLoadingSpinnerOverLay(true);
      const medicalRecordResult = await medicalRecordAPI.getAllMedicalRecordByDoctorId(
        currentUser?.id,
        false
      );
      setIsLoadingSpinnerOverLay(false);
      let searchResult = medicalRecordResult.filter(
        (record) =>
          record.patient.name.includes(inputSearch) || record.patient.surname.includes(inputSearch)
      );
      if (searchResult.length < 1) {
        await toast.closeAll();
        toast.show({
          title: 'Không tìm thấy thông tin.',
          placement: 'top',
        });
      }
      setMedicalRecordSource(searchResult);
      return;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshActive(true);
    if (filterTreatedMedicalRecord === 'true') {
      await getAllMedicalRecordByDoctorId(true);
    } else {
      await getAllMedicalRecordByDoctorId(false);
    }

    setInputSearch('');
  };

  return (
    <View style={{ height: '100%' }}>
      <HStack mt={2} mb={2} justifyContent="center">
        <Input
          placeholder="Tìm Kiếm Bệnh Nhân"
          borderRadius="4"
          // py="2"
          bg="#FFFFFF"
          px="1"
          fontSize="14"
          width="80%"
          InputLeftElement={
            <Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />
          }
          value={inputSearch}
          onChangeText={(value) => setInputSearch(value)}
        />
        <IconButton
          background="#8D909B"
          _pressed={{ bg: 'rgba(52, 52, 52, 0.2)' }}
          width="50"
          ml={2}
          onPress={handleSearchPatient}
          icon={<Icon as={<Ionicons name="search" />} color="white" size={5} />}
        />
      </HStack>

      <FlatList
        ListEmptyComponent={<EmptyListMessage />}
        data={medicalRecordSource}
        refreshControl={<RefreshControl refreshing={isRefreshActive} onRefresh={handleRefresh} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('PatientDetail', { medicalRecordId: item.id })}
          >
            <Box
              borderBottomWidth="1"
              _dark={{
                borderColor: 'gray.600',
              }}
              borderColor="coolGray.200"
              height="20"
              bg="#FFFFFF"
              pl="4"
              pr="5"
              py="2"
              key={item?.patient.id}
              // style={getBackgroundStatus(item.status)}
            >
              <HStack space={3} justifyContent="space-between" alignItems="center" height="100%">
                <Avatar
                  size="48px"
                  source={{
                    uri: item?.patient.avatarUrl,
                  }}
                  background="#759FBC"
                >
                  {item?.patient.name.substring(0, 1)}
                </Avatar>
                <VStack>
                  <Text
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800"
                    bold
                    style={{ marginBottom: 5 }}
                  >
                    {`${item.patient.surname} ${item.patient.name}`}
                  </Text>
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                  >
                    Bệnh: {item?.diseases.name}
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
          </Pressable>
        )}
        keyExtractor={(item) => item?.id.toString()}
      />
      <View style={{ position: 'absolute', bottom: 15, right: 15 }}>
        {/* <ActionButton
          buttonColor="#1890FF"
          onPress={() => {
            console.log('hi');
          }}
        /> */}

        <IconButton
          onPress={() => navigation.navigate('AddMedicalRecord')}
          bg="#1890FF"
          borderRadius="full"
          size={65}
          _icon={{ size: 25 }}
          _pressed={{ bg: 'rgba(52, 52, 52, 0.2)' }}
          icon={<Icon as={<AntDesign name="plus" />} color="white" />}
        />
      </View>
    </View>
  );
};

export default Patient;
