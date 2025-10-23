import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';

export const requestConfig: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    errorHandler(error: any) {
      const { response } = error;
      
      if (response) {
        const { status } = response;
        
        if (status === 401) {
          message.error('未登录或登录已过期');
          history.push('/user/login');
        } else if (status === 403) {
          message.error('您没有权限访问该资源');
        } else if (status === 404) {
          message.error('请求的资源不存在');
        } else if (status >= 500) {
          message.error('服务器错误，请稍后再试');
        }
      } else {
        message.error('网络错误，请检查您的网络连接');
      }
      
      throw error;
    },
  },
  requestInterceptors: [
    (url, options) => {
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
    },
  ],
  responseInterceptors: [
    (response: any) => {
      return response;
    },
  ],
};
