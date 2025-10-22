/**
 * 任务管理模块类型定义
 * 
 * 功能覆盖:
 * - 任务执行状态监控
 * - 定时任务配置
 * - 任务执行日志
 * - 任务性能统计
 */

// 任务类型枚举
export type TaskType = 
  | 'data_sync'     // 数据同步
  | 'strategy_run'  // 策略执行
  | 'report_gen'    // 报告生成
  | 'risk_calc'     // 风险计算
  | 'backup'        // 数据备份
  | 'cleanup'       // 数据清理
  | 'notification'  // 通知发送
  | 'maintenance';  // 系统维护

// 任务状态枚举
export type TaskStatus = 
  | 'pending'    // 等待中
  | 'queued'     // 队列中
  | 'running'    // 执行中
  | 'completed' // 已完成
  | 'failed'    // 失败
  | 'cancelled' // 已取消
  | 'timeout';  // 超时

// 任务优先级
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// 任务基本信息
export interface Task {
  id: string;
  name: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number; // 0-100
  
  // 执行信息
  startTime?: string;
  endTime?: string;
  duration?: number; // 执行时长(秒)
  retryCount: number;
  maxRetries: number;
  
  // 调度信息
  schedule?: string; // cron表达式
  nextRunTime?: string;
  lastRunTime?: string;
  
  // 执行结果
  result?: any;
  error?: string;
  logs?: TaskLog[];
  
  // 元数据
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
  // 配置参数
  parameters?: Record<string, any>;
  environment?: 'development' | 'testing' | 'production';
  
  // 资源使用
  resourceUsage?: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

// 任务日志
export interface TaskLog {
  id: string;
  taskId: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

// 任务执行日志 (用于日志面板显示)
export interface TaskExecutionLog {
  id: string;
  task_name: string;
  task_type: TaskType;
  status: TaskStatus;
  start_time: string;
  end_time?: string;
  progress?: number;
  parameters?: Record<string, any>;
  result?: any;
  error_message?: string;
  log_output?: string;
}

// 任务执行历史
export interface TaskExecution {
  id: string;
  taskId: string;
  status: TaskStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  result?: any;
  error?: string;
  logs: TaskLog[];
  resourceUsage?: {
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
  };
}

// 任务统计信息
export interface TaskStatistics {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byType: Record<TaskType, number>;
  byPriority: Record<TaskPriority, number>;
  avgDuration: number;
  successRate: number;
  failureRate: number;
  
  // 时间段统计
  todayExecutions: number;
  weeklyExecutions: number;
  monthlyExecutions: number;
  
  // 性能指标
  avgCpuUsage: number;
  avgMemoryUsage: number;
  avgStorageUsage: number;
}

// 任务队列信息
export interface TaskQueue {
  name: string;
  size: number;
  processing: number;
  maxWorkers: number;
  activeWorkers: number;
  
  // 性能指标
  throughput: number; // 每分钟处理任务数
  avgWaitTime: number; // 平均等待时间(秒)
  avgProcessTime: number; // 平均处理时间(秒)
}

// 任务调度配置
export interface TaskSchedule {
  id: string;
  taskId: string;
  cronExpression: string;
  timezone: string;
  enabled: boolean;
  
  // 执行窗口
  startDate?: string;
  endDate?: string;
  
  // 执行限制
  maxExecutions?: number;
  executionCount: number;
  
  // 失败处理
  onFailure: 'retry' | 'skip' | 'stop';
  retryDelay: number; // 重试延迟(秒)
  
  createdAt: string;
  updatedAt: string;
}

// 创建任务请求
export interface CreateTaskRequest {
  name: string;
  description?: string;
  type: TaskType;
  priority?: TaskPriority;
  parameters?: Record<string, any>;
  schedule?: string;
  maxRetries?: number;
  environment?: 'development' | 'testing' | 'production';
}

// 更新任务请求
export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  priority?: TaskPriority;
  parameters?: Record<string, any>;
  schedule?: string;
  maxRetries?: number;
  enabled?: boolean;
}

// 任务查询参数
export interface TaskQueryParams {
  page?: number;
  pageSize?: number;
  status?: TaskStatus | TaskStatus[];
  type?: TaskType | TaskType[];
  priority?: TaskPriority | TaskPriority[];
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'startTime' | 'duration' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

// 任务执行日志查询参数
export interface TaskLogQueryParams {
  taskId?: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// 任务模板
export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  defaultParameters: Record<string, any>;
  parameterSchema: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      required: boolean;
      default?: any;
      description?: string;
      validation?: any;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// WebSocket 任务更新消息
export interface TaskUpdateMessage {
  type: 'task_status_changed' | 'task_progress_updated' | 'task_log_added';
  taskId: string;
  data: {
    status?: TaskStatus;
    progress?: number;
    log?: TaskLog;
    timestamp: string;
  };
}

// 任务执行器配置
export interface TaskWorkerConfig {
  id: string;
  name: string;
  type: TaskType[];
  maxConcurrent: number;
  timeout: number; // 超时时间(秒)
  retryDelay: number;
  healthCheck: {
    enabled: boolean;
    interval: number; // 健康检查间隔(秒)
    url?: string;
  };
  resources: {
    maxCpu: number; // 最大CPU使用率(%)
    maxMemory: number; // 最大内存使用(MB)
    maxStorage: number; // 最大存储使用(MB)
  };
  status: 'active' | 'inactive' | 'maintenance';
  lastHeartbeat?: string;
}