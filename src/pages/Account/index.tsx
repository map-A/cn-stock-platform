import React, { useState, useEffect } from 'react';
import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import {
  Card,
  Row,
  Col,
  Select,
  Tabs,
  Space,
  Button,
  Spin,
  message,
  Typography,
  Table,
  Progress,
  Tooltip,
  Empty,
  Tag,
  Divider,
} from 'antd';
import {
  ReloadOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

// 导入投资组合管理组件
import HoldingDetails from '@/components/Portfolio/HoldingDetails';
import AssetAllocation from '@/components/Portfolio/AssetAllocation';
import PerformanceAnalysis from '@/components/Portfolio/PerformanceAnalysis';
import RiskMetrics from '@/components/Portfolio/RiskMetrics';
import HistoricalComparison from '@/components/Portfolio/HistoricalComparison';

// 导入子组件
import AccountOverview from '@/components/Account/AccountOverview';
import FundFlowHistory from '@/components/Account/FundFlowHistory';

// 引入API
import { 
  getAccountList, 
  getAccountDetail, 
  getAccountPositions, 
  getAccountFundFlows 
} from '@/services/account';

import './index.less';

const { Title, Text } = Typography;
const { Option } = Select;

// 定义数据类型
interface AccountInfo {
  account_id: string;
  account_name: string;
  account_type: 'cash' | 'margin' | 'option';
  broker_name: string;
  total_assets: number;
  available_cash: number;
  frozen_cash: number;
  market_value: number;
  margin_balance?: number;
  short_balance?: number;
  credit_limit?: number;
  risk_level: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
  status: 'active' | 'suspended';
  last_updated: string;
}

interface PositionInfo {
  code: string;
  total_shares: number;
  available_shares: number;
  avg_cost_price: number;
  current_price: number;
  market_value: number;
  profit_loss: number;
  profit_loss_ratio: number;
  position_ratio: number; // 占总资产比例
}

interface FundFlow {
  flow_id: string;
  flow_time: string;
  flow_type: string;
  amount: number;
  balance_after: number;
  related_code?: string;
  description: string;
}

const AccountPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [accountData, setAccountData] = useState<AccountInfo | null>(null);
  const [positions, setPositions] = useState<PositionInfo[]>([]);
  const [fundFlows, setFundFlows] = useState<FundFlow[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟数据加载
  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await getAccountList({});
      if (response.success && response.data) {
        setAccounts(response.data);
        if (response.data.length > 0 && !selectedAccount) {
          setSelectedAccount(response.data[0].account_id);
        }
      } else {
        message.error('获取账户列表失败');
      }
    } catch (error) {
      console.error('加载账户列表失败:', error);
      message.error('加载账户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载账户详细数据
  const loadAccountData = async (accountId: string) => {
    if (!accountId) return;
    
    setLoading(true);
    try {
      // 获取账户详细信息
      const accountResponse = await getAccountDetail(accountId);
      if (accountResponse.success && accountResponse.data) {
        setAccountData(accountResponse.data);
      }

      // 加载持仓数据
      const positionsResponse = await getAccountPositions(accountId, {});
      if (positionsResponse.success && positionsResponse.data) {
        // 转换后端数据格式到前端格式
        const convertedPositions: PositionInfo[] = positionsResponse.data.map(pos => ({
          code: pos.code,
          total_shares: pos.total_shares,
          available_shares: pos.available_shares,
          avg_cost_price: pos.avg_cost_price,
          current_price: pos.current_price,
          market_value: pos.market_value,
          profit_loss: pos.profit_loss,
          profit_loss_ratio: pos.profit_loss_ratio,
          position_ratio: pos.market_value / (accountResponse.data?.total_assets || 1) * 100,
        }));
        setPositions(convertedPositions);
      }

      // 加载资金流水
      const flowsResponse = await getAccountFundFlows(accountId, {});
      if (flowsResponse.success && flowsResponse.data) {
        // 转换后端数据格式到前端格式
        const convertedFlows: FundFlow[] = flowsResponse.data.map(flow => ({
          flow_id: flow.flow_id,
          flow_time: flow.flow_time,
          flow_type: flow.flow_type,
          amount: flow.amount,
          balance_after: flow.balance_after,
          related_code: flow.related_code || '',
          description: flow.description || '',
        }));
        setFundFlows(convertedFlows);
      }
      
    } catch (error) {
      console.error('加载账户数据失败:', error);
      message.error('加载账户数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadAccountData(selectedAccount);
    }
  }, [selectedAccount, accounts]);

  // 计算统计数据
  const getAccountStats = () => {
    if (!accountData) return null;

    const totalProfitLoss = positions.reduce((sum, pos) => sum + pos.profit_loss, 0);
    const totalCost = accountData.total_assets - totalProfitLoss;
    const totalProfitLossRatio = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;
    
    return {
      totalAssets: accountData.total_assets / 100, // 转换为元
      availableCash: accountData.available_cash / 100,
      marketValue: accountData.market_value / 100,
      totalProfitLoss: totalProfitLoss / 100,
      totalProfitLossRatio,
      positionCount: positions.length,
      cashRatio: (accountData.available_cash / accountData.total_assets) * 100,
      leverageRatio: accountData.margin_balance ? (accountData.margin_balance / accountData.total_assets) * 100 : 0,
    };
  };

  const stats = getAccountStats();

  const tabItems = [
    {
      key: 'overview',
      label: '账户概览',
      children: <AccountOverview accountData={accountData} stats={stats} />,
    },
    {
      key: 'holdings',
      label: '持仓明细',
      children: (
        <HoldingDetails
          holdings={positions.map(pos => ({
            stockCode: pos.code,
            stockName: pos.code,
            quantity: pos.total_shares,
            availableQuantity: pos.available_shares,
            costPrice: pos.avg_cost_price,
            currentPrice: pos.current_price,
            marketValue: pos.market_value,
            totalCost: pos.avg_cost_price * pos.total_shares,
            profitLoss: pos.profit_loss,
            profitLossPercent: pos.profit_loss_ratio,
            positionPercent: pos.position_ratio,
            dayChange: 0,
            dayChangePercent: 0,
            industry: '未知',
            updateTime: new Date().toISOString(),
          }))}
          totalAssets={accountData?.total_assets || 0}
          loading={loading}
          onStockClick={(stockCode) => {
            message.info(`查看 ${stockCode} 详情`);
          }}
        />
      ),
    },
    {
      key: 'allocation',
      label: '资产配置',
      children: (
        <AssetAllocation
          assets={positions.map(pos => ({
            name: pos.code,
            code: pos.code,
            value: pos.market_value,
            percentage: pos.position_ratio,
            category: '未知',
            profitLoss: pos.profit_loss,
            profitLossPercent: pos.profit_loss_ratio,
          }))}
          totalAssets={accountData?.total_assets || 0}
          loading={loading}
        />
      ),
    },
    {
      key: 'performance',
      label: '收益分析',
      children: (
        <PerformanceAnalysis
          performanceData={[
            // 模拟数据，实际应该从API获取
            {
              date: '2024-01-01',
              portfolioReturn: 1.2,
              cumulativeReturn: 15.6,
              benchmarkReturn: 0.8,
              benchmarkCumulative: 12.3,
              portfolioValue: 1.156,
              benchmarkValue: 1.123,
            },
          ]}
          metrics={{
            totalReturn: stats?.totalProfitLossRatio || 0,
            annualizedReturn: 18.2,
            volatility: 16.8,
            sharpeRatio: 1.08,
            maxDrawdown: -8.5,
            winRate: 62.5,
            excessReturn: 3.3,
            informationRatio: 0.42,
          }}
          loading={loading}
          onDateRangeChange={(dates) => {
            console.log('Date range changed:', dates);
          }}
        />
      ),
    },
    {
      key: 'risk',
      label: '风险分析',
      children: (
        <RiskMetrics
          riskData={{
            var: {
              daily: -2.1,
              weekly: -4.8,
              monthly: -8.5,
            },
            cvar: {
              daily: -3.2,
              weekly: -6.8,
              monthly: -12.1,
            },
            beta: 1.15,
            correlation: 0.85,
            informationRatio: 0.42,
            trackingError: 4.2,
            maxDrawdown: -8.5,
            downsideRisk: 12.8,
            sortinoRatio: 1.25,
            calmarRatio: 2.14,
          }}
          positionRisks={positions.slice(0, 10).map(pos => ({
            stockCode: pos.code,
            stockName: pos.code,
            riskContribution: Math.random() * 15,
            positionPercent: pos.position_ratio,
            stockBeta: 0.8 + Math.random() * 0.8,
            riskLevel: (Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
          }))}
          totalAssets={accountData?.total_assets || 0}
          loading={loading}
        />
      ),
    },
    {
      key: 'historical',
      label: '历史对比',
      children: (
        <HistoricalComparison
          historicalData={[
            // 模拟历史数据，实际应该从API获取
            ...Array.from({ length: 30 }, (_, i) => {
              const date = dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD');
              const portfolioReturn = (Math.random() - 0.5) * 4; // -2% to 2%
              const benchmarkReturn = (Math.random() - 0.5) * 3; // -1.5% to 1.5%
              const baseValue = 1 + i * 0.002;
              return {
                date,
                portfolioValue: baseValue * (1 + portfolioReturn / 100),
                portfolioReturn,
                cumulativeReturn: (baseValue - 1) * 100 + portfolioReturn,
                benchmarkValue: baseValue * 0.98 * (1 + benchmarkReturn / 100),
                benchmarkReturn,
                benchmarkCumulative: (baseValue * 0.98 - 1) * 100 + benchmarkReturn,
                sharpeRatio: 0.8 + Math.random() * 0.4,
                maxDrawdown: Math.random() * 8,
                volatility: 12 + Math.random() * 8,
                turnoverRate: Math.random() * 50,
              };
            }),
          ]}
          portfolioName="我的投资组合"
          benchmarkName="沪深300"
          loading={loading}
          onPeriodChange={(period) => {
            console.log('Period changed:', period);
          }}
          onDateRangeChange={(dates) => {
            console.log('Date range changed:', dates);
          }}
          onExport={() => {
            message.info('导出功能开发中...');
          }}
        />
      ),
    },
    {
      key: 'fund-flow',
      label: '资金流水',
      children: <FundFlowHistory fundFlows={fundFlows} />,
    },
  ];

  return (
    <PageContainer
      title="账户管理"
      content="查看和分析回测账户的详细情况，包括资产配置、持仓分析、盈亏统计等"
      extra={[
        <Select
          key="account-select"
          style={{ width: 200 }}
          placeholder="选择账户"
          value={selectedAccount}
          onChange={setSelectedAccount}
          loading={loading}
        >
          {accounts.map(account => (
            <Option key={account.account_id} value={account.account_id}>
              {account.account_name}
            </Option>
          ))}
        </Select>,
        <Button
          key="refresh"
          icon={<ReloadOutlined />}
          onClick={() => loadAccountData(selectedAccount)}
          loading={loading}
        >
          刷新
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {!selectedAccount ? (
          <Empty description="请选择一个账户" />
        ) : (
          <>
            {/* 核心指标卡片 */}
            {stats && (
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                  <StatisticCard
                    statistic={{
                      title: '总资产',
                      value: stats.totalAssets,
                      precision: 2,
                      suffix: '元',
                      icon: <DollarOutlined style={{ color: '#1890ff' }} />,
                    }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <StatisticCard
                    statistic={{
                      title: '持仓市值',
                      value: stats.marketValue,
                      precision: 2,
                      suffix: '元',
                      icon: <PieChartOutlined style={{ color: '#52c41a' }} />,
                    }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <StatisticCard
                    statistic={{
                      title: '可用资金',
                      value: stats.availableCash,
                      precision: 2,
                      suffix: '元',
                      icon: <BarChartOutlined style={{ color: '#faad14' }} />,
                    }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <StatisticCard
                    statistic={{
                      title: '浮动盈亏',
                      value: stats.totalProfitLoss,
                      precision: 2,
                      suffix: '元',
                      valueStyle: { 
                        color: stats.totalProfitLoss >= 0 ? '#cf1322' : '#3f8600' 
                      },
                      icon: stats.totalProfitLoss >= 0 ? 
                        <RiseOutlined style={{ color: '#cf1322' }} /> : 
                        <FallOutlined style={{ color: '#3f8600' }} />,
                    }}
                  />
                </Col>
              </Row>
            )}

            {/* 详细分析标签页 */}
            <Card>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                size="large"
              />
            </Card>
          </>
        )}
      </Spin>
    </PageContainer>
  );
};

export default AccountPage;
