/**
 * 资金流向页面
 */
import React from 'react';
import { Card, Row, Col, Statistic, Table, Tabs, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getCapitalFlow, getIndustryFlow } from '@/services/market';
import { formatAmount } from '@/utils/format';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import styles from './index.less';

const { Text, Title } = Typography;

const CapitalFlow: React.FC = () => {
  // 获取整体资金流向
  const { data: flowData, loading: flowLoading } = useRequest(
    () => getCapitalFlow(),
    {
      pollingInterval: 10000, // 10秒刷新
    }
  );

  // 获取行业资金流向
  const { data: industryData, loading: industryLoading } = useRequest(
    () => getIndustryFlow(),
    {
      pollingInterval: 30000, // 30秒刷新
    }
  );

  const industryColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 80,
    },
    {
      title: '行业名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      width: 120,
      align: 'right' as const,
      render: (percent: number) => (
        <Text style={{ color: percent >= 0 ? '#f5222d' : '#52c41a' }}>
          {percent >= 0 ? '+' : ''}{percent.toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '主力净流入',
      dataIndex: 'mainNetInflow',
      width: 150,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.mainNetInflow - b.mainNetInflow,
      render: (amount: number) => (
        <Text style={{ color: amount >= 0 ? '#f5222d' : '#52c41a' }}>
          {amount >= 0 ? '+' : ''}{formatAmount(amount)}
        </Text>
      ),
    },
    {
      title: '超大单',
      dataIndex: 'superLargeNetInflow',
      width: 150,
      align: 'right' as const,
      render: (amount: number) => (
        <Text style={{ color: amount >= 0 ? '#f5222d' : '#52c41a' }}>
          {amount >= 0 ? '+' : ''}{formatAmount(amount)}
        </Text>
      ),
    },
    {
      title: '大单',
      dataIndex: 'largeNetInflow',
      width: 150,
      align: 'right' as const,
      render: (amount: number) => (
        <Text style={{ color: amount >= 0 ? '#f5222d' : '#52c41a' }}>
          {amount >= 0 ? '+' : ''}{formatAmount(amount)}
        </Text>
      ),
    },
    {
      title: '中单',
      dataIndex: 'mediumNetInflow',
      width: 150,
      align: 'right' as const,
      render: (amount: number) => (
        <Text style={{ color: amount >= 0 ? '#f5222d' : '#52c41a' }}>
          {amount >= 0 ? '+' : ''}{formatAmount(amount)}
        </Text>
      ),
    },
    {
      title: '小单',
      dataIndex: 'smallNetInflow',
      width: 150,
      align: 'right' as const,
      render: (amount: number) => (
        <Text style={{ color: amount >= 0 ? '#f5222d' : '#52c41a' }}>
          {amount >= 0 ? '+' : ''}{formatAmount(amount)}
        </Text>
      ),
    },
  ];

  if (flowLoading && !flowData) {
    return <LoadingSpinner fullscreen tip="加载资金流向数据..." />;
  }

  return (
    <div className={styles.capitalFlow}>
      {/* 整体资金流向 */}
      <Card title={<Title level={4}>今日资金流向</Title>} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="主力净流入"
                value={flowData?.mainNetInflow || 0}
                precision={2}
                valueStyle={{
                  color: (flowData?.mainNetInflow || 0) >= 0 ? '#f5222d' : '#52c41a',
                }}
                prefix={(flowData?.mainNetInflow || 0) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="亿"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="超大单"
                value={flowData?.superLargeNetInflow || 0}
                precision={2}
                valueStyle={{
                  color: (flowData?.superLargeNetInflow || 0) >= 0 ? '#f5222d' : '#52c41a',
                }}
                suffix="亿"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="大单"
                value={flowData?.largeNetInflow || 0}
                precision={2}
                valueStyle={{
                  color: (flowData?.largeNetInflow || 0) >= 0 ? '#f5222d' : '#52c41a',
                }}
                suffix="亿"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="中单"
                value={flowData?.mediumNetInflow || 0}
                precision={2}
                valueStyle={{
                  color: (flowData?.mediumNetInflow || 0) >= 0 ? '#f5222d' : '#52c41a',
                }}
                suffix="亿"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 行业资金流向 */}
      <Card title={<Title level={4}>行业资金流向</Title>}>
        <Table
          dataSource={industryData}
          columns={industryColumns}
          loading={industryLoading}
          rowKey="name"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个行业`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default CapitalFlow;
