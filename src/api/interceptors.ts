/**
 * API 请求/响应拦截器
 * 统一处理认证、错误、重试等通用逻辑
 */

import client, { type ApiResponse } from './client';
import type { RequestOptionsInit } from 'umi-request';
import { message } from 'antd';

/** 请求拦截器 - 添加认证信息 */
client.interceptors.request.use((url: string, options: RequestOptionsInit) => {
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

/** 响应拦截器 - 处理业务错误 */
client.interceptors.response.use(
  async (response: Response) => {
    try {
      const clonedResponse = response.clone();
      const data: ApiResponse = await clonedResponse.json();
      
      // 业务错误处理
      if (data.code !== 0 && data.code !== 200) {
        message.error(data.message || '请求失败');
      }
    } catch (_e) {
      // 处理错误但继续返回响应
    }
    
    return response;
  }
);

export default client;
