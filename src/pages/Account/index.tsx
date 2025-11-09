/**
 * 账户管理页面
 * 展示和分析回测账户的详细情况
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Select,
  Space,
  Tabs,
  Spin,
  message,
  Empty,
  Segmented,
} from 'antd';
import {
  ReloadOutlined,
  DollarOutlined,
  PieChartOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  getAccountList,
  getAccountDetail,
  getAccountPositions,
  getAccountTransactions,
  getAccountSnapshots,
  getAccountPerformance,
  getAccountAllocation,
  type BacktestAccount,
  type AccountPosition,
  type AccountTransaction,
  type AccountPerformance as AccountPerformanceType,
  type AccountAssetAllocation,
  type AccountDailySnapshot,
} from '@/services/account';

import AccountStats from '@/components/Account/AccountStats';
import PositionTable from '@/components/Account/PositionTable';
import TransactionTable from '@/components/Account/TransactionTable';
import AssetAllocationChart from '@/components/Account/AssetAllocationChart';
import EquityCurveChart from '@/components/Account/EquityCurveChart';
import PerformanceMetrics from '@/components/Account/PerformanceMetrics';

import './index.less';

const { Option } = Select;

const AccountPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<BacktestAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  
  // 账户详细数据
  const [account, setAccount] = useState<BacktestAccount | null>(null);
  const [positions, setPositions] = useState<AccountPosition[]>([]);
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [snapshots, setSnapshots] = useState<AccountDailySnapshot[]>([]);
  const [performance, setPerformance] = useState<AccountPerformanceType | null>(null);
  const [allocations, setAllocations] = useState<AccountAssetAllocation[]>([]);
  
  // 分页
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionPageSize, setTransactionPageSize] = useState(20);
  const [transactionTotal, setTransactionTotal] = useState(0);
  
  const [activeTab, setActiveTab] = useState('overview');

  // 加载账户列表
  const loadAccounts = async () => {
    try {
      const response = await getAccountList();
      if (response.code === 200 && response.data) {
        setAccounts(response.data);
        if (response.data.length > 0 && !selectedAccountId) {
          setSelectedAccountId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('加载账户列表失败:', error);
      message.error('加载账户列表失败');
    }
  };

  // 加载账户详情
  const loadAccountDetail = async (accountId: number) => {
    setLoading(true);
    try {
      const response = await getAccountDetail(accountId);
      if (response.code === 200 && response.data) {
        const { account: accountData, positions: positionData, performance: perfData, asset_allocation } = response.data;
        setAccount(accountData);
        setPositions(positionData || []);
        setPerformance(perfData || null);
        setAllocations(asset_allocation || []);
      }
    } catch (error) {
      console.error('加载账户详情失败:', error);
      message.error('加载账户详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载持仓
  const loadPositions = async (accountId: number) => {
    try {
      const response = await getAccountPositions(accountId);
      if (response.code === 200 && response.data) {
        setPositions(response.data);
      }
    } catch (error) {
      console.error('加载持仓失败:', error);
    }
  };

  // 加载交易记录
  const loadTransactions = async (accountId: number, page = 1, pageSize = 20) => {
    try {
      const response = await getAccountTransactions(accountId, page, pageSize);
      if (response.code === 200 && response.data) {
        setTransactions(response.data.items || []);
        setTransactionTotal(response.data.total || 0);
        setTransactionPage(page);
        setTransactionPageSize(pageSize);
      }
    } catch (error) {
      console.error('加载交易记录失败:', error);
    }
  };

  // 加载资金曲线
  const loadSnapshots = async (accountId: number) => {
    try {
      const response = await getAccountSnapshots(accountId);
      if (response.code === 200 && response.data) {
        setSnapshots(response.data);
      }
    } catch (error) {
      console.error('加载资金曲线失败:', error);
    }
  };

  // 加载绩效指标
  const loadPerformance = async (accountId: number) => {
    try {
      const response = await getAccountPerformance(accountId);
      if (response.code === 200 && response.data) {
        setPerformance(response.data);
      }
    } catch (error) {
      console.error('加载绩效指标失败:', error);
    }
  };

  // 加载资产配置
  const loadAllocations = async (accountId: number) => {
    try {
      const response = await getAccountAllocation(accountId);
      if (response.code === 200 && response.data) {
        setAllocations(response.data);
      }
    } catch (error) {
      console.error('加载资产配置失败:', error);
    }
  };

  // 刷新所有数据
  const refreshAllData = () => {
    if (selectedAccountId) {
      loadAccountDetail(selectedAccountId);
      loadTransactions(selectedAccountId, transactionPage, transactionPageSize);
      loadSnapshots(selectedAccountId);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      loadAccountDetail(selectedAccountId);
      loadTransactions(selectedAccountId, 1, transactionPageSize);
      loadSnapshots(selectedAccountId);
    }
  }, [selectedAccountId]);

  // 处理账户切换
  const handleAccountChange = (accountId: number) => {
    setSelectedAccountId(accountId);
    setTransactionPage(1); // 重置分页
  };

  // 处理交易记录分页
  const handleTransactionPageChange = (page: number, pageSize: number) => {
    if (selectedAccountId) {
      loadTransactions(selectedAccountId, page, pageSize);
    }
  };

  // 处理股票点击
  const handleStockClick = (symbol: string) => {
    message.info(`查看 ${symbol} 详情功能开发中...`);
  };

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <DollarOutlined />
          账户概览
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <AccountStats account={account} performance={performance} loading={loading} />
          <EquityCurveChart snapshots={snapshots} loading={loading} />
        </Space>
      ),
    },
    {
      key: 'positions',
      label: (
        <span>
          <PieChartOutlined />
          持仓明细
        </span>
      ),
      children: (
        <PositionTable 
          positions={positions} 
          loading={loading} 
          onStockClick={handleStockClick}
        />
      ),
    },
    {
      key: 'allocation',
      label: (
        <span>
          <BarChartOutlined />
          资产配置
        </span>
      ),
      children: <AssetAllocationChart allocations={allocations} loading={loading} />,
    },
    {
      key: 'performance',
      label: (
        <span>
          <LineChartOutlined />
          绩效分析
        </span>
      ),
      children: <PerformanceMetrics performance={performance} loading={loading} />,
    },
    {
      key: 'transactions',
      label: (
        <span>
          <UnorderedListOutlined />
          交易记录
        </span>
      ),
      children: (
        <TransactionTable
          transactions={transactions}
          total={transactionTotal}
          current={transactionPage}
          pageSize={transactionPageSize}
          loading={loading}
          onChange={handleTransactionPageChange}
        />
      ),
    },
  ];

  return (
    <PageContainer
      title="账户管理"
      subTitle="查看和分析回测账户的详细情况"
      extra={[
        <Select
          key="account-select"
          style={{ width: 240 }}
          placeholder="选择账户"
          value={selectedAccountId}
          onChange={handleAccountChange}
          loading={loading}
        >
          {accounts.map((acc) => (
            <Option key={acc.id} value={acc.id}>
              {acc.account_name} ({acc.account_type})
            </Option>
          ))}
        </Select>,
        <Button
          key="refresh"
          type="primary"
          icon={<ReloadOutlined />}
          onClick={refreshAllData}
          loading={loading}
        >
          刷新
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {!selectedAccountId ? (
          <Card>
            <Empty description="请选择一个账户" />
          </Card>
        ) : (
          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
            />
          </Card>
        )}
      </Spin>
    </PageContainer>
  );
};

export default AccountPage;
