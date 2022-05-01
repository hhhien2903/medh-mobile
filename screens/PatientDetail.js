import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import { HStack, VStack, Box, Divider, Button, ScrollView } from 'native-base';
import { LineChart } from 'react-native-chart-kit';
const PatientDetail = (props) => {
  const { id } = props.route.params;
  const tempTestData = [
    {
      date: '18/04/2022',
      hour: '01:00',
      temp: 38,
    },
    {
      date: '18/04/2022',
      hour: '02:00',
      temp: 38,
    },
    {
      date: '18/04/2022',
      hour: '03:00',
      temp: 39,
    },
    {
      date: '18/04/2022',
      hour: '04:00',
      temp: 40,
    },
    {
      date: '18/04/2022',
      hour: '05:00',
      temp: 39.5,
    },
    {
      date: '18/04/2022',
      hour: '06:00',
      temp: 39,
    },
    {
      date: '18/04/2022',
      hour: '07:00',
      temp: 39,
    },
    {
      date: '18/04/2022',
      hour: '08:00',
      temp: 40,
    },
    {
      date: '18/04/2022',
      hour: '09:00',
      temp: 39,
    },
    // {
    //   date: '18/04/2022',
    //   hour: '10:00',
    //   temp: 39.5,
    // },
    // {
    //   date: '18/04/2022',
    //   hour: '11:00',
    //   temp: 39,
    // },
    // {
    //   date: '18/04/2022',
    //   hour: '12:00',
    //   temp: 40,
    // },
    // {
    //   date: '18/04/2022',
    //   hour: '13:00',
    //   temp: 39.5,
    // },
    // {
    //   date: '18/04/2022',
    //   hour: '14:00',
    //   temp: 39.5,
    // },
    // {
    //   date: '18/04/2022',
    //   hour: '15:00',
    //   temp: 39,
    // },
    // {
    //   date: '18/04/2022',
    //   hour: '16:00',
    //   temp: 38.5,
    // },
    // {
    //   date: '18/04/2022',
    //   hour: '17:00',
    //   temp: 38,
    // },
  ];

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
            <Text style={style.content}>Gleda</Text>
          </HStack>
          <HStack py="4" px="5" justifyContent="space-between">
            <Text style={style.title}>Ngày Sinh:</Text>
            <Text style={style.content}>29/01/2000</Text>
          </HStack>
          <HStack py="4" px="5" justifyContent="space-between">
            <Text style={style.title}>Tuổi:</Text>
            <Text style={style.content}>22</Text>
          </HStack>
          <HStack py="4" px="5" justifyContent="space-between">
            <Text style={style.title}>Bệnh Điều Trị:</Text>
            <Text style={style.content}>COVID-19</Text>
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
      {/* <View style={{ paddingLeft: 8, paddingRight: 8 }}>
        <Button background="#1E96F0">Xem Biểu Đồ</Button>
      </View> */}
      <View>
        <ScrollView>
          <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
            <LineChart
              data={{
                labels: tempTestData?.map((temp) => temp.hour),
                datasets: [
                  {
                    data: tempTestData?.map((temp) => temp.temp),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 15} // from react-native
              height={220}
              // yAxisLabel="°C"
              yAxisSuffix="°C"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: '#E8985E',
                backgroundGradientFrom: '#86836D',
                backgroundGradientTo: '#A9714B',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                // marginRight: 2,
                // marginLeft: 2,
                // padding: 5,
                borderRadius: 10,
              }}
            />
          </Box>
        </ScrollView>
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
