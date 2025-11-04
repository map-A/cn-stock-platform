/**
 * 回测系统主页面 - 重构版
 * 参考 Strategy 页面设计风格
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Row,
  Col,
  Typography,
  message,
  Empty,
  Spin,
  Progress,
  Input,
  Select,
  Segmented,
  Drawer,
  Descriptions,
  Badge,
} from 'antd';
import {
  PlayCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  DownloadOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { getBacktestHistory, deleteBacktest, type BacktestRecord } from '@/services/backtestService';
import { getStrategies } from '@/services/strategy';
import BacktestConfig from '@/components/Backtest/BacktestConfig';
import BacktestResults from '@/components/Backtest/BacktestResults';
import BacktestReport from '@/components/Backtest/BacktestReport';
import BacktestCard from '@/components/Backtest/BacktestCard';
import BacktestStats from '@/components/Backtest/BacktestStats';
import './index.less';

type BacktestStatus = BacktestRecord['status'];

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const BacktestPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [backtests, setBacktests] = useState<BacktestRecord[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [filteredBacktests, setFilteredBacktests] = useState<BacktestRecord[]>([]);
  const [selectedBacktest, setSelectedBacktest] = useState<BacktestRecord | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStrategy, setFilterStrategy] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);

  // 状态颜色映射
  const statusMap: Record<BacktestStatus, { color: string; label: string; status?: any }> = {
    pending: { color: 'default', label: '等待中', status: 'default' },
    running: { color: 'processing', label: '运行中', status: 'processing' },
    completed: { color: 'success', label: '已完成', status: 'success' },
    failed: { color: 'error', label: '失败', status: 'error' },
    cancelled: { color: 'warning', label: '已取消', status: 'warning' },
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBacktests();
  }, [backtests, searchKeyword, filterStatus, filterStrategy]);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [backtestData, strategyData] = await Promise.all([
        getBacktestHistory(),
        getStrategies(),
      ]);
      
      console.log('Backtest data:', backtestData);
      console.log('Strategy data:', strategyData);
      
      setBacktests(backtestData.items || []);
      setStrategies(strategyData.items || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 过滤回测记录
  const filterBacktests = () => {
    let filtered = [...backtests];

    if (searchKeyword) {
      filtered = filtered.filter(
        (b) =>
          b.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          String(b.strategy_id).includes(searchKeyword) ||
          String(b.id).includes(searchKeyword)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    if (filterStrategy !== 'all') {
      filtered = filtered.filter((b) => String(b.strategy_id) === filterStrategy);
    }

    setFilteredBacktests(filtered);
  };

  // 计算统计数据
  const stats = {
    total: backtests.length,
    completed: backtests.filter((b) => b.status === 'completed').length,
    running: backtests.filter((b) => b.status === 'running').length,
    failed: backtests.filter((b) => b.status === 'failed').length,
    avgReturn:
      backtests.filter((b) => b.status === 'completed').length > 0
        ? (
            backtests
              .filter((b) => b.status === 'completed')
              .reduce((sum, b) => sum + (b.return_percent || b.totalReturn || 0), 0) /
            backtests.filter((b) => b.status === 'completed').length
          ).toFixed(2)
        : '0',
    avgSharpe:
      backtests.filter((b) => b.status === 'completed').length > 0
        ? (
            backtests
              .filter((b) => b.status === 'completed')
              .reduce((sum, b) => sum + (b.sharpe_ratio || b.sharpeRatio || 0), 0) /
            backtests.filter((b) => b.status === 'completed').length
          ).toFixed(2)
        : '0',
    totalTrades: backtests.reduce((sum, b) => sum + (b as any).total_trades || 0, 0),
    successRate:
      backtests.length > 0
        ? ((backtests.filter((b) => b.status === 'completed').length / backtests.length) * 100).toFixed(1)
        : '0',
  };

  // 获取策略名称
  const getStrategyName = (strategyId: string | number) => {
    const strategy = strategies.find((s) => String(s.id) === String(strategyId));
    return strategy?.name || `策略 #${strategyId}`;
  };

  // 删除回测记录
  const handleDelete = async (backtestId: string | number) => {
    try {
      await deleteBacktest(String(backtestId));
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 查看回测详情
  const showBacktestDetail = (backtest: BacktestRecord) => {
    setSelectedBacktest(backtest);
    setDetailDrawerVisible(true);
  };

  // 查看回测结果
  const handleViewResults = (record: BacktestRecord) => {
    setSelectedBacktest(record);
    setResultsModalVisible(true);
  };

  // 生成回测报告
  const handleGenerateReport = (record: BacktestRecord) => {
    setSelectedBacktest(record);
    setReportModalVisible(true);
  };

  // 回测列表表格配置
  const tableColumns = [
    {
      title: '回测名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: BacktestRecord) => (
        <div>
          <Text strong>{name || `回测 #${record.id}`}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {getStrategyName(record.strategy_id)}
          </Text>
        </div>
      ),
    },
    {
      title: '时间范围',
      key: 'period',
      width: 180,
      render: (record: BacktestRecord) => (
        <div>
          <div>{record.start_date || record.startDate}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            至 {record.end_date || record.endDate}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: BacktestStatus, record: BacktestRecord) => {
        const info = statusMap[status] || statusMap.pending;
        return (
          <div>
            <Badge status={info.status} text={info.label} />
            {status === 'running' && record.progress !== undefined && (
              <Progress
                percent={record.progress}
                size="small"
                showInfo={false}
                style={{ marginTop: 4 }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: '总收益率',
      key: 'return',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: BacktestRecord) => {
        const returnValue = record.return_percent || record.totalReturn;
        return returnValue !== undefined ? (
          <Text
            style={{
              color: returnValue >= 0 ? '#52c41a' : '#f5222d',
              fontWeight: 'bold',
            }}
          >
            {returnValue.toFixed(2)}%
          </Text>
        ) : (
          '--'
        );
      },
    },
    {
      title: '夏普比率',
      key: 'sharpe',
      width: 100,
      align: 'right' as const,
      render: (_: any, record: BacktestRecord) => {
        const sharpe = record.sharpe_ratio || record.sharpeRatio;
        return sharpe !== undefined ? (
          <Text
            style={{
              color: sharpe > 1 ? '#52c41a' : sharpe > 0 ? '#faad14' : '#f5222d',
            }}
          >
            {sharpe.toFixed(2)}
          </Text>
        ) : (
          '--'
        );
      },
    },
    {
      title: '胜率',
      key: 'winRate',
      width: 100,
      align: 'right' as const,
      render: (_: any, record: BacktestRecord) =>
        record.win_rate ? `${record.win_rate.toFixed(1)}%` : '--',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (date: string) =>
        date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: BacktestRecord) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showBacktestDetail(record)}
          >
            详情
          </Button>
          {record.status === 'completed' && (
            <Button
              type="link"
              size="small"
              icon={<LineChartOutlined />}
              onClick={() => handleViewResults(record)}
            >
              结果
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="回测管理"
      extra={[
        <Button key="reload" icon={<ReloadOutlined />} onClick={loadData}>
          刷新
        </Button>,
        <Button
          key="new"
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={() => setConfigModalVisible(true)}
        >
          新建回测
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {/* 统计面板 */}
        <BacktestStats
          total={stats.total}
          completed={stats.completed}
          running={stats.running}
          failed={stats.failed}
          avgReturn={stats.avgReturn}
          avgSharpe={stats.avgSharpe}
          totalTrades={stats.totalTrades}
          successRate={stats.successRate}
        />

        {/* 筛选和搜索 */}
        <Card style={{ marginBottom: 16, marginTop: 16 }}>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索回测名称或ID"
                allowClear
                enterButton={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
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
            <Col xs={12} sm={6} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="策略"
                value={filterStrategy}
                onChange={setFilterStrategy}
              >
                <Option value="all">全部策略</Option>
                {strategies.map((strategy) => (
                  <Option key={strategy.id} value={String(strategy.id)}>
                    {strategy.name}
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

        {/* 回测展示 */}
        {viewMode === 'card' ? (
          // 卡片视图
          <Row gutter={[16, 16]}>
            {filteredBacktests.length > 0 ? (
              filteredBacktests.map((backtest) => (
                <Col key={backtest.id} xs={24} sm={12} lg={8} xl={6}>
                  <BacktestCard
                    backtest={backtest}
                    strategyName={getStrategyName(backtest.strategy_id)}
                    onView={() => showBacktestDetail(backtest)}
                    onDelete={() => handleDelete(backtest.id)}
                    onExport={() => handleGenerateReport(backtest)}
                  />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Card>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无回测数据"
                  >
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => setConfigModalVisible(true)}
                    >
                      创建第一个回测
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
              dataSource={filteredBacktests}
              rowKey="id"
              scroll={{ x: 1200 }}
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
                    description="暂无回测数据"
                  />
                ),
              }}
            />
          </Card>
        )}

        {/* 回测详情抽屉 */}
        <Drawer
          title={
            <Space>
              <span>{selectedBacktest?.name || `回测 #${selectedBacktest?.id}`}</span>
              <Badge
                status={statusMap[selectedBacktest?.status || 'pending']?.status}
                text={statusMap[selectedBacktest?.status || 'pending']?.label}
              />
            </Space>
          }
          width={720}
          open={detailDrawerVisible}
          onClose={() => setDetailDrawerVisible(false)}
        >
          {selectedBacktest && (
            <>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="回测ID">{selectedBacktest.id}</Descriptions.Item>
                <Descriptions.Item label="关联策略">
                  {getStrategyName(selectedBacktest.strategy_id)}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Badge
                    status={statusMap[selectedBacktest.status]?.status}
                    text={statusMap[selectedBacktest.status]?.label}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="时间范围">
                  {selectedBacktest.start_date || selectedBacktest.startDate} ~{' '}
                  {selectedBacktest.end_date || selectedBacktest.endDate}
                </Descriptions.Item>
                <Descriptions.Item label="初始资金">
                  ¥{selectedBacktest.initial_capital?.toLocaleString()}
                </Descriptions.Item>
                {selectedBacktest.status === 'completed' && (
                  <>
                    <Descriptions.Item label="最终资金">
                      ¥{selectedBacktest.final_capital?.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="总收益率">
                      <Text
                        strong
                        style={{
                          color:
                            (selectedBacktest.return_percent || 0) >= 0 ? '#52c41a' : '#f5222d',
                        }}
                      >
                        {selectedBacktest.return_percent?.toFixed(2)}%
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="夏普比率">
                      {selectedBacktest.sharpe_ratio?.toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="胜率">
                      {selectedBacktest.win_rate?.toFixed(2)}%
                    </Descriptions.Item>
                    <Descriptions.Item label="最大回撤">
                      <Text style={{ color: '#f5222d' }}>
                        {selectedBacktest.max_drawdown?.toFixed(2)}%
                      </Text>
                    </Descriptions.Item>
                  </>
                )}
                <Descriptions.Item label="创建时间">
                  {selectedBacktest.created_at
                    ? new Date(selectedBacktest.created_at).toLocaleString('zh-CN')
                    : '-'}
                </Descriptions.Item>
              </Descriptions>

              {selectedBacktest.status === 'completed' && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<LineChartOutlined />}
                      onClick={() => handleViewResults(selectedBacktest)}
                    >
                      查看详细结果
                    </Button>
                    <Button
                      icon={<FileTextOutlined />}
                      onClick={() => handleGenerateReport(selectedBacktest)}
                    >
                      生成报告
                    </Button>
                  </Space>
                </div>
              )}
            </>
          )}
        </Drawer>

        {/* 回测配置模态框 */}
        <Modal
          title="新建回测"
          open={configModalVisible}
          onCancel={() => setConfigModalVisible(false)}
          footer={null}
          width={800}
          destroyOnClose
        >
          <BacktestConfig
            onSubmit={() => {
              setConfigModalVisible(false);
              loadData();
            }}
            onCancel={() => setConfigModalVisible(false)}
          />
        </Modal>

        {/* 回测结果模态框 */}
        <Modal
          title="回测结果"
          open={resultsModalVisible}
          onCancel={() => setResultsModalVisible(false)}
          footer={null}
          width={1200}
          destroyOnClose
        >
          {selectedBacktest && (
            <BacktestResults backtestId={String(selectedBacktest.id)} />
          )}
        </Modal>

        {/* 回测报告模态框 */}
        <Modal
          title="回测报告"
          open={reportModalVisible}
          onCancel={() => setReportModalVisible(false)}
          footer={null}
          width={1000}
          destroyOnClose
        >
          {selectedBacktest && (
            <BacktestReport backtestId={String(selectedBacktest.id)} />
          )}
        </Modal>
      </Spin>
    </PageContainer>
  );
};

export default BacktestPage;