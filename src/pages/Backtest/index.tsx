/**
 * 回测系统主页面
 * 
 * 功能特性:
 * - 回测配置界面
 * - 回测历史记录
 * - 回测结果可视化
 * - 绩效指标分析
 * - 回测报告生成
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
  Tabs,
  Row,
  Col,
  Statistic,
  Typography,
  message,
  Empty,
  Spin,
  Progress,
} from 'antd';
import {
  PlayCircleOutlined,
  HistoryOutlined,
  BarChartOutlined,
  FileTextOutlined,
  DownloadOutlined,
  SettingOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { getBacktestHistory, deleteBacktest } from '@/services/backtest';
import BacktestConfig from '@/components/Backtest/BacktestConfig';
import BacktestResults from '@/components/Backtest/BacktestResults';
import BacktestReport from '@/components/Backtest/BacktestReport';
import type { BacktestRecord, BacktestStatus } from '@/types/backtest';
import { formatDateTime, formatPercent, formatCurrency } from '@/utils/format';
import './index.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const BacktestPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [backtests, setBacktests] = useState<BacktestRecord[]>([]);
  const [selectedBacktest, setSelectedBacktest] = useState<BacktestRecord | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // 状态颜色映射
  const statusMap: Record<BacktestStatus, { color: string; text: string }> = {
    pending: { color: 'processing', text: '等待执行' },
    running: { color: 'processing', text: '运行中' },
    completed: { color: 'success', text: '已完成' },
    failed: { color: 'error', text: '执行失败' },
    cancelled: { color: 'default', text: '已取消' },
  };

  // 加载回测历史
  const loadBacktests = async () => {
    try {
      setLoading(true);
      const data = await getBacktestHistory();
      setBacktests(data.items);
    } catch (error) {
      message.error('加载回测历史失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBacktests();
  }, []);

  // 删除回测记录
  const handleDelete = async (backtestId: string) => {
    try {
      await deleteBacktest(backtestId);
      message.success('删除成功');
      loadBacktests();
    } catch (error) {
      message.error('删除失败');
    }
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
  const columns = [
    {
      title: '回测名称',
      dataIndex: 'name',
      key: 'name',
      resizable: true,
      ellipsis: true,
      render: (name: string, record: BacktestRecord) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.strategyName}
          </Text>
        </div>
      ),
    },
    {
      title: '时间范围',
      key: 'period',
      width: 180,
      resizable: true,
      render: (record: BacktestRecord) => (
        <div>
          <div>{record.startDate}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            至 {record.endDate}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      resizable: true,
      render: (status: BacktestStatus, record: BacktestRecord) => (
        <div>
          <Tag color={statusMap[status].color}>
            {statusMap[status].text}
          </Tag>
          {status === 'running' && record.progress !== undefined && (
            <Progress
              percent={record.progress}
              size="small"
              showInfo={false}
              style={{ marginTop: 4 }}
            />
          )}
        </div>
      ),
    },
    {
      title: '总收益率',
      dataIndex: 'totalReturn',
      key: 'totalReturn',
      width: 120,
      resizable: true,
      render: (totalReturn: number) => (
        <Text
          style={{
            color: totalReturn >= 0 ? '#3f8600' : '#cf1322',
            fontWeight: 'bold',
          }}
        >
          {totalReturn ? formatPercent(totalReturn) : '--'}
        </Text>
      ),
    },
    {
      title: '最大回撤',
      dataIndex: 'maxDrawdown',
      key: 'maxDrawdown',
      width: 120,
      resizable: true,
      render: (maxDrawdown: number) => (
        <Text style={{ color: '#cf1322' }}>
          {maxDrawdown ? formatPercent(Math.abs(maxDrawdown)) : '--'}
        </Text>
      ),
    },
    {
      title: '夏普比率',
      dataIndex: 'sharpeRatio',
      key: 'sharpeRatio',
      width: 100,
      resizable: true,
      render: (sharpeRatio: number) => (
        <Text
          style={{
            color: sharpeRatio > 1 ? '#3f8600' : sharpeRatio > 0 ? '#fa8c16' : '#cf1322',
          }}
        >
          {sharpeRatio ? sharpeRatio.toFixed(2) : '--'}
        </Text>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      resizable: true,
      render: (createdAt: string) => formatDateTime(createdAt),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: BacktestRecord) => (
        <Space>
          {record.status === 'completed' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewResults(record)}
              >
                查看结果
              </Button>
              <Button
                type="link"
                size="small"
                icon={<FileTextOutlined />}
                onClick={() => handleGenerateReport(record)}
              >
                报告
              </Button>
            </>
          )}
          {record.status === 'running' && (
            <Button type="link" size="small" disabled>
              执行中...
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 统计信息
  const getStats = () => {
    const totalBacktests = backtests.length;
    const completedBacktests = backtests.filter(b => b.status === 'completed').length;
    const runningBacktests = backtests.filter(b => b.status === 'running').length;
    const avgReturn = completedBacktests > 0 ? 
      backtests
        .filter(b => b.status === 'completed' && b.totalReturn !== undefined)
        .reduce((sum, b) => sum + (b.totalReturn || 0), 0) / completedBacktests
      : 0;

    return {
      totalBacktests,
      completedBacktests,
      runningBacktests,
      avgReturn,
    };
  };

  const stats = getStats();

  return (
    <PageContainer
      title="回测系统"
      subTitle="策略回测分析与结果管理"
      extra={[
        <Button
          key="new"
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={() => setConfigModalVisible(true)}
        >
          新建回测
        </Button>
      ]}
    >
      <Row gutter={[16, 16]}>
        {/* 统计概览 */}
        <Col span={24}>
          <Card title="回测概览" size="small">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="总回测数"
                  value={stats.totalBacktests}
                  prefix={<HistoryOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="已完成"
                  value={stats.completedBacktests}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="运行中"
                  value={stats.runningBacktests}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="平均收益率"
                  value={stats.avgReturn}
                  precision={2}
                  suffix="%"
                  valueStyle={{
                    color: stats.avgReturn >= 0 ? '#3f8600' : '#cf1322',
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 回测列表 */}
        <Col span={24}>
          <Card title="回测历史" size="small">
            <Table
              columns={columns}
              dataSource={backtests}
              rowKey="id"
              loading={loading}
              scroll={{ x: 'max-content' }}
              bordered
              size="small"
              pagination={{
                total: backtests.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 回测配置模态框 */}
      <Modal
        title="新建回测"
        visible={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <BacktestConfig
          onSubmit={() => {
            setConfigModalVisible(false);
            loadBacktests();
          }}
          onCancel={() => setConfigModalVisible(false)}
        />
      </Modal>

      {/* 回测结果模态框 */}
      <Modal
        title="回测结果"
        visible={resultsModalVisible}
        onCancel={() => setResultsModalVisible(false)}
        footer={null}
        width={1200}
        destroyOnClose
      >
        {selectedBacktest && (
          <BacktestResults backtestId={selectedBacktest.id} />
        )}
      </Modal>

      {/* 回测报告模态框 */}
      <Modal
        title="回测报告"
        visible={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        {selectedBacktest && (
          <BacktestReport backtestId={selectedBacktest.id} />
        )}
      </Modal>
    </PageContainer>
  );
};

export default BacktestPage;