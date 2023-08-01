import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    const { response } = error;
    if (response.status === 401) {
      localStorage.removeItem('token', 'role', 'user');
      window.location.reload();
    } else if (response.status === 404) {
      //Show not found
    }

    throw error;
  },
);

export default axiosClient;
