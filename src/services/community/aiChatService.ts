/**
 * @file AI聊天服务
 * @description 提供AI智能问答、股票分析助手等功能
 */

import request from '@/utils/request';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    sources?: string[];
    stocksmentioned?: string[];
    agentType?: string;
  };
}

export interface ChatThread {
  id: string;
  title: string;
  message: string;
  messages: ChatMessage[];
  created: string;
  updated: string;
}

export interface AIAgent {
  name: string;
  group: string;
  description: string;
  credit: number;
  capabilities: string[];
}

export interface RandomChat {
  query: string;
  label: string;
  type: string;
}

/**
 * AI聊天服务类
 */
class AIChatService {
  /**
   * 创建新的聊天对话
   * @description 创建一个新的AI对话线程
   */
  async createChat(query: string): Promise<{ id: string }> {
    const response = await request.post('/api/chat/create', { query });
    return response.data;
  }

  /**
   * 发送消息
   * @description 在现有对话中发送消息
   */
  async sendMessage(params: {
    threadId: string;
    message: string;
    agentType?: string;
  }): Promise<ChatMessage> {
    const response = await request.post('/api/chat/message', params);
    return response.data;
  }

  /**
   * 获取对话详情
   * @description 获取特定对话的完整历史
   */
  async getChatThread(threadId: string): Promise<ChatThread> {
    const response = await request.get(`/api/chat/thread/${threadId}`);
    return response.data;
  }

  /**
   * 获取所有对话列表
   * @description 获取用户的所有聊天对话
   */
  async getAllChats(params: {
    page?: number;
    size?: number;
  }): Promise<{
    threads: ChatThread[];
    total: number;
  }> {
    const response = await request.get('/api/chat/threads', { params });
    return response.data;
  }

  /**
   * 删除对话
   * @description 删除指定的聊天对话
   */
  async deleteChat(threadId: string): Promise<{ success: boolean }> {
    const response = await request.delete(`/api/chat/thread/${threadId}`);
    return response.data;
  }

  /**
   * 获取AI代理列表
   * @description 获取所有可用的AI专业代理
   */
  async getAgents(): Promise<{
    agents: AIAgent[];
    categories: string[];
  }> {
    const response = await request.get('/api/chat/agents');
    return response.data;
  }

  /**
   * 获取随机推荐问题
   * @description 获取一些推荐的示例问题
   */
  async getRandomChats(): Promise<RandomChat[]> {
    const response = await request.get('/api/chat/random-chats');
    return response.data;
  }

  /**
   * 获取用户剩余积分
   * @description 获取用户可用的AI对话积分
   */
  async getUserCredits(): Promise<{ credits: number }> {
    const response = await request.get('/api/chat/credits');
    return response.data;
  }

  /**
   * 停止生成
   * @description 停止当前AI回复的生成
   */
  async stopGeneration(threadId: string): Promise<{ success: boolean }> {
    const response = await request.post('/api/chat/stop', { threadId });
    return response.data;
  }

  /**
   * 重新生成回复
   * @description 重新生成最后一条AI回复
   */
  async regenerateResponse(params: {
    threadId: string;
    messageId: string;
  }): Promise<ChatMessage> {
    const response = await request.post('/api/chat/regenerate', params);
    return response.data;
  }
}

export default new AIChatService();
