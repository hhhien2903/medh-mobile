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
};

export default pushDeviceAPI;
