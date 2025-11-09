/**
 * Account Service API
 * 账户管理服务 API
 */

import { request } from '@umijs/max';

const ACCOUNT_API_BASE = '/api/v1';

export interface BacktestAccount {
  id: number;
  user_id: number;
  backtest_id?: number;
  account_name: string;
  account_type: string;
  initial_capital: number;
  current_capital: number;
  available_cash: number;
  frozen_cash: number;
  market_value: number;
  total_assets: number;
  total_profit_loss: number;
  total_profit_loss_pct: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface AccountPosition {
  id: number;
  account_id: number;
  symbol: string;
  quantity: number;
  available_quantity: number;
  average_cost: number;
  current_price: number;
  market_value: number;
  profit_loss: number;
  profit_loss_pct: number;
  position_pct: number;
  updated_at?: string;
}

export interface AccountTransaction {
  id: number;
  account_id: number;
  transaction_date: string;
  symbol: string;
  transaction_type: string;
  quantity: number;
  price: number;
  amount: number;
  commission: number;
  stamp_duty: number;
  transfer_fee: number;
  total_cost: number;
  balance_after: number;
  notes?: string;
  created_at?: string;
}

export interface AccountDailySnapshot {
  id: number;
  account_id: number;
  snapshot_date: string;
  cash: number;
  market_value: number;
  total_value: number;
  daily_return?: number;
  cumulative_return?: number;
  daily_profit_loss?: number;
  positions_count: number;
  created_at?: string;
}

export interface AccountPerformance {
  id: number;
  account_id: number;
  total_return: number;
  annual_return: number;
  max_drawdown: number;
  sharpe_ratio?: number;
  sortino_ratio?: number;
  win_rate: number;
  profit_factor: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  avg_win: number;
  avg_loss: number;
  avg_hold_days?: number;
  updated_at?: string;
}

export interface AccountAssetAllocation {
  id: number;
  account_id: number;
  category: string;
  amount: number;
  percentage: number;
  updated_at?: string;
}

export interface AccountSummary {
  account: BacktestAccount;
  performance?: AccountPerformance;
  positions_count: number;
  recent_transactions_count: number;
}

export interface AccountDetail {
  account: BacktestAccount;
  positions: AccountPosition[];
  performance?: AccountPerformance;
  asset_allocation: AccountAssetAllocation[];
}

export interface PaginatedTransactions {
  items: AccountTransaction[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

/**
 * 获取账户列表
 */
export async function getAccountList() {
  return request<ApiResponse<BacktestAccount[]>>(`${ACCOUNT_API_BASE}/accounts`, {
    method: 'GET',
  });
}

/**
 * 获取账户摘要
 */
export async function getAccountSummary(accountId: number) {
  return request<ApiResponse<AccountSummary>>(`${ACCOUNT_API_BASE}/accounts/${accountId}`, {
    method: 'GET',
  });
}

/**
 * 获取账户详情
 */
export async function getAccountDetail(accountId: number) {
  return request<ApiResponse<AccountDetail>>(`${ACCOUNT_API_BASE}/accounts/${accountId}/detail`, {
    method: 'GET',
  });
}

/**
 * 获取账户持仓
 */
export async function getAccountPositions(accountId: number) {
  return request<ApiResponse<AccountPosition[]>>(
    `${ACCOUNT_API_BASE}/accounts/${accountId}/positions`,
    {
      method: 'GET',
    },
  );
}

/**
 * 获取账户交易记录
 */
export async function getAccountTransactions(
  accountId: number,
  page: number = 1,
  pageSize: number = 20,
) {
  return request<ApiResponse<PaginatedTransactions>>(
    `${ACCOUNT_API_BASE}/accounts/${accountId}/transactions`,
    {
      method: 'GET',
      params: {
        page,
        page_size: pageSize,
      },
    },
  );
}

/**
 * 获取账户每日快照
 */
export async function getAccountSnapshots(
  accountId: number,
  startDate?: string,
  endDate?: string,
) {
  return request<ApiResponse<AccountDailySnapshot[]>>(
    `${ACCOUNT_API_BASE}/accounts/${accountId}/snapshots`,
    {
      method: 'GET',
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    },
  );
}

/**
 * 获取账户绩效指标
 */
export async function getAccountPerformance(accountId: number) {
  return request<ApiResponse<AccountPerformance>>(
    `${ACCOUNT_API_BASE}/accounts/${accountId}/performance`,
    {
      method: 'GET',
    },
  );
}

/**
 * 获取账户资产配置
 */
export async function getAccountAllocation(accountId: number) {
  return request<ApiResponse<AccountAssetAllocation[]>>(
    `${ACCOUNT_API_BASE}/accounts/${accountId}/allocation`,
    {
      method: 'GET',
    },
  );
}

/**
 * 创建账户
 */
export async function createAccount(data: {
  account_name: string;
  account_type: string;
  initial_capital: number;
  backtest_id?: number;
}) {
  return request<ApiResponse<BacktestAccount>>(`${ACCOUNT_API_BASE}/accounts`, {
    method: 'POST',
    data,
  });
}

/**
 * 更新账户
 */
export async function updateAccount(
  accountId: number,
  data: {
    account_name?: string;
    status?: string;
  },
) {
  return request<ApiResponse<BacktestAccount>>(`${ACCOUNT_API_BASE}/accounts/${accountId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除账户
 */
export async function deleteAccount(accountId: number) {
  return request<ApiResponse<void>>(`${ACCOUNT_API_BASE}/accounts/${accountId}`, {
    method: 'DELETE',
  });
}
