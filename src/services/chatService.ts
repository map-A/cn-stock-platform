/**
 * AI聊天服务
 * 提供AI对话功能相关的API调用
 */

import { apiClient } from './apiClient';

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentType?: string; // 代理类型：stock, options, technical等
}

/**
 * 聊天会话接口
 */
export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  agentType?: string;
}

/**
 * 聊天请求接口
 */
export interface ChatRequest {
  message: string;
  sessionId?: string;
  agentType?: string;
  context?: Record<string, any>;
}

/**
 * 聊天响应接口
 */
export interface ChatResponse {
  message: ChatMessage;
  sessionId: string;
  suggestions?: string[];
}

/**
 * 聊天服务类
 */
class ChatService {
  /**
   * 发送聊天消息
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post('/api/chat/send', request);
    return response.data;
  }

  /**
   * 获取聊天会话列表
   */
  async getSessions(): Promise<ChatSession[]> {
    const response = await apiClient.get('/api/chat/sessions');
    return response.data;
  }

  /**
   * 获取聊天会话详情
   */
  async getSession(sessionId: string): Promise<ChatSession> {
    const response = await apiClient.get(`/api/chat/sessions/${sessionId}`);
    return response.data;
  }

  /**
   * 创建新会话
   */
  async createSession(title?: string, agentType?: string): Promise<ChatSession> {
    const response = await apiClient.post('/api/chat/sessions', { title, agentType });
    return response.data;
  }

  /**
   * 删除会话
   */
  async deleteSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/api/chat/sessions/${sessionId}`);
  }

  /**
   * 更新会话标题
   */
  async updateSession(sessionId: string, title: string): Promise<void> {
    await apiClient.patch(`/api/chat/sessions/${sessionId}`, { title });
  }

  /**
   * 获取推荐问题
   */
  async getSuggestions(context?: Record<string, any>): Promise<string[]> {
    const response = await apiClient.post('/api/chat/suggestions', context);
    return response.data;
  }

  /**
   * 清空会话历史
   */
  async clearHistory(sessionId: string): Promise<void> {
    await apiClient.delete(`/api/chat/sessions/${sessionId}/messages`);
  }

  /**
   * 流式获取AI响应（Server-Sent Events）
   */
  async streamMessage(
    request: ChatRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${apiClient.defaults.baseURL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiClient.defaults.headers.common,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete();
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      onError(error as Error);
    }
  }
}

export const chatService = new ChatService();
export default chatService;
