/**
 * 统一请求封装
 */
import { extend, RequestOptionsInit } from 'umi-request';
import { message } from 'antd';
import { history } from '@umijs/max';

/** 响应数据结构 */
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

/** 错误处理 */
const errorHandler = (error: any) => {
  const { response, data } = error;

  if (response) {
    const { status } = response;
    const errorMessage = data?.message || '请求失败';

    switch (status) {
      case 401:
        message.error('未登录或登录已过期，请重新登录');
        localStorage.removeItem('token');
        history.push('/user/login');
        break;

      case 403:
        message.error('您没有权限访问该资源');
        break;

      case 404:
        message.error('请求的资源不存在');
        break;

      case 429:
        message.error('请求过于频繁，请稍后再试');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        message.error('服务器错误，请稍后再试');
        break;

      default:
        message.error(errorMessage);
    }
  } else if (!response) {
    message.error('网络错误，请检查您的网络连接');
  }

  throw error;
};

/** 创建请求实例 */
const request = extend({
  prefix: process.env.API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  errorHandler,
  credentials: 'include',
});

/** 请求拦截器 */
request.interceptors.request.use((url: string, options: RequestOptionsInit) => {
  // 添加 token
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

/** 响应拦截器 */
request.interceptors.response.use(async (response: Response) => {
  const data: ResponseData = await response.clone().json();

  // 统一处理业务错误
  if (data.code !== 0 && data.code !== 200) {
    message.error(data.message || '请求失败');
    throw new Error(data.message);
  }

  return response;
});

export default request;

/**
 * GET 请求
 */
export const get = <T = any>(url: string, params?: any): Promise<T> => {
  return request.get(url, { params });
};

/**
 * POST 请求
 */
export const post = <T = any>(url: string, data?: any): Promise<T> => {
  return request.post(url, { data });
};

/**
 * PUT 请求
 */
export const put = <T = any>(url: string, data?: any): Promise<T> => {
  return request.put(url, { data });
};

/**
 * DELETE 请求
 */
export const del = <T = any>(url: string, params?: any): Promise<T> => {
  return request.delete(url, { params });
};
