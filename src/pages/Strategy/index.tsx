/**
 * AI策略管理主页面
 * 
 * 功能特性:
 * - 策略列表展示
 * - 策略创建和配置
 * - 回测结果查看
 * - 性能分析监控
 * - 策略执行管理
 */

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Drawer,
  Tabs,
  Row,
  Col,
  Statistic,
  Alert,
  Typography,
  Tooltip,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  BarChartOutlined,
  FileTextOutlined,
  DeleteOutlined,
  CopyOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { getStrategies, deleteStrategy } from '@/services/strategy';
import StrategyConfigForm from '@/components/Strategy/StrategyConfigForm';
import BacktestResults from '@/components/Strategy/BacktestResults';
import PerformanceAnalysis from '@/components/Strategy/PerformanceAnalysis';
import StrategyMonitor from '@/components/Strategy/StrategyMonitor';
import MultiFactorDisplay from '@/components/Strategy/MultiFactorDisplay';
import type { StrategyInfo, StrategyStatus, StrategyType } from '@/types/strategy';
import { useIntl } from '@umijs/max';
import './index.less';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const StrategyPage: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<StrategyInfo[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyInfo | null>(null);
  const [configVisible, setConfigVisible] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState<'config' | 'results' | 'analysis'>('config');

  /**
   * 策略状态映射
   */

  /**
   * 策略类型映射
   */
  const typeMap: Record<string, { color: string; text: string }> = {
    trend_following: { color: 'blue', text: '趋势跟踪' },
    mean_reversion: { color: 'green', text: '均值回归' },
    momentum: { color: 'orange', text: '动量策略' },
    arbitrage: { color: 'purple', text: '套利策略' },
    grid: { color: 'cyan', text: '网格策略' },
    scalping: { color: 'red', text: '剥头皮' },
    swing: { color: 'magenta', text: '摆动交易' },
    quantitative: { color: 'volcano', text: '量化策略' },
    ai_ml: { color: 'geekblue', text: 'AI/ML策略' },
    custom: { color: 'lime', text: '自定义' },
  };

  /**
   * 策略状态映射
   */
  const statusMap: Record<string, { color: string; text: string }> = {
    draft: { color: 'default', text: '草稿' },
    testing: { color: 'processing', text: '测试中' },
    active: { color: 'success', text: '运行中' },
    paused: { color: 'warning', text: '暂停' },
    disabled: { color: 'error', text: '已停用' },
    archived: { color: 'default', text: '已归档' },
  };

  /**
   * 加载策略列表
   */
  const loadStrategies = async () => {
    try {
      setLoading(true);
      const data = await getStrategies();
      setStrategies(data.items);
    } catch (error) {
      console.error('加载策略列表失败:', error);
      message.error('加载策略列表失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 创建新策略
   */
  const handleCreateStrategy = () => {
    setSelectedStrategy(null);
    setDrawerContent('config');
    setConfigVisible(true);
  };

  /**
   * 编辑策略配置
   */
  const handleEditStrategy = (strategy: StrategyInfo) => {
    setSelectedStrategy(strategy);
    setDrawerContent('config');
    setConfigVisible(true);
  };

  /**
   * 查看回测结果
   */
  const handleViewResults = (strategy: StrategyInfo) => {
    setSelectedStrategy(strategy);
    setDrawerContent('results');
    setResultsVisible(true);
  };

  /**
   * 查看性能分析
   */
  const handleViewAnalysis = (strategy: StrategyInfo) => {
    setSelectedStrategy(strategy);
    setDrawerContent('analysis');
    setAnalysisVisible(true);
  };

  /**
   * 删除策略
   */
  const handleDeleteStrategy = async (strategyId: string) => {
    try {
      await deleteStrategy(strategyId);
      message.success('策略删除成功');
      loadStrategies();
    } catch (error) {
      console.error('删除策略失败:', error);
      message.error('删除策略失败');
    }
  };

  /**
   * 克隆策略
   */
  const handleCloneStrategy = async (strategy: StrategyInfo) => {
    try {
      // 创建策略副本
      const newStrategy = {
        ...strategy,
        name: `${strategy.name} - 副本`,
        status: 'draft' as StrategyStatus,
      };
      
      // TODO: 实现克隆API后替换
      // await cloneStrategy(strategy.id, `${strategy.name} - 副本`);
      message.success('策略克隆功能开发中...');
      message.success('策略克隆成功');
      loadStrategies();
    } catch (error) {
      console.error('克隆策略失败:', error);
      message.error('克隆策略失败');
    }
  };

  /**
   * 关闭抽屉
   */
  const handleCloseDrawer = () => {
    setConfigVisible(false);
    setResultsVisible(false);
    setAnalysisVisible(false);
    setSelectedStrategy(null);
  };

  /**
   * 策略保存成功回调
   */
  const handleStrategySaved = () => {
    handleCloseDrawer();
    loadStrategies();
  };

  /**
   * 表格列配置
   */
  const columns = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: StrategyInfo) => (
        <Space>
          <Text strong>{name}</Text>
          <Tag color={typeMap[record.type]?.color}>
            {typeMap[record.type]?.text}
          </Tag>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: StrategyStatus) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text}
        </Tag>
      ),
    },
    {
      title: '总收益率',
      dataIndex: 'performance',
      key: 'totalReturn',
      render: (performance: any) => {
        const totalReturn = performance?.totalReturn || 0;
        return (
          <Text type={totalReturn >= 0 ? 'success' : 'danger'}>
            {totalReturn >= 0 ? '+' : ''}{(totalReturn * 100).toFixed(2)}%
          </Text>
        );
      },
    },
    {
      title: '夏普比率',
      dataIndex: 'performance',
      key: 'sharpeRatio',
      render: (performance: any) => {
        const sharpeRatio = performance?.sharpeRatio || 0;
        return (
          <Text type={sharpeRatio >= 1 ? 'success' : sharpeRatio >= 0 ? 'warning' : 'danger'}>
            {sharpeRatio.toFixed(3)}
          </Text>
        );
      },
    },
    {
      title: '最大回撤',
      dataIndex: 'performance',
      key: 'maxDrawdown',
      render: (performance: any) => {
        const maxDrawdown = Math.abs(performance?.maxDrawdown || 0);
        return (
          <Text type="danger">
            -{(maxDrawdown * 100).toFixed(2)}%
          </Text>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => new Date(time).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: StrategyInfo) => (
        <Space>
          <Tooltip title="编辑配置">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => handleEditStrategy(record)}
            />
          </Tooltip>
          
          <Tooltip title="查看回测">
            <Button
              type="text"
              icon={<FileTextOutlined />}
              onClick={() => handleViewResults(record)}
            />
          </Tooltip>
          
          <Tooltip title="性能分析">
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => handleViewAnalysis(record)}
            />
          </Tooltip>
          
          <Tooltip title="克隆策略">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCloneStrategy(record)}
            />
          </Tooltip>
          
          <Popconfirm
            title="确定删除此策略吗？"
            onConfirm={() => handleDeleteStrategy(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除策略">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /**
   * 计算统计数据
   */
  const statistics = React.useMemo(() => {
    const totalStrategies = strategies.length;
    const runningStrategies = strategies.filter(s => s.status === 'active').length;
    const totalReturn = strategies.reduce((sum, s) => sum + (s.performance?.totalReturn || 0), 0);
    const avgSharpe = strategies.length ? 
      strategies.reduce((sum, s) => sum + (s.performance?.sharpeRatio || 0), 0) / strategies.length : 0;

    return {
      totalStrategies,
      runningStrategies,
      totalReturn: totalReturn / strategies.length || 0,
      avgSharpe,
    };
  }, [strategies]);

  /**
   * 初始化
   */
  useEffect(() => {
    loadStrategies();
  }, []);

  return (
    <PageContainer
      title="AI策略管理"
      subTitle="智能量化交易策略管理平台"
      extra={[
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateStrategy}
        >
          创建策略
        </Button>,
      ]}
    >
      <Layout className="strategy-page">
        <Content>
          {/* 概览统计 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="总策略数"
                  value={statistics.totalStrategies}
                  prefix={<ExperimentOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="运行中"
                  value={statistics.runningStrategies}
                  prefix={<PlayCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="平均收益率"
                  value={statistics.totalReturn * 100}
                  precision={2}
                  suffix="%"
                  valueStyle={{ 
                    color: statistics.totalReturn >= 0 ? '#52c41a' : '#ff4d4f' 
                  }}
                />
              </Card>
            </Col>
            
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="平均夏普比率"
                  value={statistics.avgSharpe}
                  precision={3}
                  valueStyle={{ 
                    color: statistics.avgSharpe >= 1 ? '#52c41a' : '#722ed1' 
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* 策略列表 */}
          <Card>
            <Table
              dataSource={strategies}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个策略`,
              }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </Content>
      </Layout>

      {/* 策略配置抽屉 */}
      <Drawer
        title={selectedStrategy ? '编辑策略配置' : '创建新策略'}
        width={800}
        open={configVisible}
        onClose={handleCloseDrawer}
        destroyOnClose
      >
        {configVisible && (
          <StrategyConfigForm
            strategyId={selectedStrategy?.id || ''}
            strategyType={selectedStrategy?.type || 'trend_following'}
            configId={selectedStrategy?.configId}
            onSave={handleStrategySaved}
            onCancel={handleCloseDrawer}
          />
        )}
      </Drawer>

      {/* 回测结果抽屉 */}
      <Drawer
        title="回测结果"
        width={1200}
        open={resultsVisible}
        onClose={handleCloseDrawer}
        destroyOnClose
      >
        {resultsVisible && selectedStrategy && (
          <BacktestResults
            backtestId={selectedStrategy.lastBacktestId || ''}
            strategyId={selectedStrategy.id}
          />
        )}
      </Drawer>

      {/* 性能分析抽屉 */}
      <Drawer
        title="性能分析"
        width={1200}
        open={analysisVisible}
        onClose={handleCloseDrawer}
        destroyOnClose
      >
        {analysisVisible && selectedStrategy && (
          <PerformanceAnalysis
            strategyId={selectedStrategy.id}
            compareStrategies={[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default StrategyPage;