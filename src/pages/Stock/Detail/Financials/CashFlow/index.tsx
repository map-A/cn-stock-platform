/**
 * 现金流量表页面
 * 展示公司现金流详细信息
 */

import { useState } from 'react';
import { Card, Select, Table, Tag, Space, Button, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useParams } from '@umijs/max';
import { Column } from '@ant-design/plots';
import type { ColumnsType } from 'antd/es/table';
import {
  getCashFlow,
  getCashFlowAnalysis,
  assessCashFlowQuality,
  calculateCashFlowTrend,
  exportCashFlowToCSV,
  type CashFlowData,
} from '@/services/financial/cashFlowService';

const { Option } = Select;

const CashFlowPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [period, setPeriod] = useState<'annual' | 'Q1' | 'Q2' | 'Q3'>('annual');
  
  const { data: cashFlowData, loading } = useRequest(
    () => getCashFlow(code!, { reportType: period }),
    {
      refreshDeps: [code, period],
      ready: !!code,
    },
  );
  
  const dataList = cashFlowData?.data || [];
  const latestData = dataList[0];
  const quality = latestData ? assessCashFlowQuality(latestData) : null;
  const trend = dataList.length > 0 ? calculateCashFlowTrend(dataList) : null;
  
  const columns: ColumnsType<CashFlowData> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      fixed: 'left',
      width: 120,
    },
    {
      title: '经营活动现金流',
      key: 'operatingCashFlow',
      width: 150,
      render: (_, record) => {
        const value = record.operating.netOperatingCashFlow / 100000000;
        return (
          <span style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
            {value.toFixed(2)}亿
          </span>
        );
      },
    },
    {
      title: '投资活动现金流',
      key: 'investingCashFlow',
      width: 150,
      render: (_, record) => {
        const value = record.investing.netInvestingCashFlow / 100000000;
        return (
          <span style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
            {value.toFixed(2)}亿
          </span>
        );
      },
    },
    {
      title: '筹资活动现金流',
      key: 'financingCashFlow',
      width: 150,
      render: (_, record) => {
        const value = record.financing.netFinancingCashFlow / 100000000;
        return (
          <span style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
            {value.toFixed(2)}亿
          </span>
        );
      },
    },
    {
      title: '现金净增加额',
      key: 'netCashFlow',
      width: 150,
      render: (_, record) => {
        const value = record.netCashFlow / 100000000;
        return (
          <span style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
            {value.toFixed(2)}亿
          </span>
        );
      },
    },
    {
      title: '自由现金流',
      key: 'freeCashFlow',
      width: 150,
      render: (_, record) => {
        const value = record.freeCashFlow / 100000000;
        return (
          <span style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
            {value.toFixed(2)}亿
          </span>
        );
      },
    },
  ];
  
  // 现金流瀑布图数据
  const waterfallData = latestData
    ? [
        { type: '经营活动', value: latestData.operating.netOperatingCashFlow / 100000000 },
        { type: '投资活动', value: latestData.investing.netInvestingCashFlow / 100000000 },
        { type: '筹资活动', value: latestData.financing.netFinancingCashFlow / 100000000 },
        { type: '现金净增加', value: latestData.netCashFlow / 100000000 },
      ]
    : [];
  
  const getQualityTag = (q: string) => {
    const config = {
      excellent: { color: 'success', text: '优秀' },
      good: { color: 'processing', text: '良好' },
      fair: { color: 'warning', text: '一般' },
      poor: { color: 'error', text: '较差' },
    };
    return config[q as keyof typeof config] || config.fair;
  };
  
  const getTrendIcon = (t: string) => {
    if (t === 'improving') return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    if (t === 'declining') return <ArrowDownOutlined style={{ color: '#f5222d' }} />;
    return null;
  };
  
  return (
    <div className="cash-flow-page">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="经营活动现金流"
              value={latestData ? latestData.operating.netOperatingCashFlow / 100000000 : 0}
              precision={2}
              suffix="亿"
              valueStyle={{ color: latestData && latestData.operating.netOperatingCashFlow >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="自由现金流"
              value={latestData ? latestData.freeCashFlow / 100000000 : 0}
              precision={2}
              suffix="亿"
              valueStyle={{ color: latestData && latestData.freeCashFlow >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>现金流质量</div>
            {quality && (
              <Tag color={getQualityTag(quality).color} style={{ fontSize: 16 }}>
                {getQualityTag(quality).text}
              </Tag>
            )}
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>现金流趋势</div>
            {trend && (
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                {getTrendIcon(trend.trend)} {trend.growth.toFixed(2)}%
              </div>
            )}
          </Card>
        </Col>
      </Row>
      
      <Card
        title="现金流量表"
        extra={
          <Space>
            <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
              <Option value="annual">年报</Option>
              <Option value="Q1">一季报</Option>
              <Option value="Q2">半年报</Option>
              <Option value="Q3">三季报</Option>
            </Select>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                const csv = exportCashFlowToCSV(dataList);
                const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${code}_现金流量表_${period}.csv`;
                link.click();
              }}
            >
              导出数据
            </Button>
          </Space>
        }
        loading={loading}
      >
        <Table
          columns={columns}
          dataSource={dataList}
          rowKey="date"
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Card title="现金流结构（最新期）" style={{ marginTop: 16 }}>
        <div style={{ height: 400 }}>
          <Column
            data={waterfallData}
            xField="type"
            yField="value"
            seriesField="type"
            color={({ type }) => {
              if (type === '经营活动') return '#52c41a';
              if (type === '投资活动') return '#1890ff';
              if (type === '筹资活动') return '#faad14';
              return '#f5222d';
            }}
            label={{
              position: 'top',
              formatter: ({ value }: any) => `${value.toFixed(2)}亿`,
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default CashFlowPage;
