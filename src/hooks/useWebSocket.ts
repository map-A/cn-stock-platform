/**
 * WebSocket Hook
 * 用于实时数据推送
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { message } from 'antd';

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  send: (data: any) => void;
  close: () => void;
  reconnect: () => void;
}

/**
 * WebSocket Hook
 */
export const useWebSocket = (
  url: string | null,
  options: UseWebSocketOptions = {},
): UseWebSocketReturn => {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout>();
  const reconnectCountRef = useRef(0);
  const shouldReconnectRef = useRef(true);

  /**
   * 建立连接
   */
  const connect = useCallback(() => {
    if (!url) return;

    try {
      // 清理之前的连接
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        reconnectCountRef.current = 0;
        onOpen?.();
        console.log('[WebSocket] 连接成功:', url);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('[WebSocket] 消息解析失败:', error);
          onMessage?.(event.data);
        }
      };

      ws.onerror = (error) => {
        onError?.(error);
        console.error('[WebSocket] 连接错误:', error);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        onClose?.();
        console.log('[WebSocket] 连接关闭:', event.code, event.reason);

        // 自动重连
        if (
          reconnect &&
          shouldReconnectRef.current &&
          reconnectCountRef.current < reconnectAttempts
        ) {
          reconnectCountRef.current += 1;
          console.log(
            `[WebSocket] 尝试重连 (${reconnectCountRef.current}/${reconnectAttempts})...`,
          );

          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectCountRef.current >= reconnectAttempts) {
          message.error('WebSocket 连接失败，请刷新页面重试');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[WebSocket] 创建失败:', error);
      message.error('WebSocket 创建失败');
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnect, reconnectInterval, reconnectAttempts]);

  /**
   * 发送消息
   */
  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      wsRef.current.send(message);
    } else {
      console.warn('[WebSocket] 未连接，无法发送消息');
    }
  }, []);

  /**
   * 关闭连接
   */
  const closeConnection = useCallback(() => {
    shouldReconnectRef.current = false;
    
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  /**
   * 手动重连
   */
  const manualReconnect = useCallback(() => {
    shouldReconnectRef.current = true;
    reconnectCountRef.current = 0;
    connect();
  }, [connect]);

  /**
   * 初始化连接
   */
  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      closeConnection();
    };
  }, [url, connect, closeConnection]);

  return {
    isConnected,
    send,
    close: closeConnection,
    reconnect: manualReconnect,
  };
};

/**
 * 股票实时行情 WebSocket Hook
 */
export const useStockWebSocket = (
  symbol: string | null,
  onQuoteUpdate: (quote: any) => void,
) => {
  const wsUrl = symbol ? `${process.env.WS_URL}/stock/${symbol}` : null;

  return useWebSocket(wsUrl, {
    onMessage: onQuoteUpdate,
    onOpen: () => {
      console.log(`[股票行情] 订阅成功: ${symbol}`);
    },
    onClose: () => {
      console.log(`[股票行情] 取消订阅: ${symbol}`);
    },
  });
};
