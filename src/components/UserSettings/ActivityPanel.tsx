/**
 * 活动日志面板组件
 * 实时显示系统各服务的日志
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Switch, Select, Input, Button, Table, Tag, Space } from 'antd';
import {
  ReloadOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ClearOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { connectToLogs, type LogEntry, type LogFilter } from '@/services/logs';
import dayjs from 'dayjs';

const { Search } = Input;

// 日志级别颜色映射
const LOG_LEVEL_COLORS: Record<string, string> = {
  trace: 'default',
  debug: 'cyan',
  info: 'blue',
  warn: 'orange',
  error: 'red',
};

// 可用服务列表
const AVAILABLE_SERVICES = [
  { value: 'market-service', label: 'Market Service' },
  { value: 'account-service', label: 'Account Service' },
  { value: 'backtest-service', label: 'Backtest Service' },
  { value: 'ai-engine', label: 'AI Engine' },
  { value: 'news-service', label: 'News Service' },
  { value: 'strategy-engine', label: 'Strategy Engine' },
  { value: 'gateway', label: 'Gateway' },
];

export const ActivityLogPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [maxLogs, setMaxLogs] = useState(500);
  
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['info', 'warn', 'error']);
  const [keyword, setKeyword] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const connectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const filter: LogFilter = {
      services: selectedServices.length > 0 ? selectedServices.join(',') : undefined,
      levels: selectedLevels.length > 0 ? selectedLevels.join(',') : undefined,
      keyword: keyword || undefined,
    };

    const ws = connectToLogs(
      filter,
      (log) => {
        if (!isPaused) {
          setLogs((prev) => {
            const newLogs = [...prev, log];
            return newLogs.slice(-maxLogs);
          });
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      }
    );

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [selectedServices, selectedLevels, keyword]);

  const handleClear = () => {
    setLogs([]);
  };

  const handleExport = () => {
    const content = logs
      .map((log) => `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.service}] ${log.message}`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${dayjs().format('YYYY-MM-DD-HHmmss')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => dayjs(timestamp).format('HH:mm:ss.SSS'),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={LOG_LEVEL_COLORS[level] || 'default'}>
          {level.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '服务',
      dataIndex: 'service',
      key: 'service',
      width: 150,
      render: (service: string) => <Tag color="purple">{service}</Tag>,
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (message: string) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{message}</span>,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Badge status={isConnected ? 'processing' : 'error'} text={isConnected ? 'LIVE' : 'Disconnected'} />
              <span style={{ color: '#999' }}>共 {logs.length} 条日志</span>
            </Space>
            <Space>
              <Button
                icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? '继续' : '暂停'}
              </Button>
              <Button icon={<ReloadOutlined />} onClick={connectWebSocket}>
                重连
              </Button>
              <Button icon={<ClearOutlined />} onClick={handleClear}>
                清空
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>服务筛选</div>
              <Select
                mode="multiple"
                placeholder="选择服务（空=全部）"
                value={selectedServices}
                onChange={setSelectedServices}
                style={{ width: '100%' }}
                options={AVAILABLE_SERVICES}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>日志级别</div>
              <Select
                mode="multiple"
                placeholder="选择级别"
                value={selectedLevels}
                onChange={setSelectedLevels}
                style={{ width: '100%' }}
                options={[
                  { value: 'trace', label: 'TRACE' },
                  { value: 'debug', label: 'DEBUG' },
                  { value: 'info', label: 'INFO' },
                  { value: 'warn', label: 'WARN' },
                  { value: 'error', label: 'ERROR' },
                ]}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>关键词搜索</div>
              <Search
                placeholder="搜索日志内容"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={setKeyword}
                allowClear
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <label>
              <Switch checked={autoScroll} onChange={setAutoScroll} size="small" />
              <span style={{ marginLeft: '8px' }}>自动滚动</span>
            </label>
            <label>
              <span style={{ marginRight: '8px' }}>最大日志数：</span>
              <Select
                value={maxLogs}
                onChange={setMaxLogs}
                style={{ width: '100px' }}
                size="small"
                options={[
                  { value: 100, label: '100' },
                  { value: 500, label: '500' },
                  { value: 1000, label: '1000' },
                  { value: 5000, label: '5000' },
                ]}
              />
            </label>
          </div>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={logs}
          rowKey={(record) => `${record.timestamp}-${Math.random()}`}
          size="small"
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1000, y: 600 }}
        />
      </Card>
    </div>
  );
};

export default ActivityLogPanel;
