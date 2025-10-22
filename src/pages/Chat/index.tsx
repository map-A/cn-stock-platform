/**
 * AI Stock Agent 聊天页面
 * 参考 Stocknear 的 Chat 组件实现
 */
import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Space, Spin, Empty, Divider, Tag, Badge } from 'antd';
import {
  SendOutlined,
  ClearOutlined,
  BgColorsOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import styles from './index.less';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  thinking?: string;
  sources?: Array<{
    title: string;
    url?: string;
  }>;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 模拟发送消息
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsThinking(true);

    // 模拟AI响应延迟
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `关于"${input}"的分析：\n\n这是一个AI助手的示例响应。在实际应用中，这里将返回真实的股票分析数据和建议。`,
        timestamp: Date.now(),
        thinking: '正在分析您的问题...',
        sources: [
          { title: '股票数据API', url: '#' },
          { title: '新闻数据源', url: '#' },
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 2000);
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新建对话',
      createdAt: Date.now(),
      messages: [],
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const suggestedPrompts = [
    '分析AAPL股票最近的走势',
    '找出今天涨幅最大的股票',
    '对比AAPL和MSFT哪个更值得投资',
    '查看科技板块的总体表现',
    '推荐一些高红利收益股票',
  ];

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatLayout}>
        {/* 左侧：会话列表 */}
        <div className={styles.sessionPanel}>
          <div className={styles.sessionHeader}>
            <h3>对话历史</h3>
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={handleNewChat}
              className={styles.newChatBtn}
            />
          </div>
          <div className={styles.sessionList}>
            {sessions.length === 0 ? (
              <Empty
                description="暂无对话"
                style={{ marginTop: 40 }}
                size="small"
              />
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`${styles.sessionItem} ${
                    currentSessionId === session.id ? styles.active : ''
                  }`}
                  onClick={() => {
                    setCurrentSessionId(session.id);
                    setMessages(session.messages);
                  }}
                >
                  <div className={styles.sessionTitle}>{session.title}</div>
                  <div className={styles.sessionTime}>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 右侧：聊天窗口 */}
        <div className={styles.chatPanel}>
          {/* 聊天头 */}
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <Badge dot color="#00FC50" />
              <span>AI Stock Agent</span>
            </div>
            <Space>
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={handleClearHistory}
                size="small"
              />
            </Space>
          </div>

          {/* 消息区域 */}
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🤖</div>
                <h2>欢迎使用 AI Stock Agent</h2>
                <p>
                  我是一个智能的股票分析助手，可以帮助您分析股票、查找投资机会。
                </p>

                <Divider>或者尝试以下问题</Divider>

                <div className={styles.suggestedPrompts}>
                  {suggestedPrompts.map((prompt, idx) => (
                    <Card
                      key={idx}
                      size="small"
                      hoverable
                      onClick={() => setInput(prompt)}
                      className={styles.promptCard}
                    >
                      {prompt}
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.messagesList}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.messageItem} ${styles[message.role]}`}
                  >
                    <div className={styles.messageBubble}>
                      {message.thinking && (
                        <div className={styles.thinking}>
                          💭 {message.thinking}
                        </div>
                      )}
                      <div className={styles.messageContent}>
                        {message.content}
                      </div>
                      {message.sources && message.sources.length > 0 && (
                        <div className={styles.sources}>
                          <span className={styles.sourcesLabel}>数据来源:</span>
                          <Space size="small" wrap>
                            {message.sources.map((source, idx) => (
                              <Tag key={idx} color="blue">
                                {source.title}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className={`${styles.messageItem} ${styles.assistant}`}>
                    <div className={styles.messageBubble}>
                      <Spin size="small" />
                      <span style={{ marginLeft: 8 }}>AI正在思考...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <div className={styles.inputArea}>
            <Input.TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  handleSendMessage();
                }
              }}
              placeholder="输入您的问题... (Ctrl+Enter 发送)"
              autoSize={{ minRows: 2, maxRows: 4 }}
              className={styles.input}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={isThinking}
              className={styles.sendBtn}
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
