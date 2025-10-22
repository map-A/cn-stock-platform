/**
 * 系统设置API服务
 * 
 * 依据文档: API_DESIGN_GUIDE.md
 */

import { request } from '@umijs/max';
import type {
  SystemConfig,
  SystemConfigCategory,
  SystemConfigQueryParams,
  SystemConfigResponse,
  SystemConfigUpdateRequest,
  SystemStatus,
  SystemStatusResponse,
  SystemOperationLog,
  TaskScheduleConfig,
  TaskExecution,
  TradingConfig,
  RiskControlConfig,
  DataSourceConfig,
  SystemMonitorConfig,
  UserPermissionConfig,
} from '@/types/system';

const API_BASE = '/api/v1/system';

/**
 * 获取系统配置列表
 */
export async function getSystemConfigs(params?: SystemConfigQueryParams): Promise<SystemConfigResponse> {
  return request(`${API_BASE}/configs`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取系统配置分类
 */
export async function getSystemConfigCategories(): Promise<SystemConfigCategory[]> {
  return request(`${API_BASE}/configs/categories`, {
    method: 'GET',
  });
}

/**
 * 获取指定分类的配置
 */
export async function getSystemConfigByCategory(category: string): Promise<SystemConfig[]> {
  return request(`${API_BASE}/configs/category/${category}`, {
    method: 'GET',
  });
}

/**
 * 更新系统配置
 */
export async function updateSystemConfigs(data: SystemConfigUpdateRequest): Promise<void> {
  return request(`${API_BASE}/configs`, {
    method: 'PUT',
    data,
  });
}

/**
 * 重置系统配置到默认值
 */
export async function resetSystemConfigs(keys: string[]): Promise<void> {
  return request(`${API_BASE}/configs/reset`, {
    method: 'POST',
    data: { keys },
  });
}

/**
 * 获取系统状态
 */
export async function getSystemStatus(): Promise<SystemStatusResponse> {
  return request(`${API_BASE}/status`, {
    method: 'GET',
  });
}

/**
 * 获取系统性能指标
 */
export async function getSystemMetrics(timeRange?: string): Promise<any> {
  return request(`${API_BASE}/metrics`, {
    method: 'GET',
    params: { timeRange },
  });
}

/**
 * 获取操作日志
 */
export async function getOperationLogs(params: {
  startDate?: string;
  endDate?: string;
  userId?: string;
  module?: string;
  operation?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  items: SystemOperationLog[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request(`${API_BASE}/logs/operations`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取任务调度列表
 */
export async function getTaskSchedules(): Promise<TaskScheduleConfig[]> {
  return request(`${API_BASE}/tasks/schedules`, {
    method: 'GET',
  });
}

/**
 * 创建任务调度
 */
export async function createTaskSchedule(data: Omit<TaskScheduleConfig, 'id' | 'executionHistory'>): Promise<TaskScheduleConfig> {
  return request(`${API_BASE}/tasks/schedules`, {
    method: 'POST',
    data,
  });
}

/**
 * 更新任务调度
 */
export async function updateTaskSchedule(id: string, data: Partial<TaskScheduleConfig>): Promise<void> {
  return request(`${API_BASE}/tasks/schedules/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除任务调度
 */
export async function deleteTaskSchedule(id: string): Promise<void> {
  return request(`${API_BASE}/tasks/schedules/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 立即执行任务
 */
export async function executeTask(id: string): Promise<TaskExecution> {
  return request(`${API_BASE}/tasks/schedules/${id}/execute`, {
    method: 'POST',
  });
}

/**
 * 获取任务执行历史
 */
export async function getTaskExecutionHistory(taskId: string, params?: {
  page?: number;
  pageSize?: number;
}): Promise<{
  items: TaskExecution[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request(`${API_BASE}/tasks/schedules/${taskId}/executions`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取交易参数配置
 */
export async function getTradingConfig(): Promise<TradingConfig> {
  return request(`${API_BASE}/configs/trading`, {
    method: 'GET',
  });
}

/**
 * 更新交易参数配置
 */
export async function updateTradingConfig(data: TradingConfig): Promise<void> {
  return request(`${API_BASE}/configs/trading`, {
    method: 'PUT',
    data,
  });
}

/**
 * 获取风险控制配置
 */
export async function getRiskControlConfig(): Promise<RiskControlConfig> {
  return request(`${API_BASE}/configs/risk-control`, {
    method: 'GET',
  });
}

/**
 * 更新风险控制配置
 */
export async function updateRiskControlConfig(data: RiskControlConfig): Promise<void> {
  return request(`${API_BASE}/configs/risk-control`, {
    method: 'PUT',
    data,
  });
}

/**
 * 获取数据源配置
 */
export async function getDataSourceConfig(): Promise<DataSourceConfig> {
  return request(`${API_BASE}/configs/data-source`, {
    method: 'GET',
  });
}

/**
 * 更新数据源配置
 */
export async function updateDataSourceConfig(data: DataSourceConfig): Promise<void> {
  return request(`${API_BASE}/configs/data-source`, {
    method: 'PUT',
    data,
  });
}

/**
 * 获取系统监控配置
 */
export async function getSystemMonitorConfig(): Promise<SystemMonitorConfig> {
  return request(`${API_BASE}/configs/monitor`, {
    method: 'GET',
  });
}

/**
 * 更新系统监控配置
 */
export async function updateSystemMonitorConfig(data: SystemMonitorConfig): Promise<void> {
  return request(`${API_BASE}/configs/monitor`, {
    method: 'PUT',
    data,
  });
}

/**
 * 获取用户权限配置
 */
export async function getUserPermissionConfigs(): Promise<UserPermissionConfig[]> {
  return request(`${API_BASE}/permissions`, {
    method: 'GET',
  });
}

/**
 * 更新用户权限配置
 */
export async function updateUserPermissionConfig(roleId: string, data: UserPermissionConfig): Promise<void> {
  return request(`${API_BASE}/permissions/${roleId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 系统重启
 */
export async function restartSystem(): Promise<void> {
  return request(`${API_BASE}/restart`, {
    method: 'POST',
  });
}

/**
 * 清理系统缓存
 */
export async function clearSystemCache(): Promise<void> {
  return request(`${API_BASE}/cache/clear`, {
    method: 'POST',
  });
}

/**
 * 导出系统配置
 */
export async function exportSystemConfig(): Promise<Blob> {
  return request(`${API_BASE}/configs/export`, {
    method: 'GET',
    responseType: 'blob',
  });
}

/**
 * 导入系统配置
 */
export async function importSystemConfig(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  
  return request(`${API_BASE}/configs/import`, {
    method: 'POST',
    data: formData,
  });
}

/**
 * 获取系统健康检查
 */
export async function getSystemHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message?: string;
    duration: number;
  }[];
}> {
  return request(`${API_BASE}/health`, {
    method: 'GET',
  });
}