/**
 * 资产负债表页面
 * 展示公司资产负债详细信息
 */

import { useState } from 'react';
import { Card, Select, Table, Tabs, Space, Button, message } from 'antd';
import { DownloadOutlined, BarChartOutlined, TableOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useParams } from '@umijs/max';
import { Line } from '@ant-design/plots';
import type { ColumnsType } from 'antd/es/table';
import {
  getBalanceSheet,
  exportBalanceSheetToCSV,
  calculateAssetLiabilityRatio,
  calculateCurrentRatio,
  calculateQuickRatio,
  type BalanceSheetData,
} from '@/services/financial/balanceSheetService';

const { Option } = Select;

const BalanceSheetPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [period, setPeriod] = useState<'annual' | 'Q1' | 'Q2' | 'Q3'>('annual');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  
  // 获取资产负债表数据
  const { data: balanceSheetData, loading } = useRequest(
    () => getBalanceSheet(code!, { reportType: period }),
    {
      refreshDeps: [code, period],
      ready: !!code,
    },
  );
  
  const dataList = balanceSheetData?.data || [];
  
  // 导出数据
  const handleExport = () => {
    if (dataList.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }
    
    const csv = exportBalanceSheetToCSV(dataList);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${code}_资产负债表_${period}.csv`;
    link.click();
    message.success('导出成功');
  };
  
  // 表格列定义
  const columns: ColumnsType<BalanceSheetData> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      fixed: 'left',
      width: 120,
    },
    {
      title: '报告期',
      dataIndex: 'reportType',
      key: 'reportType',
      width: 100,
      render: (type) => {
        const labels = { Q1: '一季报', Q2: '半年报', Q3: '三季报', annual: '年报' };
        return labels[type as keyof typeof labels];
      },
    },
    {
      title: '总资产',
      key: 'totalAssets',
      width: 150,
      render: (_, record) => (record.assets.totalAssets / 100000000).toFixed(2) + '亿',
      sorter: (a, b) => a.assets.totalAssets - b.assets.totalAssets,
    },
    {
      title: '流动资产',
      key: 'currentAssets',
      width: 150,
      render: (_, record) => (record.assets.totalCurrentAssets / 100000000).toFixed(2) + '亿',
    },
    {
      title: '非流动资产',
      key: 'nonCurrentAssets',
      width: 150,
      render: (_, record) => (record.assets.totalNonCurrentAssets / 100000000).toFixed(2) + '亿',
    },
    {
      title: '总负债',
      key: 'totalLiabilities',
      width: 150,
      render: (_, record) => (record.liabilities.totalLiabilities / 100000000).toFixed(2) + '亿',
      sorter: (a, b) => a.liabilities.totalLiabilities - b.liabilities.totalLiabilities,
    },
    {
      title: '流动负债',
      key: 'currentLiabilities',
      width: 150,
      render: (_, record) => (record.liabilities.totalCurrentLiabilities / 100000000).toFixed(2) + '亿',
    },
    {
      title: '股东权益',
      key: 'totalEquity',
      width: 150,
      render: (_, record) => (record.equity.totalEquity / 100000000).toFixed(2) + '亿',
      sorter: (a, b) => a.equity.totalEquity - b.equity.totalEquity,
    },
    {
      title: '资产负债率',
      key: 'assetLiabilityRatio',
      width: 120,
      render: (_, record) => calculateAssetLiabilityRatio(record).toFixed(2) + '%',
    },
    {
      title: '流动比率',
      key: 'currentRatio',
      width: 120,
      render: (_, record) => calculateCurrentRatio(record).toFixed(2),
    },
    {
      title: '速动比率',
      key: 'quickRatio',
      width: 120,
      render: (_, record) => calculateQuickRatio(record).toFixed(2),
    },
  ];
  
  // 资产趋势图表配置
  const assetChartConfig = {
    data: dataList.flatMap(item => [
      { date: item.date, type: '总资产', value: item.assets.totalAssets / 100000000 },
      { date: item.date, type: '流动资产', value: item.assets.totalCurrentAssets / 100000000 },
      { date: item.date, type: '非流动资产', value: item.assets.totalNonCurrentAssets / 100000000 },
    ]),
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };
  
  // 负债趋势图表配置
  const liabilityChartConfig = {
    data: dataList.flatMap(item => [
      { date: item.date, type: '总负债', value: item.liabilities.totalLiabilities / 100000000 },
      { date: item.date, type: '流动负债', value: item.liabilities.totalCurrentLiabilities / 100000000 },
      { date: item.date, type: '非流动负债', value: item.liabilities.totalNonCurrentLiabilities / 100000000 },
    ]),
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    color: ['#f5222d', '#fa8c16', '#faad14'],
  };
  
  return (
    <div className="balance-sheet-page">
      <Card
        title="资产负债表"
        extra={
          <Space>
            <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
              <Option value="annual">年报</Option>
              <Option value="Q1">一季报</Option>
              <Option value="Q2">半年报</Option>
              <Option value="Q3">三季报</Option>
            </Select>
            <Button
              icon={viewMode === 'table' ? <BarChartOutlined /> : <TableOutlined />}
              onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
            >
              {viewMode === 'table' ? '图表视图' : '表格视图'}
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出数据
            </Button>
          </Space>
        }
        loading={loading}
      >
        {viewMode === 'table' ? (
          <Table
            columns={columns}
            dataSource={dataList}
            rowKey="date"
            scroll={{ x: 1500 }}
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Tabs defaultActiveKey="assets">
            <Tabs.TabPane tab="资产趋势" key="assets">
              <div style={{ height: 400 }}>
                <Line {...assetChartConfig} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="负债趋势" key="liabilities">
              <div style={{ height: 400 }}>
                <Line {...liabilityChartConfig} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="权益趋势" key="equity">
              <div style={{ height: 400 }}>
                <Line
                  data={dataList.map(item => ({
                    date: item.date,
                    value: item.equity.totalEquity / 100000000,
                  }))}
                  xField="date"
                  yField="value"
                  smooth={true}
                  color="#52c41a"
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        )}
      </Card>
      
      <Card title="财务指标" style={{ marginTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {dataList.slice(0, 1).map(data => (
            <>
              <div>
                <div style={{ color: '#999', fontSize: 12 }}>资产负债率</div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {calculateAssetLiabilityRatio(data).toFixed(2)}%
                </div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: 12 }}>流动比率</div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {calculateCurrentRatio(data).toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: 12 }}>速动比率</div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {calculateQuickRatio(data).toFixed(2)}
                </div>
              </div>
            </>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BalanceSheetPage;
