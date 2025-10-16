import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Statistic, Table, Empty } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import type { ColumnsType } from 'antd/es/table';
import {
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
} from '@/services/financial/financialService';
import { getFinancialRatios } from '@/services/financial/ratiosService';
import { formatNumber, formatCurrency, formatPercent } from '@/utils/format';
import styles from './index.less';

interface FinancialPanelProps {
  stockCode: string;
}

const FinancialPanel: React.FC<FinancialPanelProps> = ({ stockCode }) => {
  const [activeTab, setActiveTab] = useState('income');

  // 获取财务比率
  const { data: ratios } = useRequest(
    () => getFinancialRatios(stockCode),
    {
      refreshDeps: [stockCode],
    }
  );

  // 获取利润表
  const { data: incomeData, loading: incomeLoading } = useRequest(
    () => getIncomeStatement({ stockCode, limit: 8 }),
    {
      refreshDeps: [stockCode, activeTab],
      ready: activeTab === 'income',
    }
  );

  // 获取资产负债表
  const { data: balanceData, loading: balanceLoading } = useRequest(
    () => getBalanceSheet({ stockCode, limit: 8 }),
    {
      refreshDeps: [stockCode, activeTab],
      ready: activeTab === 'balance',
    }
  );

  // 获取现金流量表
  const { data: cashFlowData, loading: cashFlowLoading } = useRequest(
    () => getCashFlow({ stockCode, limit: 8 }),
    {
      refreshDeps: [stockCode, activeTab],
      ready: activeTab === 'cashflow',
    }
  );

  const incomeColumns: ColumnsType<any> = [
    {
      title: '报告期',
      dataIndex: 'reportDate',
      key: 'reportDate',
      fixed: 'left',
      width: 120,
    },
    {
      title: '营业收入',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '营业成本',
      dataIndex: 'operatingCost',
      key: 'operatingCost',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '毛利润',
      dataIndex: 'grossProfit',
      key: 'grossProfit',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '净利润',
      dataIndex: 'netIncome',
      key: 'netIncome',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '基本每股收益',
      dataIndex: 'eps',
      key: 'eps',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value, 2),
    },
    {
      title: '毛利率',
      dataIndex: 'grossProfitMargin',
      key: 'grossProfitMargin',
      width: 100,
      align: 'right',
      render: (value: number) => formatPercent(value),
    },
    {
      title: '净利率',
      dataIndex: 'netProfitMargin',
      key: 'netProfitMargin',
      width: 100,
      align: 'right',
      render: (value: number) => formatPercent(value),
    },
  ];

  const balanceColumns: ColumnsType<any> = [
    {
      title: '报告期',
      dataIndex: 'reportDate',
      key: 'reportDate',
      fixed: 'left',
      width: 120,
    },
    {
      title: '总资产',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '总负债',
      dataIndex: 'totalLiabilities',
      key: 'totalLiabilities',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '股东权益',
      dataIndex: 'totalEquity',
      key: 'totalEquity',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '流动资产',
      dataIndex: 'currentAssets',
      key: 'currentAssets',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '流动负债',
      dataIndex: 'currentLiabilities',
      key: 'currentLiabilities',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '资产负债率',
      dataIndex: 'debtRatio',
      key: 'debtRatio',
      width: 100,
      align: 'right',
      render: (value: number) => formatPercent(value),
    },
    {
      title: '流动比率',
      dataIndex: 'currentRatio',
      key: 'currentRatio',
      width: 100,
      align: 'right',
      render: (value: number) => value?.toFixed(2),
    },
  ];

  const cashFlowColumns: ColumnsType<any> = [
    {
      title: '报告期',
      dataIndex: 'reportDate',
      key: 'reportDate',
      fixed: 'left',
      width: 120,
    },
    {
      title: '经营活动现金流',
      dataIndex: 'operatingCashFlow',
      key: 'operatingCashFlow',
      width: 150,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '投资活动现金流',
      dataIndex: 'investingCashFlow',
      key: 'investingCashFlow',
      width: 150,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '融资活动现金流',
      dataIndex: 'financingCashFlow',
      key: 'financingCashFlow',
      width: 150,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '现金净增加额',
      dataIndex: 'netCashFlow',
      key: 'netCashFlow',
      width: 150,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
    {
      title: '期末现金余额',
      dataIndex: 'cashBalance',
      key: 'cashBalance',
      width: 150,
      align: 'right',
      render: (value: number) => formatCurrency(value / 100000000, 2) + '亿',
    },
  ];

  const tabItems = [
    {
      key: 'income',
      label: '利润表',
      children: (
        <Table
          loading={incomeLoading}
          dataSource={incomeData?.data || []}
          columns={incomeColumns}
          rowKey="reportDate"
          pagination={false}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: <Empty description="暂无利润表数据" />,
          }}
        />
      ),
    },
    {
      key: 'balance',
      label: '资产负债表',
      children: (
        <Table
          loading={balanceLoading}
          dataSource={balanceData?.data || []}
          columns={balanceColumns}
          rowKey="reportDate"
          pagination={false}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: <Empty description="暂无资产负债表数据" />,
          }}
        />
      ),
    },
    {
      key: 'cashflow',
      label: '现金流量表',
      children: (
        <Table
          loading={cashFlowLoading}
          dataSource={cashFlowData?.data || []}
          columns={cashFlowColumns}
          rowKey="reportDate"
          pagination={false}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: <Empty description="暂无现金流量表数据" />,
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles.financialPanel}>
      {ratios?.data && (
        <Row gutter={16} className={styles.ratiosRow}>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="市盈率(TTM)"
                value={ratios.data.peTTM}
                precision={2}
                suffix="倍"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="市净率"
                value={ratios.data.pb}
                precision={2}
                suffix="倍"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="ROE"
                value={ratios.data.roe}
                precision={2}
                suffix="%"
                valueStyle={{
                  color: ratios.data.roe > 15 ? '#3f8600' : '#666',
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="ROA"
                value={ratios.data.roa}
                precision={2}
                suffix="%"
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

export default FinancialPanel;
