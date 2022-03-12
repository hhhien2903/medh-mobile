import { AntDesign } from '@expo/vector-icons';
import {
  Box,
  Button,
  FormControl,
  Heading,
  Icon,
  Image,
  Input,
  KeyboardAvoidingView,
  VStack,
  Select,
  CheckIcon,
  ScrollView,
} from 'native-base';
import moment from 'moment';
import React, { useState } from 'react';
import medHLogo from '../assets/images/med-h-logo.png';
import DateTimePicker from '@react-native-community/datetimepicker';
const Register = () => {
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const showDatepicker = () => {
    setIsShowDatePicker(true);
  };
  const onChangeDatePicker = (event, selectedDate) => {
    let currentDate = selectedDate;
    if (!selectedDate) {
      currentDate = new Date();
    }
    setIsShowDatePicker(false);
    setDate(currentDate);
    console.log(currentDate);
  };

  return (
    <ScrollView>
      <Box safeArea p="2">
        <VStack justifyContent="center" alignItems="center" mt="30px">
          <Image source={medHLogo} alt="Alternate Text" height={120} resizeMode="contain" />
          <Heading fontWeight="bold" color="coolGray.800" size="lg" mt="25px">
            ĐĂNG KÝ TÀI KHOẢN
          </Heading>
        </VStack>
        <VStack space={5} px={8} mt="25px">
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Họ Và Tên:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="Họ Và Tên"
              fontSize={16}
              height={50}
              // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
            />
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Giới Tính:</FormControl.Label>
            <Select
              height={50}
              borderColor="info.500"
              accessibilityLabel="Giới Tính"
              placeholder="Giới Tính"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              fontSize={16}
            >
              <Select.Item label="Nam" value="0" />
              <Select.Item label="Nữ" value="1" />
            </Select>
            <FormControl.ErrorMessage></FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Ngày Sinh:</FormControl.Label>
            <Input
              borderColor="info.500"
              placeholder="Ngày Sinh"
              fontSize={16}
              height={50}
              isReadOnly
              value={moment(date).format('DD/MM/YYYY')}
              InputRightElement={
                // <Button
                //   rounded="none"
                //   w="1/3"
                //   h="full"
                //   bg="info.500"
                //   // onPress={handleGetOTPCode}
                //   // isDisabled={!formData.phoneNumber}
                // >
                //   Chọn
                // </Button>
                <Icon
                  as={<AntDesign name="calendar" />}
                  size={5}
                  mr="1"
                  color="muted.400"
                  onPress={showDatepicker}
                />
              }
              // onChangeText={(value) => setFormData({ ...formData, OTPCode: value })}
            />
            <FormControl.ErrorMessage></FormControl.ErrorMessage>
          </FormControl>

          {isShowDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              is24Hour={true}
              onChange={onChangeDatePicker}
            />
          )}

          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 17 }}>Bệnh Viện Công Tác:</FormControl.Label>
            <Select
              height={50}
              borderColor="info.500"
              accessibilityLabel="Bệnh Viện Công Tác"
              placeholder="Bệnh Viện Công Tác"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              fontSize={16}
            >
              <Select.Item label="Chợ Rẫy" value="0" />
              <Select.Item label="Quân Y 115" value="1" />
            </Select>
            <FormControl.ErrorMessage></FormControl.ErrorMessage>
          </FormControl>
          <Button
            mt="2"
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            // onPress={handleSubmitOTP}
          >
            Đăng Ký
          </Button>
          <Button
            mt="5"
            bg="trueGray.300"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={() => {
              navigation.goBack();
              // navigation.navigate('Login');
            }}
          >
            Quay lại
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default Register;
