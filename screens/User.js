import React from 'react';
import sharedStore from '../store/sharedStore';
import {
  Avatar,
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Input,
  Select,
  VStack,
} from 'native-base';
import moment from 'moment';
import { firebaseApp } from '../config/firebase';
const User = () => {
  const { currentUser } = sharedStore((state) => state);
  console.log(currentUser);
  return (
    <Box safeArea>
      <HStack justifyContent="center" alignItems="center">
        <Avatar
          size="24"
          source={{
            uri: 'https://toppng.com/download/CXqldcjqijUp3pm9wblOt6jfIYzKs7qoeB19NP2sWgukAHrNrV75vgbTJc6NPraxaGLiAfzisu0M6HrtTAzv0HUcKbNwXxgayR5Aj6PxXZL0SxSErsYv24ePRh75JjbTROoS3wRNcPAjknQrVIxGxZgfYuWJbZKMUvYBc8C8dh6iED9bfEhwRKbVbzg4zsDBLdXukwXP/large',
          }}
        ></Avatar>
      </HStack>
      <VStack space={3} px={5} mt="3">
        <FormControl isRequired>
          <FormControl.Label _text={{ fontSize: 15 }}>Họ Và Tên:</FormControl.Label>
          <Input
            borderColor="gray.500"
            // InputLeftElement={
            //   <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
            // }
            placeholder="Họ Và Tên"
            fontSize={16}
            height="10"
            value={currentUser.name}
            // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label _text={{ fontSize: 15 }}>Số Điện Thoại:</FormControl.Label>
          <Input
            borderColor="gray.500"
            // InputLeftElement={
            //   <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
            // }
            isReadOnly="true"
            placeholder="Số Điện Thoại"
            fontSize={16}
            height="10"
            value={currentUser.mobile}
            backgroundColor="#DCDCDC"
            // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label _text={{ fontSize: 17 }}>Email:</FormControl.Label>
          <Input
            // InputLeftElement={
            //   <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
            // }
            borderColor="gray.500"
            sReadOnly="true"
            placeholder="Email"
            fontSize={16}
            height="10"
            value={currentUser.email}
            backgroundColor="#DCDCDC"
            // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label _text={{ fontSize: 15 }}>Giới Tính:</FormControl.Label>
          <Select
            height="10"
            borderColor="gray.500"
            accessibilityLabel="Giới Tính"
            placeholder="Giới Tính"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size={5} />,
            }}
            defaultValue={currentUser.gender}
            fontSize={16}

            // onValueChange={(value) => setFormRegisterData({ ...formRegisterData, gender: value })}
          >
            <Select.Item label="Nam" value={true} />
            <Select.Item label="Nữ" value={false} />
          </Select>

          <FormControl.ErrorMessage></FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label _text={{ fontSize: 17 }}>Ngày Sinh:</FormControl.Label>
          <Input
            borderColor="info.500"
            placeholder="Ngày Sinh"
            fontSize={16}
            height="10"
            isReadOnly
            value={moment(currentUser.dateOfBirth).format('DD/MM/YYYY')}
            // onValueChange={(value) =>
            //   setFormRegisterData({ ...formRegisterData, dateOfBirth: value })
            // }
            // InputRightElement={
            //   <Icon
            //     as={<AntDesign name="calendar" />}
            //     size={5}
            //     mr="1"
            //     color="muted.400"
            //     onPress={showDatepicker}
            //   />
            // }
          />
          <FormControl.ErrorMessage></FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label _text={{ fontSize: 15 }}>CMND/CCCD:</FormControl.Label>
          <Input
            // InputLeftElement={
            //   <Icon as={<AntDesign name="mobile1" />} size={5} ml="2" color="muted.400" />
            // }
            borderColor="gray.500"
            sReadOnly="true"
            placeholder="CMND/CCCD"
            fontSize={16}
            height="10"
            value={currentUser.cmnd}
            backgroundColor="#DCDCDC"
            // onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
          />
        </FormControl>
        <Button onPress={() => firebaseApp.auth().signOut()}>Đăng Xuất</Button>
        {/* <FormControl isRequired>
          <FormControl.Label _text={{ fontSize: 15 }}>Bệnh Viện Công Tác:</FormControl.Label>
          <Select
            height="10"
            borderColor="info.500"
            accessibilityLabel="Bệnh Viện Công Tác"
            placeholder="Bệnh Viện Công Tác"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size={5} />,
            }}
            mt="1"
            fontSize={16}
            // onValueChange={(value) =>
            //   setFormRegisterData({ ...formRegisterData, hospitalId: value })
            // }
          >
          </Select>
          <FormControl.ErrorMessage></FormControl.ErrorMessage>
        </FormControl> */}
        {/* <Button
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
        </Button> */}
      </VStack>
    </Box>
  );
};

export default User;
