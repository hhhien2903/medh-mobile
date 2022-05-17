import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/medical-record';

const medicalRecordAPI = {
  getAllMedicalRecordByDoctorId: (doctorId, treated) => {
    const url = `${API_ENDPOINT}/find/options?doctorId=${doctorId}&treated=${treated}`;
    return axiosClient.get(url);
  },
  getAllMedicalRecord: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  getMedicalRecordById: (medicalRecordId) => {
    const url = `${API_ENDPOINT}/${medicalRecordId}`;
    return axiosClient.get(url);
  },
  getReportByMedicalRecordId: (medicalRecordId) => {
    const url = `${API_ENDPOINT}/collect/report?id=${medicalRecordId}`;
    return axiosClient.get(url);
  },
  createMedicalRecord: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  endFollowMedicalRecord: (data) => {
    const url = `${API_ENDPOINT}/end-follow`;
    return axiosClient.patch(url, data);
  },
  updateMedicalRecord: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
};

export default medicalRecordAPI;
