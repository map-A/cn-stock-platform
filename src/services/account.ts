/**
 * @fileoverview 账户管理相关API接口
 * @description 提供账户信息查询、持仓管理、资金流水等功能的API封装
 * @author AI Assistant
 * @created 2024-01-01
 */

import { request } from '@umijs/max';
import type { API } from './ant-design-pro/typings';

/**
 * 账户列表查询参数接口
 */
export interface AccountListParams {
  /** 当前页码 */
  current?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 账户ID */
  account_id?: string;
  /** 账户名称 */
  account_name?: string;
  /** 券商名称 */
  broker_name?: string;
  /** 账户状态 */
  status?: 'active' | 'inactive' | 'suspended';
  /** 券商ID */
  broker_id?: string;
}

/**
 * 持仓查询参数接口
 */
export interface PositionParams {
  /** 当前页码 */
  current?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 股票代码 */
  code?: string;
  /** 持仓日期 */
  position_date?: string;
}

/**
 * 获取账户列表
 * @param params 查询参数
 * @param options 请求配置
 * @returns 账户列表响应
 */
export async function getAccountList(
  params?: AccountListParams,
  options?: { [key: string]: any },
) {
  return request<API.AccountList>('/api/accounts', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取账户详细信息
 * @param accountId 账户ID
 * @param options 请求配置
 * @returns 账户详情响应
 */
export async function getAccountDetail(
  accountId: string,
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.AccountInfo>>(`/api/accounts/${accountId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取账户持仓信息
 * @param accountId 账户ID
 * @param params 查询参数
 * @param options 请求配置
 * @returns 持仓信息响应
 */
export async function getAccountPositions(
  accountId: string,
  params?: PositionParams,
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.PositionList>>(`/api/accounts/${accountId}/positions`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取账户资金流水
 * @param accountId 账户ID
 * @param params 查询参数
 * @param options 请求配置
 * @returns 资金流水响应
 */
export async function getAccountFundFlow(
  accountId: string,
  params?: {
    current?: number;
    pageSize?: number;
    start_date?: string;
    end_date?: string;
    flow_type?: 'in' | 'out' | 'all';
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.FundFlowList>>(`/api/accounts/${accountId}/fund-flow`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取账户概览信息
 * @param accountId 账户ID
 * @param options 请求配置
 * @returns 账户概览响应
 */
export async function getAccountOverview(
  accountId: string,
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.AccountOverview>>(`/api/accounts/${accountId}/overview`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取账户绩效指标
 * @param accountId 账户ID
 * @param params 查询参数
 * @param options 请求配置
 * @returns 绩效指标响应
 */
export async function getAccountPerformance(
  accountId: string,
  params?: {
    start_date?: string;
    end_date?: string;
    benchmark?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.PerformanceMetrics>>(`/api/accounts/${accountId}/performance`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 获取账户资金流水 GET /api/accounts/${account_id}/fund-flows */
export async function getAccountFundFlows(
  account_id: string,
  params?: {
    current?: number;
    pageSize?: number;
    flow_type?: string;
    start_time?: string;
    end_time?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.AccountFundFlowList>(`/api/accounts/${account_id}/fund-flows`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
