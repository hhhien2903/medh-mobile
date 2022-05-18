import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  HStack,
  VStack,
  Box,
  Divider,
  Button,
  ScrollView,
  IconButton,
  Select,
  CheckIcon,
  Modal,
  Input,
  FormControl,
  TextArea,
  Text,
  useToast,
} from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
// import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import medicalRecordAPI from '../api/medicalRecordAPI';
import sharedStore from '../store/sharedStore';
import Chart from '../components/Chart';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-wagmi-charts';
const PatientDetail = (props) => {
  const { medicalRecordId } = props.route.params;
  const {
    setIsLoadingSpinnerOverLay,
    isShowEndMedicalRecord,
    setIsShowEndMedicalRecord,
    setSelectedMedicalRecordDetail,
  } = sharedStore((state) => state);
  const [medicalRecordSource, setMedicalRecordSource] = useState({});
  const [selectedDateChart, setSelectedDateChart] = useState(null);
  const [medicalReportSource, setMedicalReportSource] = useState([]);
  const [listTempDateChart, setListTempDateChart] = useState([]);
  const [chartData, setChartData] = useState([]);

  const toast = useToast();
  const navigation = useNavigation();
  const tempTestData = [
    {
      date: '2022-05-02T04:02:42.367Z',
      hour: '01:00',
      temperature: 38.5,
    },
    {
      date: '2022-05-02T05:03:42.367Z',
      hour: '02:00',
      temperature: 35.5,
    },
    {
      date: '2022-05-02T08:03:42.367Z',
      hour: '03:00',
      temperature: 39.5,
    },
    {
      date: '2022-05-02T10:03:42.367Z',
      hour: '04:00',
      temperature: 40.5,
    },
    {
      date: '2022-05-02T11:03:42.367Z',
      hour: '05:00',
      temperature: 39.5,
    },
    {
      date: '2022-05-02T12:03:42.367Z',
      hour: '06:00',
      temperature: 39.5,
    },
    {
      date: '2022-05-02T13:03:42.367Z',
      hour: '07:00',
      temperature: 39.5,
    },
    {
      date: '2022-05-02T15:03:42.367Z',
      hour: '08:00',
      temperature: 40.5,
    },
    {
      date: '2022-05-02T16:03:42.367Z',
      hour: '09:00',
      temperature: 39.5,
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

  const getMedicalRecordDetail = async () => {
    try {
      setIsLoadingSpinnerOverLay(true);
      const medicalRecordResult = await medicalRecordAPI.getMedicalRecordById(medicalRecordId);
      setMedicalRecordSource(medicalRecordResult);
      setSelectedMedicalRecordDetail(medicalRecordResult);
      setIsLoadingSpinnerOverLay(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getMedicalReportChart = async () => {
    try {
      const medicalReportResult = await medicalRecordAPI.getReportByMedicalRecordId(
        medicalRecordId
      );
      // const medicalReportResult = [...tempTestData];
      setMedicalReportSource(medicalReportResult);
      const filteredDates = medicalReportResult
        .map((temp) => moment(temp.date).format('DD/MM/YYYY'))
        .filter((date, index, arrayDate) => arrayDate.indexOf(date) === index);
      setListTempDateChart(filteredDates);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDateChart = (selectedDate) => {
    setSelectedDateChart(selectedDate);
    const tempList = medicalReportSource.filter(
      (medicalReport) => moment(medicalReport.date).format('DD/MM/YYYY') === selectedDate
    );

    Promise.all(
      tempList.map((temp) => {
        return {
          timestamp: moment(temp.date).format('X'),
          value: temp.temperature,
        };
      })
    ).then((value) => {
      setChartData(value);
    });
    // console.log(chartData);
  };

  useLayoutEffect(() => {
    getMedicalRecordDetail();
    getMedicalReportChart();
  }, []);

  const formik = useFormik({
    initialValues: {
      conclude: '',
    },
    validationSchema: Yup.object({
      conclude: Yup.string().required('Kết Luận không được để trống!'),
    }),

    onSubmit: (form) => {
      handleEndMedicalRecord(form);
    },
  });

  const handleEndMedicalRecord = async (form) => {
    try {
      let sendData = {
        medicalRecordId: medicalRecordId,
        conclude: form.conclude,
      };
      await medicalRecordAPI.endFollowMedicalRecord(sendData);
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Box bg="success.500" px="4" py="4" rounded="sm">
              <Text fontWeight={'bold'} color={'white'}>
                Thao tác thành công.
              </Text>
            </Box>
          );
        },
      });
      setIsShowEndMedicalRecord(false);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Box bg="warmGray.400" px="4" py="4" rounded="sm">
              <Text fontWeight={'bold'} color={'white'}>
                Thao tác không thành công. Hãy thử lại sau.
              </Text>
            </Box>
          );
        },
      });
    }
  };

  const getYAxisLabelValues = () => {
    if (chartData != undefined) {
      let minValue = Math.min(...chartData.map((data) => data.value));
      let maxValue = Math.max(...chartData.map((data) => data.value));
      let midValue = (minValue + maxValue) / 2;
      let lowerMidValue = (minValue + midValue) / 2;
      let higherMidValue = (maxValue + midValue) / 2;

      return [maxValue, higherMidValue, midValue, lowerMidValue, minValue];
    } else {
      return [];
    }
  };

  return (
    <ScrollView>
      <View>
        <Box padding={2}>
          <VStack
            divider={<Divider w="96%" ml="2%" bg={'white'} />}
            borderRadius="md"
            backgroundColor="darkBlue.200"
            // bg={{
            //   linearGradient: {
            //     colors: ['#5691c8', '#457fca'],
            //     start: [0, 0],
            //     end: [1, 0],
            //   },
            // }}
          >
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>Họ Và Tên:</Text>
              <Text
                style={style.content}
              >{`${medicalRecordSource?.patient?.surname} ${medicalRecordSource?.patient?.name}`}</Text>
            </HStack>
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>Ngày Sinh:</Text>
              <Text style={style.content}>
                {moment(medicalRecordSource?.patient?.dateOfBirth).format('DD/MM/YYYY')}
              </Text>
            </HStack>
            {/* <HStack py="3" px="5" justifyContent="space-between">
            <Text style={style.title}>Tuổi:</Text>
            <Text style={style.content}>
              {moment().diff(medicalRecordSource?.patient?.dateOfBirth, 'years')}
            </Text>
          </HStack> */}
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>Bệnh Điều Trị:</Text>
              <Text style={style.content}>{medicalRecordSource?.diseases?.name}</Text>
            </HStack>
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>Chuẩn Đoán:</Text>
              <Text style={style.content}>{medicalRecordSource?.diagnose}</Text>
            </HStack>
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>Ngày Bắt Đầu:</Text>
              <Text style={style.content}>
                {moment(medicalRecordSource?.createdAt).format('DD/MM/YYYY')}
              </Text>
            </HStack>
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>Ngày Kết Thúc:</Text>
              <Text style={style.content}>
                {medicalRecordSource.treated
                  ? moment(medicalRecordSource?.updatedAt).format('DD/MM/YYYY')
                  : 'Chưa có.'}
              </Text>
            </HStack>
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>Thiết Bị:</Text>
              <Text style={style.content}>
                {medicalRecordSource?.medicalRecordDevice?.device?.name}
              </Text>
            </HStack>
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>MAC Thiết Bị:</Text>
              <Text style={style.content}>
                {medicalRecordSource?.medicalRecordDevice?.device?.macAddress}
              </Text>
            </HStack>
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>Kết Luận:</Text>
              <Text style={style.content}>
                {medicalRecordSource?.conclude ? medicalRecordSource?.conclude : 'Chưa có.'}
              </Text>
            </HStack>
            <HStack py="3" px="5" justifyContent="space-between">
              <Text style={style.title}>Tình Trạng:</Text>
              <Text style={style.content}>
                {medicalRecordSource?.treated ? 'Đã Kết Thúc' : 'Đang Điều Trị'}
              </Text>
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
        <Divider my={2} w="96%" ml="2%" height={0.5} />
        <View style={{ paddingTop: 0 }}>
          <HStack justifyContent="space-between" px={3} mb={3} mt={1} alignItems="center">
            <FontAwesome5 name="temperature-high" size={40} color="#71717a" />
            <Select
              borderWidth={2}
              borderColor="gray.500"
              placeholder="Chọn Ngày Xem Biểu Đồ"
              borderRadius={8}
              w="250"
              _selectedItem={{
                endIcon: <CheckIcon size={5} />,
              }}
              placeholderTextColor="gray.700"
              // defaultValue={formData?.gender}
              fontSize={16}
              selectedValue={selectedDateChart}
              onValueChange={(value) => handleChangeDateChart(value)}
            >
              {listTempDateChart.map((date, index) => {
                return <Select.Item key={index} label={date} value={date} />;
              })}

              {/* <Select.Item label="Nữ" value={false} /> */}
            </Select>
          </HStack>

          <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} mb={5}>
            {/* <LineChart
              data={{
                labels: tempTestData?.map((temp) => temp.hour),
                datasets: [
                  {
                    data: tempTestData?.map((temp) => temp.temp),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 15} // from react-native
              height={250}
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
            /> */}
            {chartData.length > 0 && (
              <>
                <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    maxHeight: 30,
                  }}
                >
                  <Text fontSize={18} fontWeight={'bold'}>
                    Biểu Đồ Nhiệt Độ
                  </Text>
                </Box>

                <Box
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'space-between',
                    marginTop: 70,
                    // paddingTop: 10,
                    height: 300,
                    width: '100%',
                  }}
                >
                  {getYAxisLabelValues().map((item, index) => {
                    return (
                      <Box key={index} borderBottomColor="red.200" borderBottomWidth={1}>
                        <Text fontSize="13" fontWeight={'semibold'}>
                          {item} °C
                        </Text>
                      </Box>
                    );
                  })}
                </Box>

                <LineChart.Provider data={chartData}>
                  <LineChart.DatetimeText
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 10,
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}
                    format={({ value }) => {
                      'worklet';

                      let date = new Date(value * 1000);

                      if (date.getFullYear() === 1970) {
                        return '';
                      }

                      return `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
                        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                      }`;
                    }}
                  />
                  <LineChart.PriceText
                    format={({ value }) => {
                      'worklet';

                      return `${value}${!value ? '' : '°C'}`;
                    }}
                    precision={1}
                    style={{
                      position: 'absolute',
                      top: 50,
                      right: 10,
                      fontSize: 18,
                      fontWeight: '500',
                    }}
                  />

                  <LineChart height={300} style={{ marginTop: 80, opacity: 1 }}>
                    <LineChart.Path color="#60a5fa" />
                    <LineChart.CursorCrosshair>
                      {/* <LineChart.Tooltip /> */}
                    </LineChart.CursorCrosshair>
                  </LineChart>
                </LineChart.Provider>
              </>
            )}

            {/* <Chart xKey="hour" y="temp" chartPrices={tempTestData} /> */}
          </Box>

          <Modal
            isOpen={isShowEndMedicalRecord}
            onClose={() => {
              setIsShowEndMedicalRecord(false);
              formik.resetForm();
            }}
          >
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Kết Thúc Bệnh Án</Modal.Header>
              <Modal.Body>
                <FormControl>
                  {/* <FormControl.Label>Mã Bệnh Án</FormControl.Label> */}
                  <TextArea
                    // borderColor={'gray.900'}
                    h={150}
                    value={formik.values.conclude}
                    placeholder="Vui lòng nhập Kết luận:"
                    fontSize={15}
                    onChangeText={(value) => formik.setFieldValue('conclude', value)}
                  />
                  {formik.errors.conclude && (
                    <Text color="danger.500">{formik.errors.conclude}</Text>
                  )}
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button onPress={formik.handleSubmit}>Đồng Ý</Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
};

export default PatientDetail;

const style = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '45%',
    color: '#18181b',
  },
  content: {
    textAlign: 'right',
    maxWidth: '55%',
    fontSize: 16,
    color: '#18181b',
  },
});
