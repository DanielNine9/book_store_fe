import axios from 'axios';

// Cấu hình Axios với base URL và các thiết lập mặc định
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  
  timeout: 10000,  // Timeout sau 10 giây
  headers: {
    'Content-Type': 'application/json',  // Đảm bảo gửi dữ liệu dưới dạng JSON
    'Accept': 'application/json',        // Accept JSON trả về
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
