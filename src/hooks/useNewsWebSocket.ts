/**
 * WebSocket Hook for Real-time News Updates
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { message } from 'antd';
import type { NewsItem } from '@/types/news';

const WS_URL = 'ws://localhost:8007/ws';
const RECONNECT_INTERVAL = 3000; // 3秒重连

export interface UseNewsWebSocketOptions {
  onMessage?: (news: NewsItem) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  autoConnect?: boolean;
}

export const useNewsWebSocket = (options: UseNewsWebSocketOptions = {}) => {
  const {
    onMessage,
    onConnected,
    onDisconnected,
    autoConnect = true,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latestNews, setLatestNews] = useState<NewsItem | null>(null);

  const connect = useCallback(() => {
    try {
      // 清除现有连接
      if (wsRef.current) {
        wsRef.current.close();
      }

      console.log('Connecting to news WebSocket:', WS_URL);
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('News WebSocket connected');
        setIsConnected(true);
        onConnected?.();
        
        // 清除重连定时器
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // 处理连接消息
          if (data.type === 'connected') {
            console.log('WebSocket connection confirmed:', data.message);
            return;
          }

          // 处理新闻数据
          if (data.id && data.title) {
            const newsItem: NewsItem = {
              id: data.id,
              title: data.title,
              content: data.content,
              summary: data.content.substring(0, 100) + '...',
              source: data.source,
              publishedAt: data.timestamp,
              category: 'news' as any,
              importance: 5,
              sentiment: data.sentiment || 'neutral',
              sentimentScore: 0,
              url: null,
              imageUrl: null,
              tags: [],
              stocks: data.symbols || [],
            };

            console.log('Received news update:', newsItem.title);
            setLatestNews(newsItem);
            onMessage?.(newsItem);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('News WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('News WebSocket disconnected');
        setIsConnected(false);
        onDisconnected?.();
        wsRef.current = null;

        // 自动重连
        if (autoConnect && !reconnectTimerRef.current) {
          console.log(`Reconnecting in ${RECONNECT_INTERVAL}ms...`);
          reconnectTimerRef.current = setTimeout(() => {
            reconnectTimerRef.current = null;
            connect();
          }, RECONNECT_INTERVAL);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      message.error('无法连接到新闻服务');
    }
  }, [onMessage, onConnected, onDisconnected, autoConnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // 自动连接
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    latestNews,
    connect,
    disconnect,
  };
};
