import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理401错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清除本地存储的token
      localStorage.removeItem('token');
      // 重定向到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) => {
    return api.post('/auth/register', userData);
  },
  login: (credentials: { email: string; password: string }) => {
    return api.post('/auth/login', credentials);
  },
  getMe: () => {
    return api.get('/auth/me');
  },
};

// Customer API
export const customerAPI = {
  getAllCustomers: () => {
    return api.get('/customers');
  },
  getCustomer: (id: string) => {
    return api.get(`/customers/${id}`);
  },
  createCustomer: (customerData: any) => {
    return api.post('/customers', customerData);
  },
  updateCustomer: (id: string, customerData: any) => {
    return api.put(`/customers/${id}`, customerData);
  },
  deleteCustomer: (id: string) => {
    return api.delete(`/customers/${id}`);
  },
  searchCustomers: (query: string) => {
    return api.get(`/customers/search?query=${query}`);
  },
  updateLastContactTime: (id: string) => {
    return api.put(`/customers/${id}/contact`);
  },
};

// Communication API
export const communicationAPI = {
  getCustomerCommunications: (customerId: string) => {
    return api.get(`/communications/customer/${customerId}`);
  },
  getCommunication: (id: string) => {
    return api.get(`/communications/${id}`);
  },
  createCommunication: (formData: FormData) => {
    return api.post('/communications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateCommunication: (id: string, data: any) => {
    return api.put(`/communications/${id}`, data);
  },
  deleteCommunication: (id: string) => {
    return api.delete(`/communications/${id}`);
  },
  searchCommunications: (query: string) => {
    return api.get(`/communications/search?query=${query}`);
  },
  addAttachment: (communicationId: string, formData: FormData) => {
    return api.post(`/communications/${communicationId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAttachment: (communicationId: string, attachmentId: string) => {
    return api.delete(`/communications/${communicationId}/attachments/${attachmentId}`);
  },
};

export default api; 