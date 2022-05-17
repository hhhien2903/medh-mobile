import React, { useState, useEffect } from 'react';
import {
  useToast,
  Box,
  Button,
  FormControl,
  HStack,
  VStack,
  Text,
  TextArea,
  AlertDialog,
  Input,
} from 'native-base';
import patientAPI from '../api/patientAPI';
import deviceAPI from '../api/deviceAPI';
import diseaseAPI from '../api/diseaseAPI';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDebounce } from 'use-debounce';
import { Dimensions } from 'react-native';
import sharedStore from '../store/sharedStore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import medicalRecordAPI from '../api/medicalRecordAPI';
import { useNavigation } from '@react-navigation/native';

const EditMedicalRecord = () => {
  const [deviceSource, setDeviceSource] = useState([]);
  const [patientSearchResult, setPatientSearchResult] = React.useState([]);
  const [searchPatientString, setSearchPatientString] = React.useState('');
  const [searchDebounced] = useDebounce(searchPatientString, 600);
  const [loadingSearchPatient, setLoadingSearchPatient] = useState(false);
  const [isOpenSearchPatient, setIsOpenSearchPatient] = useState(false);
  const [isOpenSearchDevice, setIsOpenSearchDevice] = useState(false);

  const [isOpenSearchDiseases, setIsOpenSearchDiseases] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState({});
  const [selectedDevice, setSelectedDevice] = useState({});
  const [diseaseSource, setDiseaseSource] = useState([]);

  const [isVisibleDiseaseSelect, setIsVisibleDiseaseSelect] = useState(true);
  const [isVisibleDeviceSelect, setIsVisibleDeviceSelect] = useState(true);
  const [isVisibleDiagnoseTextArea, setIsVisibleDiagnoseTextArea] = useState(true);
  const [isVisibleConfirmCreateDialog, setIsVisibleConfirmCreateDialog] = useState(false);
  const toast = useToast();
  const { currentUser, selectedMedicalRecordDetail, setIsLoadingSpinnerOverLay } = sharedStore(
    (state) => state
  );
  const navigation = useNavigation();

  const searchPatient = async () => {
    try {
      setLoadingSearchPatient(true);
      let searchResult = await patientAPI.searchAllPatients(true, searchDebounced);
      let filterList = searchResult.map((search) => {
        return { label: search.fullName, value: search.id };
      });
      setPatientSearchResult(filterList);
      setLoadingSearchPatient(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllDiseases = async () => {
    try {
      let diseaseResult = await diseaseAPI.getAllDiseases();

      let filterList = diseaseResult.map((disease) => {
        return { label: disease.name, value: disease.id };
      });
      setDiseaseSource(filterList);
      setSelectedDisease(selectedMedicalRecordDetail.diseases.id);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllDevice = async () => {
    try {
      setIsLoadingSpinnerOverLay(true);
      let deviceResult = await deviceAPI.getAllUnusedDevicesByHospitalId(currentUser?.hospital?.id);
      let selectedMedicalRecordDevice = {
        label: selectedMedicalRecordDetail?.medicalRecordDevice?.device.name,
        value: selectedMedicalRecordDetail?.medicalRecordDevice?.device.id,
      };
      let filterList = deviceResult.map((device) => {
        return { label: device.name, value: device.id };
      });
      await filterList.unshift(selectedMedicalRecordDevice);
      setDeviceSource(filterList);
      setSelectedDevice(selectedMedicalRecordDetail?.medicalRecordDevice?.device.id);
      setIsLoadingSpinnerOverLay(false);
    } catch (error) {
      console.log(error);
      setIsLoadingSpinnerOverLay(false);
    }
  };
  useEffect(() => {
    searchPatient();
  }, [searchDebounced]);

  useEffect(() => {
    getAllDevice();
    getAllDiseases();
  }, []);

  const formik = useFormik({
    initialValues: {
      diseaseId: selectedMedicalRecordDetail?.diseases?.id,
      deviceId: selectedMedicalRecordDetail?.medicalRecordDevice?.device?.id,
      diagnose: selectedMedicalRecordDetail?.diagnose,
    },
    validationSchema: Yup.object({
      diseaseId: Yup.number().required('Loại Bệnh không được để trống!'),
      deviceId: Yup.number().required('Thiết Bị không được để trống!'),
      diagnose: Yup.string().required('Chuẩn Đoán không được để trống!'),
    }),

    onSubmit: () => {
      setIsVisibleConfirmCreateDialog(true);
    },
  });

  const handleUpdateMedicalRecord = async () => {
    setIsVisibleConfirmCreateDialog(false);
    try {
      const sendData = {
        id: selectedMedicalRecordDetail?.id,
        diagnose: formik.values.diagnose,
        treated: false,
        doctorId: currentUser.id,
        diseasesId: formik.values.diseaseId,
        patientId: selectedMedicalRecordDetail.patient.id,
        deviceId: formik.values.deviceId,
      };
      await medicalRecordAPI.updateMedicalRecord(sendData);
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Box bg="success.500" px="4" py="4" rounded="sm">
              <Text fontWeight={'bold'} color={'white'}>
                Cập nhật Bệnh Án thành công.
              </Text>
            </Box>
          );
        },
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Box bg="warmGray.400" px="4" py="4" rounded="sm">
              <Text fontWeight={'bold'} color={'white'}>
                Cập nhật Bệnh Án không thành công. Hãy thử lại sau.
              </Text>
            </Box>
          );
        },
      });
    }
  };

  return (
    <Box height={'100%'}>
      <VStack space={2} px={5} mt="5" paddingBottom={100}>
        <FormControl>
          <FormControl.Label _text={{ fontSize: 15 }}>Bệnh Nhân:</FormControl.Label>
          <Input
            borderColor={'gray.500'}
            backgroundColor={'gray.200'}
            borderRadius={8}
            fontSize={15}
            isReadOnly={true}
            value={
              selectedMedicalRecordDetail.patient.surname +
              ' ' +
              selectedMedicalRecordDetail.patient.name
            }
          ></Input>
        </FormControl>

        {isVisibleDiseaseSelect && (
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Loại Bệnh:</FormControl.Label>
            <Box>
              <DropDownPicker
                maxHeight={200}
                placeholder="Vui lòng chọn Loại Bệnh"
                open={isOpenSearchDiseases}
                value={selectedDisease}
                style={{ borderColor: '#71717a' }}
                dropDownContainerStyle={{
                  borderColor: '#71717a',
                  backgroundColor: 'white',
                }}
                onSelectItem={(value) => {
                  formik.setFieldValue('diseaseId', value.value);
                }}
                setOpen={(value) => {
                  setIsOpenSearchDiseases(value);
                  setIsVisibleDeviceSelect(false);
                  setIsVisibleDiagnoseTextArea(false);
                }}
                onClose={() => {
                  setIsVisibleDeviceSelect(true);
                  setIsVisibleDiagnoseTextArea(true);
                  setIsVisibleDiagnoseTextArea(true);
                }}
                setValue={setSelectedDisease}
                listItemContainerStyle={{
                  backgroundColor: '#e4e4e7',
                }}
                selectedItemLabelStyle={{ fontWeight: 'bold' }}
                listItemLabelStyle={{ fontWeight: '900', fontSize: 15 }}
                searchTextInputStyle={{ borderColor: '#71717a' }}
                items={diseaseSource}
                multiple={false}
                searchPlaceholder="Tên, Số điện thoại, CMND."
                ListEmptyComponent={({}) => (
                  <Box padding={2}>
                    <Text>Không có kết quả...</Text>
                  </Box>
                )}
              />
            </Box>
            {formik.errors.diseaseId && <Text color="danger.500">{formik.errors.diseaseId}</Text>}
          </FormControl>
        )}

        {isVisibleDeviceSelect && (
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Thiết Bị:</FormControl.Label>
            <Box>
              <DropDownPicker
                maxHeight={200}
                placeholder="Vui lòng chọn Thiết bị"
                open={isOpenSearchDevice}
                // value={selectedDisease}
                style={{ borderColor: '#71717a' }}
                dropDownContainerStyle={{
                  borderColor: '#71717a',
                  backgroundColor: 'white',
                }}
                value={selectedDevice}
                setOpen={(value) => {
                  setIsOpenSearchDevice(value);
                  setIsVisibleDiagnoseTextArea(false);
                }}
                setValue={setSelectedDevice}
                listItemContainerStyle={{
                  backgroundColor: '#e4e4e7',
                }}
                onClose={() => {
                  setIsVisibleDiagnoseTextArea(true);
                }}
                onSelectItem={(value) => {
                  formik.setFieldValue('deviceId', value.value);
                }}
                selectedItemLabelStyle={{ fontWeight: 'bold' }}
                listItemLabelStyle={{ fontWeight: '900', fontSize: 15 }}
                searchTextInputStyle={{ borderColor: '#71717a' }}
                items={deviceSource}
                // onChangeSearchText={(searchString) => setSearch(searchString)}
                multiple={false}
                // searchable={true}
                searchPlaceholder="Tên, Số điện thoại, CMND."
                ListEmptyComponent={({}) => (
                  <Box padding={2}>
                    <Text>Không có kết quả...</Text>
                  </Box>
                )}
              />
            </Box>
            {formik.errors.deviceId && <Text color="danger.500">{formik.errors.deviceId}</Text>}
          </FormControl>
        )}

        {isVisibleDiagnoseTextArea && (
          <FormControl isRequired>
            <FormControl.Label _text={{ fontSize: 15 }}>Chuẩn Đoán:</FormControl.Label>
            <TextArea
              borderRadius={8}
              backgroundColor={'white'}
              borderColor={'gray.500'}
              h={100}
              placeholder="Chuẩn Đoán"
              value={formik.values.diagnose}
              fontSize={15}
              onChangeText={(value) => formik.setFieldValue('diagnose', value)}
            />
            {formik.errors.diagnose && <Text color="danger.500">{formik.errors.diagnose}</Text>}
          </FormControl>
        )}
      </VStack>
      <AlertDialog
        isOpen={isVisibleConfirmCreateDialog}
        onClose={() => setIsVisibleConfirmCreateDialog(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Xác Nhận</AlertDialog.Header>
          <AlertDialog.Body>Bạn có chắc chắn với các thông tin đã nhập?</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setIsVisibleConfirmCreateDialog(false)}
              >
                Huỷ
              </Button>
              <Button colorScheme="primary" onPress={() => handleUpdateMedicalRecord()}>
                Đồng Ý
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Box style={{ position: 'absolute', bottom: 0 }}>
        <HStack
          width={Dimensions.get('window').width}
          justifyContent="center"
          paddingX={5}
          marginBottom={5}
        >
          <Button
            bg="info.500"
            height={50}
            _text={{ fontSize: 18, fontWeight: 'bold' }}
            // onPress={formik.handleSubmit}
            width={'100%'}
            onPress={formik.handleSubmit}
          >
            Chỉnh Sửa Bệnh Án
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default EditMedicalRecord;
