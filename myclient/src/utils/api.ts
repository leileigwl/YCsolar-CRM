import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',  // 在Docker中通过Nginx代理到后端服务
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器，添加 token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 为测试和开发添加通用错误处理
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 身份验证错误
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 如果不在登录页，则重定向到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// 导出
export { api };

// 身份验证API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) => {
    return api.post('/auth/register', data);
  },
  login: (data: { email: string; password: string }) => {
    return api.post('/auth/login', data);
  },
  me: () => {
    return api.get('/auth/me');
  },
  updateProfile: (data: { username: string }) => {
    return api.put('/auth/profile', data);
  },
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return api.put('/auth/password', data);
  },
};

// 客户API
export const customerAPI = {
  getAllCustomers: () => {
    return api.get('/customers');
  },
  getCustomer: (id: string) => {
    return api.get(`/customers/${id}`);
  },
  createCustomer: (data: {
    name: string;
    contact_type: string;
    contact_info: string;
    country: string;
    importance: string;
    notes: string;
  }) => {
    return api.post('/customers', data);
  },
  updateCustomer: (id: string, data: {
    name: string;
    contact_type: string;
    contact_info: string;
    country: string;
    importance: string;
    notes: string;
  }) => {
    return api.put(`/customers/${id}`, data);
  },
  deleteCustomer: (id: string) => {
    return api.delete(`/customers/${id}`);
  },
  updateLastContactTime: (id: string) => {
    return api.put(`/customers/${id}/contact`);
  },
  getDeletedCustomers: () => {
    return api.get('/customers/trash');
  },
  restoreCustomer: (id: string) => {
    return api.put(`/customers/${id}/restore`);
  },
  searchCustomers: (query: string) => {
    return api.get(`/customers/search?q=${encodeURIComponent(query)}`);
  }
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
  updateCommunication: (id: string, data: {
    content: string;
    communication_time?: string;
  }) => {
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