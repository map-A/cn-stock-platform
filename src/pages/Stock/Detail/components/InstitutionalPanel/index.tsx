import React, { useEffect, useState } from 'react';
import { Card, Table, Tabs, Tag, Progress, Row, Col, Statistic, Empty } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getInstitutionalHoldings,
  getQFIIHoldings,
  getInstitutionalTrend,
} from '@/services/insider/institutionalService';
import { formatNumber, formatPercent, formatCurrency } from '@/utils/format';
import styles from './index.less';

interface InstitutionalHolding {
  id: string;
  reportDate: string;
  institutionName: string;
  institutionType: string;
  shares: number;
  marketValue: number;
  holdingRatio: number;
  changeRatio?: number;
  changeShares?: number;
}

interface InstitutionalPanelProps {
  stockCode: string;
}

const InstitutionalPanel: React.FC<InstitutionalPanelProps> = ({ stockCode }) => {
  const [loading, setLoading] = useState(false);
  const [fundHoldings, setFundHoldings] = useState<InstitutionalHolding[]>([]);
  const [qfiiHoldings, setQFIIHoldings] = useState<InstitutionalHolding[]>([]);
  const [trendData, setTrendData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('fund');

  useEffect(() => {
    loadData();
  }, [stockCode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fundRes, qfiiRes, trendRes] = await Promise.all([
        getInstitutionalHoldings({ stockCode, type: 'fund' }),
        getQFIIHoldings(stockCode),
        getInstitutionalTrend(stockCode),
      ]);

      if (fundRes.success) {
        setFundHoldings(fundRes.data || []);
      }
      if (qfiiRes.success) {
        setQFIIHoldings(qfiiRes.data || []);
      }
      if (trendRes.success) {
        setTrendData(trendRes.data);
      }
    } catch (error) {
      console.error('加载机构持仓数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInstitutionTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      fund: { color: 'blue', text: '公募基金' },
      social_security: { color: 'green', text: '社保基金' },
      insurance: { color: 'orange', text: '保险资金' },
      qfii: { color: 'purple', text: 'QFII' },
      private_equity: { color: 'cyan', text: '私募基金' },
    };
    const config = typeMap[type] || { color: 'default', text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const renderChangeTag = (changeRatio?: number, changeShares?: number) => {
    if (changeRatio === undefined || changeShares === undefined) return '-';
    
    const isIncrease = changeShares > 0;
    const icon = isIncrease ? <RiseOutlined /> : <FallOutlined />;
    const color = isIncrease ? '#3f8600' : '#cf1322';
    
    return (
      <span style={{ color }}>
        {icon} {formatPercent(Math.abs(changeRatio))} ({formatNumber(Math.abs(changeShares))})
      </span>
    );
  };

  const columns: ColumnsType<InstitutionalHolding> = [
    {
      title: '报告期',
      dataIndex: 'reportDate',
      key: 'reportDate',
      width: 120,
    },
    {
      title: '机构名称',
      dataIndex: 'institutionName',
      key: 'institutionName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '机构类型',
      dataIndex: 'institutionType',
      key: 'institutionType',
      width: 120,
      render: (type: string) => getInstitutionTypeTag(type),
    },
    {
      title: '持股数量',
      dataIndex: 'shares',
      key: 'shares',
      width: 120,
      align: 'right',
      render: (shares: number) => formatNumber(shares),
      sorter: (a, b) => a.shares - b.shares,
    },
    {
      title: '持股市值',
      dataIndex: 'marketValue',
      key: 'marketValue',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value),
      sorter: (a, b) => a.marketValue - b.marketValue,
    },
    {
      title: '持股比例',
      dataIndex: 'holdingRatio',
      key: 'holdingRatio',
      width: 120,
      align: 'right',
      render: (ratio: number) => (
        <div>
          <div>{formatPercent(ratio)}</div>
          <Progress
            percent={ratio}
            showInfo={false}
            size="small"
            strokeColor="#1890ff"
          />
        </div>
      ),
      sorter: (a, b) => a.holdingRatio - b.holdingRatio,
    },
    {
      title: '较上期变动',
      key: 'change',
      width: 180,
      render: (_, record) => renderChangeTag(record.changeRatio, record.changeShares),
    },
  ];

  const tabItems = [
    {
      key: 'fund',
      label: '公募基金',
      children: (
        <Table
          loading={loading}
          dataSource={fundHoldings}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 家机构`,
          }}
          locale={{
            emptyText: <Empty description="暂无基金持仓数据" />,
          }}
        />
      ),
    },
    {
      key: 'qfii',
      label: 'QFII/RQFII',
      children: (
        <Table
          loading={loading}
          dataSource={qfiiHoldings}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 家机构`,
          }}
          locale={{
            emptyText: <Empty description="暂无QFII持仓数据" />,
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles.institutionalPanel}>
      {trendData && (
        <Row gutter={16} className={styles.statsRow}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="机构持股比例"
                value={trendData.totalHoldingRatio}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="机构数量"
                value={trendData.institutionCount}
                suffix="家"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="较上季度变化"
                value={trendData.changeRatio}
                precision={2}
                suffix="%"
                valueStyle={{
                  color: trendData.changeRatio > 0 ? '#3f8600' : '#cf1322',
                }}
                prefix={trendData.changeRatio > 0 ? <RiseOutlined /> : <FallOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="持股市值"
                value={trendData.totalMarketValue}
                precision={2}
                suffix="亿"
                prefix="¥"
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default InstitutionalPanel;
