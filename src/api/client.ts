/**
 * HTTP 客户端配置
 * 基于 umi-request 的统一 API 客户端
 */

import { extend } from 'umi-request';

/** API 响应数据结构 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

/** API 客户端配置 */
const client = extend({
  prefix: process.env.API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

export default client;
