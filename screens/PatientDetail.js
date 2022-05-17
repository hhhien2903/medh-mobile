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
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import medicalRecordAPI from '../api/medicalRecordAPI';
import sharedStore from '../store/sharedStore';
import Chart from '../components/Chart';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

const PatientDetail = (props) => {
  const { medicalRecordId } = props.route.params;
  const {
    setIsLoadingSpinnerOverLay,
    isShowEndMedicalRecord,
    setIsShowEndMedicalRecord,
    setSelectedMedicalRecordDetail,
  } = sharedStore((state) => state);
  const [medicalRecordSource, setMedicalRecordSource] = useState({});
  const [medicalReportSource, setMedicalReportSource] = useState([]);
  const [listTempDateChart, setListTempDateChart] = useState([]);
  const toast = useToast();
  const navigation = useNavigation();
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
      setMedicalReportSource(medicalReportResult);
      const filteredDates = medicalReportResult
        .map((temp) => moment(temp.date).format('DD/MM/YYYY'))
        .filter((date, index, arrayDate) => arrayDate.indexOf(date) === index);
      setListTempDateChart(filteredDates);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectDateChart = (value) => {};

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
          <HStack justifyContent="flex-end" pr={2} mb={3} mt={1}>
            <Select
              height="10"
              borderWidth={2}
              borderColor="gray.300"
              placeholder="Chọn Ngày"
              borderRadius={8}
              w="150"
              _selectedItem={{
                endIcon: <CheckIcon size={5} />,
              }}
              // defaultValue={formData?.gender}
              fontSize={16}
              onValueChange={handleSelectDateChart}
            >
              {/* {listTempDateChart.map()} */}
              <Select.Item label="03/05/2022" value={true} />
              {/* <Select.Item label="Nữ" value={false} /> */}
            </Select>
          </HStack>

          <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} mb={5}>
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
            />
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
