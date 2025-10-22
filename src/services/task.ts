/**
 * 任务管理相关API服务
 * 
 * 功能覆盖:
 * - 任务CRUD操作
 * - 任务执行控制
 * - 任务调度管理
 * - 任务日志查询
 * - 任务统计分析
 */

import { request } from '@umijs/max';
import type {
  Task,
  TaskExecution,
  TaskLog,
  TaskStatistics,
  TaskQueue,
  TaskSchedule,
  TaskTemplate,
  TaskWorkerConfig,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskQueryParams,
  TaskLogQueryParams,
} from '@/types/task';

// 获取任务列表
export async function getTaskList(params: TaskQueryParams = {}): Promise<{
  list: Task[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request('/api/v1/tasks', {
    method: 'GET',
    params,
  });
}

// 获取任务详情
export async function getTaskDetail(taskId: string): Promise<Task> {
  return request(`/api/v1/tasks/${taskId}`, {
    method: 'GET',
  });
}

// 创建任务
export async function createTask(data: CreateTaskRequest): Promise<Task> {
  return request('/api/v1/tasks', {
    method: 'POST',
    data,
  });
}

// 更新任务
export async function updateTask(taskId: string, data: UpdateTaskRequest): Promise<Task> {
  return request(`/api/v1/tasks/${taskId}`, {
    method: 'PUT',
    data,
  });
}

// 删除任务
export async function deleteTask(taskId: string): Promise<void> {
  return request(`/api/v1/tasks/${taskId}`, {
    method: 'DELETE',
  });
}

// 执行任务
export async function executeTask(taskId: string): Promise<{ executionId: string }> {
  return request(`/api/v1/tasks/${taskId}/execute`, {
    method: 'POST',
  });
}

// 停止任务
export async function stopTask(taskId: string): Promise<void> {
  return request(`/api/v1/tasks/${taskId}/stop`, {
    method: 'POST',
  });
}

// 重启任务
export async function restartTask(taskId: string): Promise<{ executionId: string }> {
  return request(`/api/v1/tasks/${taskId}/restart`, {
    method: 'POST',
  });
}

// 取消任务
export async function cancelTask(taskId: string): Promise<void> {
  return request(`/api/v1/tasks/${taskId}/cancel`, {
    method: 'POST',
  });
}

// 启用/禁用任务调度
export async function toggleTaskSchedule(taskId: string, enabled: boolean): Promise<void> {
  return request(`/api/v1/tasks/${taskId}/schedule`, {
    method: 'PUT',
    data: { enabled },
  });
}

// 获取任务执行历史
export async function getTaskExecutionHistory(taskId: string, params: {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
} = {}): Promise<{
  list: TaskExecution[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request(`/api/v1/tasks/${taskId}/executions`, {
    method: 'GET',
    params,
  });
}

// 获取任务日志
export async function getTaskLogs(params: TaskLogQueryParams = {}): Promise<{
  list: TaskLog[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request('/api/v1/tasks/logs', {
    method: 'GET',
    params,
  });
}

// 获取特定任务的日志
export async function getTaskLogsByTaskId(taskId: string, params: {
  level?: 'debug' | 'info' | 'warn' | 'error';
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<{
  list: TaskLog[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request(`/api/v1/tasks/${taskId}/logs`, {
    method: 'GET',
    params,
  });
}

// 获取任务统计信息
export async function getTaskStatistics(params: {
  startDate?: string;
  endDate?: string;
  type?: string;
} = {}): Promise<TaskStatistics> {
  return request('/api/v1/tasks/statistics', {
    method: 'GET',
    params,
  });
}

// 获取任务队列状态
export async function getTaskQueues(): Promise<TaskQueue[]> {
  return request('/api/v1/tasks/queues', {
    method: 'GET',
  });
}

// 清空任务队列
export async function clearTaskQueue(queueName: string): Promise<void> {
  return request(`/api/v1/tasks/queues/${queueName}/clear`, {
    method: 'POST',
  });
}

// 获取任务调度配置
export async function getTaskSchedules(params: {
  enabled?: boolean;
  page?: number;
  pageSize?: number;
} = {}): Promise<{
  list: TaskSchedule[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request('/api/v1/tasks/schedules', {
    method: 'GET',
    params,
  });
}

// 创建任务调度
export async function createTaskSchedule(data: {
  taskId: string;
  cronExpression: string;
  timezone?: string;
  startDate?: string;
  endDate?: string;
  maxExecutions?: number;
  onFailure?: 'retry' | 'skip' | 'stop';
  retryDelay?: number;
}): Promise<TaskSchedule> {
  return request('/api/v1/tasks/schedules', {
    method: 'POST',
    data,
  });
}

// 更新任务调度
export async function updateTaskSchedule(scheduleId: string, data: {
  cronExpression?: string;
  timezone?: string;
  enabled?: boolean;
  startDate?: string;
  endDate?: string;
  maxExecutions?: number;
  onFailure?: 'retry' | 'skip' | 'stop';
  retryDelay?: number;
}): Promise<TaskSchedule> {
  return request(`/api/v1/tasks/schedules/${scheduleId}`, {
    method: 'PUT',
    data,
  });
}

// 删除任务调度
export async function deleteTaskSchedule(scheduleId: string): Promise<void> {
  return request(`/api/v1/tasks/schedules/${scheduleId}`, {
    method: 'DELETE',
  });
}

// 获取任务模板
export async function getTaskTemplates(): Promise<TaskTemplate[]> {
  return request('/api/v1/tasks/templates', {
    method: 'GET',
  });
}

// 从模板创建任务
export async function createTaskFromTemplate(templateId: string, data: {
  name: string;
  description?: string;
  parameters: Record<string, any>;
  schedule?: string;
}): Promise<Task> {
  return request(`/api/v1/tasks/templates/${templateId}/create`, {
    method: 'POST',
    data,
  });
}

// 获取任务执行器状态
export async function getTaskWorkers(): Promise<TaskWorkerConfig[]> {
  return request('/api/v1/tasks/workers', {
    method: 'GET',
  });
}

// 重启任务执行器
export async function restartTaskWorker(workerId: string): Promise<void> {
  return request(`/api/v1/tasks/workers/${workerId}/restart`, {
    method: 'POST',
  });
}

// 停止任务执行器
export async function stopTaskWorker(workerId: string): Promise<void> {
  return request(`/api/v1/tasks/workers/${workerId}/stop`, {
    method: 'POST',
  });
}

// 导出任务数据
export async function exportTaskData(params: {
  format: 'json' | 'csv' | 'excel';
  taskIds?: string[];
  startDate?: string;
  endDate?: string;
  includeExecutions?: boolean;
  includeLogs?: boolean;
}): Promise<{ downloadUrl: string }> {
  return request('/api/v1/tasks/export', {
    method: 'POST',
    data: params,
  });
}

// 批量操作任务
export async function batchOperateTasks(data: {
  taskIds: string[];
  operation: 'start' | 'stop' | 'cancel' | 'delete' | 'enable' | 'disable';
}): Promise<{
  success: string[];
  failed: { id: string; error: string }[];
}> {
  return request('/api/v1/tasks/batch', {
    method: 'POST',
    data,
  });
}

// 验证cron表达式
export async function validateCronExpression(expression: string): Promise<{
  valid: boolean;
  error?: string;
  nextRuns?: string[];
}> {
  return request('/api/v1/tasks/validate-cron', {
    method: 'POST',
    data: { expression },
  });
}

// 获取系统资源使用情况
export async function getSystemResources(): Promise<{
  cpu: {
    usage: number;
    available: number;
  };
  memory: {
    usage: number;
    available: number;
    total: number;
  };
  storage: {
    usage: number;
    available: number;
    total: number;
  };
  taskLoad: {
    running: number;
    queued: number;
    maxConcurrent: number;
  };
}> {
  return request('/api/v1/tasks/system/resources', {
    method: 'GET',
  });
}