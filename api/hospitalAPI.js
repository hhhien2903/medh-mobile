import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/hospital';

const hospitalAPI = {
  getAllHospital: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
};

export default hospitalAPI;
