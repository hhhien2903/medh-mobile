import { axiosClient, axiosClientFormData } from './axiosClient';

const API_ENDPOINT = '/doctor';

const doctorAPI = {
  register: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  checkAccountRegistered: (mobile, email) => {
    if (!mobile) {
      mobile = '';
    }
    if (!email) {
      email = '';
    }
    const url = `${API_ENDPOINT}/check/info?mobile=${mobile}&email=${email}`;
    return axiosClient.get(url);
  },
  updateInfo: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
  getAllMonitoringPatient: (id) => {
    const url = `${API_ENDPOINT}/${id}/patients`;
    return axiosClient.get(url);
  },
  getDoctorByDoctorId: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.get(url);
  },
  uploadAvatar: (id, data) => {
    const url = `${API_ENDPOINT}/avatar/${id}`;
    return axiosClientFormData.patch(url, data);
  },
};

export default doctorAPI;
