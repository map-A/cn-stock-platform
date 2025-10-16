/**
 * Umi 运行时配置
 */
import { RequestConfig, history } from '@umijs/max';
import { message } from 'antd';
import { getMarketStatus } from '@/models/stock';

// 全局初始化
export async function getInitialState(): Promise<{
  currentUser?: any;
  isMarketOpen: boolean;
}> {
  // 获取用户信息
  const token = localStorage.getItem('token');
  let currentUser;
  
  if (token) {
    try {
      // TODO: 从后端获取用户信息
      currentUser = {
        id: '1',
        username: 'demo',
        tier: 'Free',
        isPro: false,
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  }

  // 获取市场状态
  const isMarketOpen = getMarketStatus();

  return {
    currentUser,
    isMarketOpen,
  };
}

// 请求配置
export const request: RequestConfig = {
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
};

// 布局配置
export const layout = () => {
  return {
    logo: '/logo.png',
    title: '中国股市分析平台',
    menu: {
      locale: false,
    },
  };
};
