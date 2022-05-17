import React from 'react';
import { Center, Icon, Text } from 'native-base';
import { Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
const EmptyListMessage = () => {
  return (
    <Center mt={Dimensions.get('window').height / 3}>
      <Icon as={FontAwesome} name="inbox" color="coolGray.400" size={9} mb={1} />
      <Text fontSize="md" bold color="coolGray.400">
        Không Có Dữ Liệu
      </Text>
      <Text fontSize="md" bold color="coolGray.400">
        Vuốt Xuống Để Cập Nhật Lại
      </Text>
    </Center>
  );
};

export default EmptyListMessage;
