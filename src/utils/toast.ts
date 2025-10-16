/**
 * Toast 通知封装
 * 基于 Ant Design message 组件
 */

import { message } from 'antd';

export const toast = {
  success: (content: string, duration = 3) => {
    message.success(content, duration);
  },

  error: (content: string, duration = 3) => {
    message.error(content, duration);
  },

  warning: (content: string, duration = 3) => {
    message.warning(content, duration);
  },

  info: (content: string, duration = 3) => {
    message.info(content, duration);
  },

  loading: (content: string, duration = 0) => {
    return message.loading(content, duration);
  },
};

export default toast;
