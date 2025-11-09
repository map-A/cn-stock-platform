/**
 * Log Service API
 * 日志服务 API
 */

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error';
  service: string;
  message: string;
  context?: any;
  trace_id?: string;
  span_id?: string;
}

export interface LogFilter {
  services?: string;
  levels?: string;
  keyword?: string;
}

// WebSocket连接到日志服务
export function connectToLogs(
  filter: LogFilter,
  onMessage: (log: LogEntry) => void,
  onError?: (error: Event) => void
): WebSocket {
  const params = new URLSearchParams();
  if (filter.services) params.append('services', filter.services);
  if (filter.levels) params.append('levels', filter.levels);
  if (filter.keyword) params.append('keyword', filter.keyword);

  const wsUrl = `ws://localhost:8009/ws/logs?${params.toString()}`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const log = JSON.parse(event.data);
      onMessage(log);
    } catch (e) {
      console.error('Failed to parse log message:', e);
    }
  };

  ws.onerror = (event) => {
    console.error('WebSocket error:', event);
    if (onError) onError(event);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return ws;
}

// 获取WebSocket连接状态
export async function getWebSocketStats() {
  try {
    const response = await fetch('http://localhost:8009/ws/stats');
    return await response.json();
  } catch (error) {
    console.error('Failed to get WebSocket stats:', error);
    return null;
  }
}
