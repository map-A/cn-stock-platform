/**
 * Toast notification utility
 */
import { message } from 'antd';

export const showSuccess = (msg: string, duration = 2) => {
  message.success(msg, duration);
};

export const showError = (msg: string, duration = 2) => {
  message.error(msg, duration);
};

export const showInfo = (msg: string, duration = 2) => {
  message.info(msg, duration);
};

export const showWarning = (msg: string, duration = 2) => {
  message.warning(msg, duration);
};

export const showLoading = (msg: string = 'Loading...') => {
  return message.loading(msg);
};
