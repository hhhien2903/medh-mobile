import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { HStack, VStack, Box, Divider, Button } from 'native-base';

const PatientDetail = (props) => {
  const { id } = props.route.params;

  return (
    <View>
      <Box padding={2}>
        <VStack
          divider={<Divider w="96%" ml="2%" bg="muted.50" />}
          borderRadius="md"
          backgroundColor="darkBlue.200"
        >
          <HStack py="4" px="5" justifyContent="space-between">
            <Text style={style.title}>Họ Và Tên:</Text>
            <Text style={style.content}>ABCABC</Text>
          </HStack>
          <HStack py="4" px="5" justifyContent="space-between">
            <Text style={style.title}>Ngày Sinh:</Text>
            <Text style={style.content}>ABCABC</Text>
          </HStack>
          <HStack py="4" px="5" justifyContent="space-between">
            <Text style={style.title}>Tuổi:</Text>
            <Text style={style.content}>ABCABC</Text>
          </HStack>
          <HStack py="4" px="5" justifyContent="space-between">
            <Text style={style.title}>Bệnh Điều Trị:</Text>
            <Text style={style.content}>ABCABC</Text>
          </HStack>
        </VStack>

        {/* <HStack padding={2}>
            <Box border="5" borderRadius="md" backgroundColor="red.400">
              <VStack space="2" divider={<Divider />}>
                <Box px="4" pt="4">
                  NativeBase
                </Box>
                <Box px="4">NativeBase is</Box>
                <Box px="4" pb="4">
                  GeekyAnts
                </Box>

              </VStack>
            </Box> */}
      </Box>
      <View style={{ paddingLeft: 8, paddingRight: 8 }}>
        <Button background="#1E96F0">Xem Biểu Đồ</Button>
      </View>
    </View>
  );
};

export default PatientDetail;

const style = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
  },
});
