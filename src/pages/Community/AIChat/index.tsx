/**
 * AI聊天页面
 * 提供AI对话功能，支持多种专业代理
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { chatService, ChatMessage, ChatSession } from '../../../services/chatService';
import { useUserStore } from '../../../stores/userStore';
import './style.css';

// Agent类型配置
const AGENT_TYPES = [
  { id: 'general', name: '通用助手', description: '回答各类问题', icon: '🤖' },
  { id: 'stock', name: '股票分析', description: '股票基本面分析', icon: '📊' },
  { id: 'technical', name: '技术分析', description: '技术指标和图表', icon: '📈' },
  { id: 'options', name: '期权专家', description: '期权策略和分析', icon: '📉' },
  { id: 'financial', name: '财务分析', description: '财务报表解读', icon: '💰' },
];

const AIChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUserStore();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('general');
  const [showSidebar, setShowSidebar] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // 加载会话列表
  useEffect(() => {
    if (user) {
      loadSessions();
      loadSuggestions();
    }
  }, [user]);

  // 从URL参数加载会话
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId && sessions.length > 0) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
        setMessages(session.messages);
        setSelectedAgent(session.agentType || 'general');
      }
    }
  }, [searchParams, sessions]);

  const loadSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const data = await chatService.getSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const session = await chatService.createSession('新对话', selectedAgent);
      setSessions([session, ...sessions]);
      setCurrentSession(session);
      setMessages([]);
      navigate(`/chat?session=${session.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await chatService.deleteSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
        navigate('/chat');
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsStreaming(true);
    setStreamingContent('');

    try {
      let fullResponse = '';

      await chatService.streamMessage(
        {
          message: inputMessage,
          sessionId: currentSession?.id,
          agentType: selectedAgent,
        },
        (chunk) => {
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        },
        () => {
          const assistantMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setStreamingContent('');
          setIsStreaming(false);

          // 更新会话列表
          if (currentSession) {
            loadSessions();
          }
        },
        (error) => {
          console.error('Streaming error:', error);
          setIsStreaming(false);
          setStreamingContent('');
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="ai-chat-page">
      {/* 侧边栏 */}
      {showSidebar && (
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h3>对话历史</h3>
            <button onClick={createNewSession} className="new-chat-btn">
              新对话
            </button>
          </div>

          <div className="agent-selector">
            <label>选择助手类型：</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              disabled={!!currentSession}
            >
              {AGENT_TYPES.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.icon} {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sessions-list">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`session-item ${currentSession?.id === session.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSession(session);
                  setMessages(session.messages);
                  navigate(`/chat?session=${session.id}`);
                }}
              >
                <div className="session-title">{session.title}</div>
                <div className="session-time">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 主聊天区域 */}
      <div className="chat-main">
        <div className="chat-header">
          <button onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? '隐藏' : '显示'}侧边栏
          </button>
          {currentSession && (
            <h2>{currentSession.title}</h2>
          )}
        </div>

        <div className="chat-messages">
          {messages.length === 0 && !currentSession && (
            <div className="welcome-screen">
              <h2>👋 你好！我是AI助手</h2>
              <p>选择一个助手类型开始对话，或尝试以下问题：</p>
              <div className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isStreaming && streamingContent && (
            <div className="message assistant streaming">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-text">{streamingContent}</div>
                <div className="typing-indicator">正在输入...</div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Shift+Enter换行，Enter发送)"
            disabled={isStreaming}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isStreaming}
          >
            {isStreaming ? '发送中...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
