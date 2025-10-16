/**
 * 统一请求封装
 */

import { extend } from 'umi-request';
import { message } from 'antd';

// 创建 request 实例
const request = extend({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  errorHandler: (error: any) => {
    const { response } = error;
    if (response && response.status) {
      const { status, statusText } = response;
      const errorText = `请求错误 ${status}: ${statusText}`;
      message.error(errorText);
    } else if (!response) {
      message.error('网络异常，请检查您的网络连接');
    }
    throw error;
  },
});

// 请求拦截器
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    };
  }
  return { url, options };
});

// 响应拦截器
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  
  // 统一处理错误码
  if (data.code && data.code !== 0 && data.code !== 200) {
    message.error(data.message || '请求失败');
    throw new Error(data.message || '请求失败');
  }
  
  return response;
});

export { request };
export default request;
