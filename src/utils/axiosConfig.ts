import axios from 'axios';
// Cấu hình Axios với base URL và các thiết lập mặc định
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response) {
      console.error('Server responded with an error:', error.response);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
