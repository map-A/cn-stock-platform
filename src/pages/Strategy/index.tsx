/**
 * 策略列表页面
 */

import React, { useRef, useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, Dropdown, Modal, message } from 'antd';
import {
  PlusOutlined,
  ExperimentOutlined,
  CodeOutlined,
  PlayCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import type { Strategy, StrategyType, StrategyStatus } from '@/typings/strategy';

// 模拟数据
const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: '均线交叉策略',
    description: '基于 MA10 和 MA20 的交叉信号',
    type: 'trend',
    status: 'active',
    author: '张三',
    tags: ['均线', '趋势'],
    mode: 'visual',
    version: 3,
    lastBacktest: {
      id: 'bt1',
      date: '2024-11-15',
      return: 15.6,
      sharpe: 1.8,
    },
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-11-15T14:30:00Z',
  },
  {
    id: '2',
    name: 'RSI 超买超卖策略',
    description: 'RSI 指标的超买超卖策略',
    type: 'mean_reversion',
    status: 'testing',
    author: '李四',
    tags: ['RSI', '均值回归'],
    mode: 'code',
    version: 1,
    lastBacktest: {
      id: 'bt2',
      date: '2024-11-16',
      return: 8.2,
      sharpe: 1.2,
    },
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-11-16T16:00:00Z',
  },
];

const StrategyList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 策略类型映射
  const strategyTypeMap: Record<StrategyType, { text: string; color: string }> = {
    intraday: { text: '日内', color: 'blue' },
    swing: { text: '波段', color: 'green' },
    trend: { text: '趋势', color: 'purple' },
    mean_reversion: { text: '均值回归', color: 'orange' },
    arbitrage: { text: '套利', color: 'cyan' },
    options: { text: '期权', color: 'magenta' },
    custom: { text: '自定义', color: 'default' },
  };

  // 状态映射
  const statusMap: Record<StrategyStatus, { text: string; color: string }> = {
    draft: { text: '草稿', color: 'default' },
    active: { text: '激活', color: 'success' },
    testing: { text: '测试中', color: 'processing' },
    paused: { text: '暂停', color: 'warning' },
    archived: { text: '已归档', color: 'default' },
  };

  // 创建策略
  const handleCreate = (mode: 'visual' | 'code' | 'template') => {
    if (mode === 'template') {
      // TODO: 打开模板选择器
      message.info('模板选择器开发中...');
    } else {
      // 跳转到创建页面
      history.push(`/strategy/create?mode=${mode}`);
    }
  };

  // 编辑策略
  const handleEdit = (record: Strategy) => {
    history.push(`/strategy/${record.id}`);
  };

  // 快速回测
  const handleQuickBacktest = (record: Strategy) => {
    message.loading('启动快速回测...', 1.5);
    // TODO: 实现快速回测
  };

  // 克隆策略
  const handleClone = (record: Strategy) => {
    Modal.confirm({
      title: '克隆策略',
      content: `确定要克隆策略 "${record.name}" 吗？`,
      onOk: () => {
        message.success('策略克隆成功');
        actionRef.current?.reload();
      },
    });
  };

  // 删除策略
  const handleDelete = (record: Strategy) => {
    Modal.confirm({
      title: '删除策略',
      content: `确定要删除策略 "${record.name}" 吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      onOk: () => {
        message.success('策略删除成功');
        actionRef.current?.reload();
      },
    });
  };

  // 批量回测
  const handleBatchBacktest = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要回测的策略');
      return;
    }
    message.loading('启动批量回测...', 1.5);
    // TODO: 实现批量回测
  };

  // 表格列定义
  const columns: ProColumns<Strategy>[] = [
    {
      title: '策略名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <a onClick={() => handleEdit(record)} style={{ fontWeight: 500 }}>
            {record.name}
          </a>
          {record.description && (
            <span style={{ fontSize: 12, color: '#999' }}>
              {record.description}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: Object.keys(strategyTypeMap).reduce((acc, key) => {
        acc[key] = strategyTypeMap[key as StrategyType].text;
        return acc;
      }, {} as Record<string, string>),
      render: (_, record) => {
        const config = strategyTypeMap[record.type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '模式',
      dataIndex: 'mode',
      width: 90,
      render: (_, record) => {
        const icons = {
          visual: <ExperimentOutlined />,
          code: <CodeOutlined />,
          hybrid: <ExperimentOutlined />,
        };
        const texts = {
          visual: '可视化',
          code: '代码',
          hybrid: '混合',
        };
        return (
          <Space>
            {icons[record.mode]}
            {texts[record.mode]}
          </Space>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      valueEnum: Object.keys(statusMap).reduce((acc, key) => {
        acc[key] = statusMap[key as StrategyStatus].text;
        return acc;
      }, {} as Record<string, string>),
      render: (_, record) => {
        const config = statusMap[record.status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <Space wrap>
          {record.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '最近回测',
      width: 180,
      hideInSearch: true,
      render: (_, record) => {
        if (!record.lastBacktest) return '-';
        const { date, return: ret, sharpe } = record.lastBacktest;
        return (
          <Space direction="vertical" size={0}>
            <span style={{ fontSize: 12 }}>{date}</span>
            <Space size="small">
              <span style={{ color: ret >= 0 ? '#52c41a' : '#ff4d4f' }}>
                收益: {ret >= 0 ? '+' : ''}{ret.toFixed(1)}%
              </span>
              <span style={{ fontSize: 12, color: '#999' }}>
                夏普: {sharpe.toFixed(2)}
              </span>
            </Space>
          </Space>
        );
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 100,
      hideInTable: true,
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 80,
      hideInSearch: true,
      render: (_, record) => `v${record.version}`,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 160,
      valueType: 'dateTime',
      hideInSearch: true,
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
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handleQuickBacktest(record)}
          >
            回测
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'clone',
                  label: '克隆',
                  icon: <CopyOutlined />,
                  onClick: () => handleClone(record),
                },
                {
                  key: 'export',
                  label: '导出',
                  icon: <ExportOutlined />,
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  label: '删除',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record),
                },
              ],
            }}
          >
            <Button type="link" size="small">
              更多
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '策略管理',
        breadcrumb: {},
      }}
    >
      <ProTable<Strategy>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          // TODO: 调用真实 API
          console.log('请求参数:', params);
          return {
            data: mockStrategies,
            success: true,
            total: mockStrategies.length,
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
        headerTitle="策略列表"
        toolBarRender={() => [
          <Button
            key="import"
            icon={<ImportOutlined />}
            onClick={() => message.info('导入功能开发中...')}
          >
            导入
          </Button>,
          <Dropdown
            key="create"
            menu={{
              items: [
                {
                  key: 'visual',
                  label: '可视化策略',
                  icon: <ExperimentOutlined />,
                  onClick: () => handleCreate('visual'),
                },
                {
                  key: 'code',
                  label: '代码策略',
                  icon: <CodeOutlined />,
                  onClick: () => handleCreate('code'),
                },
                {
                  type: 'divider',
                },
                {
                  key: 'template',
                  label: '从模板创建',
                  onClick: () => handleCreate('template'),
                },
              ],
            }}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              创建策略
            </Button>
          </Dropdown>,
        ]}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertRender={({ selectedRowKeys }) => (
          <Space size={24}>
            <span>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button size="small" onClick={handleBatchBacktest}>
              批量回测
            </Button>
            <Button size="small" onClick={() => setSelectedRowKeys([])}>
              取消选择
            </Button>
          </Space>
        )}
      />
    </PageContainer>
  );
};

export default StrategyList;
