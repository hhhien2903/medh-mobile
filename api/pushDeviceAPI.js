import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/push-device';

const pushDeviceAPI = {
  register: (data) => {
    const url = `${API_ENDPOINT}/register`;
    return axiosClient.post(url, data);
  },
  remove: (data) => {
    const url = `${API_ENDPOINT}/remove`;
    return axiosClient.patch(url, data);
  },
  getNotificationByDoctorId(doctorId, type) {
    let url = '';
    if (type) {
      url = `${API_ENDPOINT}/notifications?type=${type}&doctorId=${doctorId}`;
    } else {
      url = `${API_ENDPOINT}/notifications?doctorId=${doctorId}`;
    }
    return axiosClient.get(url);
  },
  updateNotificationIsRead(notificationId) {
    const url = `${API_ENDPOINT}?id=${notificationId}`;
    return axiosClient.put(url);
  },
};

export default pushDeviceAPI;
