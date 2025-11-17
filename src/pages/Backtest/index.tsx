/**
 * 回测列表页面
 */

import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, Progress, Tooltip, message } from 'antd';
import {
  PlusOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import type { BacktestTask, BacktestStatus } from '@/typings/backtest';

// 模拟数据
const mockBacktests: BacktestTask[] = [
  {
    id: 'bt1',
    strategyId: '1',
    strategyName: '均线交叉策略',
    config: {
      strategyId: '1',
      symbol: '600000.SH',
      startDate: '2024-01-01',
      endDate: '2024-11-01',
      initialCapital: 100000,
      commission: 0.001,
      slippage: 0.001,
      dataSource: 'primary',
      timeframe: '1d',
    },
    status: 'completed',
    progress: 100,
    startTime: '2024-11-15T10:00:00Z',
    endTime: '2024-11-15T10:15:00Z',
    result: {
      id: 'result1',
      taskId: 'bt1',
      strategyId: '1',
      config: {} as any,
      summary: {
        totalReturn: 15.6,
        annualizedReturn: 14.2,
        maxDrawdown: -8.5,
        sharpeRatio: 1.8,
        sortinoRatio: 2.1,
        calmarRatio: 1.67,
        winRate: 65,
        profitFactor: 2.1,
        totalTrades: 45,
        winningTrades: 29,
        losingTrades: 16,
        avgWin: 850,
        avgLoss: -420,
        maxConsecutiveWins: 7,
        maxConsecutiveLosses: 4,
        avgTradeDuration: 5.2,
      },
      equity: [],
      trades: [],
      orders: [],
      metrics: {} as any,
      charts: {} as any,
      createdAt: '2024-11-15T10:15:00Z',
    },
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:15:00Z',
  },
  {
    id: 'bt2',
    strategyId: '2',
    strategyName: 'RSI 超买超卖策略',
    config: {
      strategyId: '2',
      symbol: '000001.SZ',
      startDate: '2024-06-01',
      endDate: '2024-11-16',
      initialCapital: 100000,
      commission: 0.001,
      slippage: 0.001,
      dataSource: 'primary',
      timeframe: '1d',
    },
    status: 'running',
    progress: 65,
    startTime: '2024-11-16T14:00:00Z',
    createdAt: '2024-11-16T14:00:00Z',
    updatedAt: '2024-11-16T14:30:00Z',
  },
];

const BacktestList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // 状态映射
  const statusMap: Record<BacktestStatus, { text: string; status: any }> = {
    pending: { text: '等待中', status: 'default' },
    running: { text: '运行中', status: 'processing' },
    completed: { text: '已完成', status: 'success' },
    failed: { text: '失败', status: 'error' },
    cancelled: { text: '已取消', status: 'default' },
  };

  // 创建回测
  const handleCreate = () => {
    history.push('/backtest/create');
  };

  // 查看详情
  const handleView = (record: BacktestTask) => {
    if (record.status === 'completed') {
      history.push(`/backtest/${record.id}`);
    } else {
      message.info('回测尚未完成');
    }
  };

  // 克隆回测
  const handleClone = (record: BacktestTask) => {
    message.success('回测配置已克隆');
    // TODO: 实现克隆逻辑
  };

  // 导出结果
  const handleExport = (record: BacktestTask) => {
    if (record.status !== 'completed') {
      message.warning('只能导出已完成的回测结果');
      return;
    }
    message.loading('正在导出...', 1.5);
    // TODO: 实现导出逻辑
  };

  // 表格列定义
  const columns: ProColumns<BacktestTask>[] = [
    {
      title: '回测名称',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <a onClick={() => handleView(record)} style={{ fontWeight: 500 }}>
            {record.strategyName}
          </a>
          <span style={{ fontSize: 12, color: '#999' }}>
            {record.config.symbol} | {record.config.startDate} ~ {record.config.endDate}
          </span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      valueType: 'select',
      valueEnum: Object.keys(statusMap).reduce((acc, key) => {
        acc[key] = statusMap[key as BacktestStatus].text;
        return acc;
      }, {} as Record<string, string>),
      render: (_, record) => {
        const config = statusMap[record.status];
        if (record.status === 'running') {
          return (
            <Space direction="vertical" size={0} style={{ width: '100%' }}>
              <Tag color={config.status}>{config.text}</Tag>
              <Progress
                percent={record.progress || 0}
                size="small"
                showInfo={false}
                style={{ marginTop: 4 }}
              />
            </Space>
          );
        }
        return <Tag color={config.status}>{config.text}</Tag>;
      },
    },
    {
      title: '配置',
      width: 200,
      hideInSearch: true,
      render: (_, record) => {
        const { config } = record;
        return (
          <Space direction="vertical" size={0}>
            <span style={{ fontSize: 12 }}>
              初始资金: ¥{(config.initialCapital / 10000).toFixed(0)}万
            </span>
            <span style={{ fontSize: 12, color: '#999' }}>
              周期: {config.timeframe} | 手续费: {(config.commission * 100).toFixed(2)}%
            </span>
          </Space>
        );
      },
    },
    {
      title: 'KPI 快照',
      width: 280,
      hideInSearch: true,
      render: (_, record) => {
        if (record.status !== 'completed' || !record.result) {
          return '-';
        }
        const { summary } = record.result;
        return (
          <Space size="large">
            <Tooltip title="总收益率">
              <span style={{ color: summary.totalReturn >= 0 ? '#52c41a' : '#ff4d4f' }}>
                收益: {summary.totalReturn >= 0 ? '+' : ''}{summary.totalReturn.toFixed(1)}%
              </span>
            </Tooltip>
            <Tooltip title="最大回撤">
              <span style={{ fontSize: 12, color: '#999' }}>
                回撤: {summary.maxDrawdown.toFixed(1)}%
              </span>
            </Tooltip>
            <Tooltip title="夏普比率">
              <span style={{ fontSize: 12, color: '#999' }}>
                夏普: {summary.sharpeRatio.toFixed(2)}
              </span>
            </Tooltip>
            <Tooltip title="交易次数">
              <span style={{ fontSize: 12, color: '#999' }}>
                {summary.totalTrades} 笔
              </span>
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: '运行时间',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        if (!record.startTime) return '-';
        if (!record.endTime) {
          return (
            <Space direction="vertical" size={0}>
              <span style={{ fontSize: 12 }}>开始: {new Date(record.startTime).toLocaleString()}</span>
              <span style={{ fontSize: 12, color: '#1890ff' }}>运行中...</span>
            </Space>
          );
        }
        const duration = (new Date(record.endTime).getTime() - new Date(record.startTime).getTime()) / 1000;
        return (
          <Space direction="vertical" size={0}>
            <span style={{ fontSize: 12 }}>{new Date(record.endTime).toLocaleString()}</span>
            <span style={{ fontSize: 12, color: '#999' }}>
              耗时: {duration < 60 ? `${duration.toFixed(0)}秒` : `${(duration / 60).toFixed(1)}分钟`}
            </span>
          </Space>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      valueType: 'dateTime',
      hideInTable: true,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            disabled={record.status !== 'completed'}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleClone(record)}
          >
            克隆
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleExport(record)}
            disabled={record.status !== 'completed'}
          >
            导出
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '回测管理',
        breadcrumb: {},
      }}
    >
      <ProTable<BacktestTask>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          // TODO: 调用真实 API
          console.log('请求参数:', params);
          return {
            data: mockBacktests,
            success: true,
            total: mockBacktests.length,
          };
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        dateFormatter="string"
        headerTitle="回测列表"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            创建回测
          </Button>,
        ]}
        polling={2000} // 每2秒轮询一次，更新运行中的回测状态
      />
    </PageContainer>
  );
};

export default BacktestList;
