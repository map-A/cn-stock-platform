/**
 * API 客户端封装
 * 统一处理请求和响应
 */

import request from 'umi-request';

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 配置请求拦截器
request.interceptors.request.use((url, options) => {
  // 添加认证token
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return { url, options };
});

// 配置响应拦截器
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  if (data.code !== 0 && data.code !== 200) {
    throw new Error(data.message || '请求失败');
  }
  return response;
});

export const apiClient = {
  get: <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
    return request.get(url, { params });
  },

  post: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return request.post(url, { data });
  },

  put: <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return request.put(url, { data });
  },

  delete: <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
    return request.delete(url, { params });
  },
};

export default apiClient;
