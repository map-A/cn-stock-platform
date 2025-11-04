/**
 * 策略列表页面 - 组件化版本
 * 使用 StrategyCard 和 StrategyStats 组件
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Drawer,
  Tabs,
  message,
  Empty,
  Typography,
  Descriptions,
  Timeline,
  Badge,
  Tag,
  Space,
  Table,
  Segmented,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { getStrategies, deleteStrategy } from '@/services/strategy';
import { getBacktests } from '@/services/backtestService';
import StrategyCard from '@/components/Strategy/StrategyCard';
import StrategyStats from '@/components/Strategy/StrategyStats';
import CreateStrategyModal from '@/components/Strategy/CreateStrategyModal';
import EditStrategyModal from '@/components/Strategy/EditStrategyModal';
import './index.less';

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface Strategy {
  id: string | number;
  name: string;
  description?: string;
  strategy_type: string;
  status: string;
  parameters?: any;
  config?: any;
  created_at?: string;
  updated_at?: string;
}

interface Backtest {
  id: string | number;
  strategy_id: string | number;
  name?: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  final_capital?: number;
  return_percent?: number;
  max_drawdown?: number;
  sharpe_ratio?: number;
  win_rate?: number;
  status: string;
}

const StrategyList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [backtests, setBacktests] = useState<Backtest[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // 策略类型和状态映射
  const typeMap: Record<string, { color: string; label: string }> = {
    trend_following: { color: 'blue', label: '趋势跟踪' },
    mean_reversion: { color: 'green', label: '均值回归' },
    momentum: { color: 'orange', label: '动量策略' },
    quantitative: { color: 'purple', label: '量化策略' },
    machine_learning: { color: 'geekblue', label: 'AI/ML' },
    grid: { color: 'cyan', label: '网格策略' },
    arbitrage: { color: 'magenta', label: '套利策略' },
    custom: { color: 'default', label: '自定义' },
  };

  const statusMap: Record<string, { color: string; label: string }> = {
    draft: { color: 'default', label: '草稿' },
    testing: { color: 'processing', label: '测试中' },
    active: { color: 'success', label: '运行中' },
    paused: { color: 'warning', label: '已暂停' },
    stopped: { color: 'error', label: '已停止' },
    archived: { color: 'default', label: '已归档' },
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterStrategies();
  }, [strategies, searchKeyword, filterType, filterStatus]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [strategyData, backtestData] = await Promise.all([
        getStrategies(),
        getBacktests(),
      ]);

      console.log('Strategy data:', strategyData);
      console.log('Backtest data:', backtestData);

      setStrategies(strategyData.items || []);
      setBacktests(backtestData.items || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const filterStrategies = () => {
    let filtered = [...strategies];

    if (searchKeyword) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((s) => s.strategy_type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    setFilteredStrategies(filtered);
  };

  // 计算统计数据
  const stats = {
    total: strategies.length,
    active: strategies.filter((s) => s.status === 'active').length,
    testing: strategies.filter((s) => s.status === 'testing').length,
    draft: strategies.filter((s) => s.status === 'draft').length,
    avgWinRate:
      backtests.length > 0
        ? (
            backtests.reduce((sum, b) => sum + (b.win_rate || 0), 0) /
            backtests.length
          ).toFixed(2)
        : '0',
    avgReturn:
      backtests.length > 0
        ? (
            backtests.reduce((sum, b) => sum + (b.return_percent || 0), 0) /
            backtests.length
          ).toFixed(2)
        : '0',
    totalBacktests: backtests.length,
    todaySignals: Math.floor(Math.random() * 20), // 模拟数据
  };

  // 计算策略类型分布
  const strategyTypes = strategies.reduce((acc, s) => {
    const type = s.strategy_type || 'custom';
    const label = typeMap[type]?.label || '自定义';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 获取策略的回测记录
  const getStrategyBacktests = (strategyId: string | number) => {
    return backtests.filter((b) => String(b.strategy_id) === String(strategyId));
  };

  // 获取策略的最佳回测
  const getBestBacktest = (strategyId: string | number) => {
    const strategyBacktests = getStrategyBacktests(strategyId);
    if (strategyBacktests.length === 0) return undefined;
    return strategyBacktests.reduce((best, current) => {
      if (!best) return current;
      return (current.return_percent || 0) > (best.return_percent || 0)
        ? current
        : best;
    }, strategyBacktests[0]);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteStrategy(String(id));
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const showStrategyDetail = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setDetailDrawerVisible(true);
  };

  // 表格列定义
  const tableColumns = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'strategy_type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const info = typeMap[type] || typeMap.custom;
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const info = statusMap[status] || statusMap.draft;
        return <Badge status={info.color as any} text={info.label} />;
      },
    },
    {
      title: '回测次数',
      key: 'backtests',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: Strategy) => getStrategyBacktests(record.id).length,
    },
    {
      title: '最佳收益',
      key: 'return',
      width: 100,
      align: 'right' as const,
      render: (_: any, record: Strategy) => {
        const best = getBestBacktest(record.id);
        return best?.return_percent
          ? `${best.return_percent.toFixed(2)}%`
          : '-';
      },
    },
    {
      title: '胜率',
      key: 'winRate',
      width: 100,
      align: 'right' as const,
      render: (_: any, record: Strategy) => {
        const best = getBestBacktest(record.id);
        return best?.win_rate ? `${best.win_rate.toFixed(2)}%` : '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (date: string) =>
        date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
  ];

  return (
    <PageContainer
      title="AI策略管理"
      extra={[
        <Button key="reload" icon={<ReloadOutlined />} onClick={loadData}>
          刷新
        </Button>,
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          创建策略
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {/* 统计面板 */}
        <StrategyStats
          total={stats.total}
          active={stats.active}
          testing={stats.testing}
          draft={stats.draft}
          avgWinRate={stats.avgWinRate}
          avgReturn={stats.avgReturn}
          totalBacktests={stats.totalBacktests}
          todaySignals={stats.todaySignals}
          strategyTypes={strategyTypes}
        />

        {/* 筛选和搜索 */}
        <Card style={{ marginBottom: 16, marginTop: 16 }}>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索策略名称或描述"
                allowClear
                enterButton={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="策略类型"
                value={filterType}
                onChange={setFilterType}
              >
                <Option value="all">全部类型</Option>
                {Object.entries(typeMap).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="状态"
                value={filterStatus}
                onChange={setFilterStatus}
              >
                <Option value="all">全部状态</Option>
                {Object.entries(statusMap).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Segmented
                value={viewMode}
                onChange={(value) => setViewMode(value as 'card' | 'table')}
                options={[
                  {
                    label: '卡片',
                    value: 'card',
                    icon: <AppstoreOutlined />,
                  },
                  {
                    label: '列表',
                    value: 'table',
                    icon: <UnorderedListOutlined />,
                  },
                ]}
              />
            </Col>
          </Row>
        </Card>

        {/* 策略展示 */}
        {viewMode === 'card' ? (
          // 卡片视图
          <Row gutter={[16, 16]}>
            {filteredStrategies.length > 0 ? (
              filteredStrategies.map((strategy) => (
                <Col key={strategy.id} xs={24} sm={12} lg={8} xl={6}>
                  <StrategyCard
                    strategy={strategy}
                    bestBacktest={getBestBacktest(strategy.id)}
                    backtestCount={getStrategyBacktests(strategy.id).length}
                    onView={() => showStrategyDetail(strategy)}
                    onEdit={() => {
                      setSelectedStrategy(strategy);
                      setEditModalVisible(true);
                    }}
                    onRun={() => message.info('运行功能开发中')}
                    onBacktest={() => message.info('回测功能开发中')}
                    onDelete={() => handleDelete(strategy.id)}
                  />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Card>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无策略数据"
                  >
                    <Button type="primary" icon={<PlusOutlined />}>
                      创建第一个策略
                    </Button>
                  </Empty>
                </Card>
              </Col>
            )}
          </Row>
        ) : (
          // 表格视图
          <Card>
            <Table
              columns={tableColumns}
              dataSource={filteredStrategies}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无策略数据"
                  />
                ),
              }}
            />
          </Card>
        )}

        {/* 策略详情抽屉 */}
        <Drawer
          title={
            <Space>
              <span>{selectedStrategy?.name}</span>
              <Tag color={typeMap[selectedStrategy?.strategy_type || 'custom']?.color}>
                {typeMap[selectedStrategy?.strategy_type || 'custom']?.label}
              </Tag>
            </Space>
          }
          width={720}
          open={detailDrawerVisible}
          onClose={() => setDetailDrawerVisible(false)}
        >
          {selectedStrategy && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="基本信息" key="1">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="策略ID">
                    {selectedStrategy.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="策略类型">
                    <Tag
                      color={
                        typeMap[selectedStrategy.strategy_type]?.color
                      }
                    >
                      {typeMap[selectedStrategy.strategy_type]?.label}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Badge
                      status={statusMap[selectedStrategy.status]?.color as any}
                      text={statusMap[selectedStrategy.status]?.label}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="描述">
                    {selectedStrategy.description || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="参数">
                    <pre style={{ margin: 0, fontSize: '12px' }}>
                      {JSON.stringify(
                        selectedStrategy.config?.parameters ||
                          selectedStrategy.parameters ||
                          {},
                        null,
                        2
                      )}
                    </pre>
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {selectedStrategy.created_at
                      ? new Date(selectedStrategy.created_at).toLocaleString(
                          'zh-CN'
                        )
                      : '-'}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane
                tab={`回测历史 (${
                  getStrategyBacktests(selectedStrategy.id).length
                })`}
                key="2"
              >
                <Timeline>
                  {getStrategyBacktests(selectedStrategy.id).map((backtest) => (
                    <Timeline.Item
                      key={backtest.id}
                      color={
                        backtest.return_percent && backtest.return_percent > 0
                          ? 'green'
                          : 'red'
                      }
                    >
                      <div>
                        <Text strong>
                          {backtest.name || `回测 #${backtest.id}`}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                          <Space size="large">
                            <span>
                              收益率:{' '}
                              <Text
                                type={
                                  backtest.return_percent &&
                                  backtest.return_percent > 0
                                    ? 'danger'
                                    : 'success'
                                }
                                strong
                              >
                                {backtest.return_percent?.toFixed(2)}%
                              </Text>
                            </span>
                            <span>
                              夏普比率:{' '}
                              <Text strong>
                                {backtest.sharpe_ratio?.toFixed(2)}
                              </Text>
                            </span>
                            <span>
                              胜率:{' '}
                              <Text strong>
                                {backtest.win_rate?.toFixed(2)}%
                              </Text>
                            </span>
                          </Space>
                        </div>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: '12px',
                            display: 'block',
                            marginTop: 4,
                          }}
                        >
                          {backtest.start_date} ~ {backtest.end_date}
                        </Text>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </TabPane>
            </Tabs>
          )}
        </Drawer>

        {/* 创建策略模态框 */}
        <CreateStrategyModal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onSuccess={() => {
            setCreateModalVisible(false);
            loadData();
          }}
        />

        {/* 编辑策略模态框 */}
        {selectedStrategy && (
          <EditStrategyModal
            visible={editModalVisible}
            strategyId={selectedStrategy.id}
            onCancel={() => {
              setEditModalVisible(false);
              setSelectedStrategy(null);
            }}
            onSuccess={() => {
              setEditModalVisible(false);
              setSelectedStrategy(null);
              loadData();
            }}
          />
        )}
      </Spin>
    </PageContainer>
  );
};

export default StrategyList;
