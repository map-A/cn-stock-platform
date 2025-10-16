/**
 * 大宗交易页面
 */
import React, { useState } from 'react';
import {
  Card,
  Table,
  Tabs,
  DatePicker,
  Input,
  Space,
  Statistic,
  Row,
  Col,
  Tag,
  Typography,
} from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, SearchOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { history } from '@umijs/max';
import dayjs, { Dayjs } from 'dayjs';
import {
  getDarkPoolList,
  getStockDarkPoolHistory,
  getDepartmentTrack,
} from '@/services/analysis';
import { formatPrice, formatAmount, getPriceColor } from '@/utils/format';
import type { DarkPoolData, DepartmentTrack as DepartmentTrackType } from '@/typings/analysis';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './index.less';

const { Search } = Input;
const { Text, Title } = Typography;

const DarkPool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'department'>('list');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [searchSymbol, setSearchSymbol] = useState('');

  // 获取大宗交易列表
  const { data: darkPoolData, loading: listLoading } = useRequest(
    () => getDarkPoolList(selectedDate.format('YYYY-MM-DD'), searchSymbol),
    {
      refreshDeps: [selectedDate, searchSymbol],
      debounceWait: 500,
    }
  );

  // 获取营业部追踪
  const { data: departments, loading: deptLoading } = useRequest(
    () => getDepartmentTrack(30),
    {
      ready: activeTab === 'department',
    }
  );

  // 大宗交易列表表格列
  const darkPoolColumns = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      width: 120,
      fixed: 'left' as const,
      render: (name: string, record: DarkPoolData) => (
        <a onClick={() => history.push(`/stock/${record.symbol}`)}>
          {name}
        </a>
      ),
    },
    {
      title: '成交价',
      dataIndex: 'price',
      width: 100,
      align: 'right' as const,
      render: (price: number) => `¥${formatPrice(price)}`,
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      width: 120,
      align: 'right' as const,
      render: (vol: number) => `${(vol / 10000).toFixed(2)}万股`,
    },
    {
      title: '成交额',
      dataIndex: 'amount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => formatAmount(amount),
    },
    {
      title: '折溢价率',
      dataIndex: 'premiumRate',
      width: 120,
      align: 'right' as const,
      sorter: (a: DarkPoolData, b: DarkPoolData) => a.premiumRate - b.premiumRate,
      render: (rate: number) => (
        <Space>
          {rate >= 0 ? <ArrowUpOutlined style={{ color: '#f5222d' }} /> : <ArrowDownOutlined style={{ color: '#52c41a' }} />}
          <Text style={{ color: getPriceColor(rate) }}>
            {rate >= 0 ? '+' : ''}{rate.toFixed(2)}%
          </Text>
        </Space>
      ),
    },
    {
      title: '买方营业部',
      dataIndex: 'buyerDepartment',
      width: 250,
      ellipsis: true,
    },
    {
      title: '卖方营业部',
      dataIndex: 'sellerDepartment',
      width: 250,
      ellipsis: true,
    },
    {
      title: '交易时间',
      dataIndex: 'date',
      width: 180,
    },
  ];

  // 营业部追踪表格列
  const departmentColumns = [
    {
      title: '排名',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>
      ),
    },
    {
      title: '营业部',
      dataIndex: 'department',
      width: 300,
      ellipsis: true,
    },
    {
      title: '买入次数',
      dataIndex: 'buyCount',
      width: 100,
      align: 'right' as const,
    },
    {
      title: '买入金额',
      dataIndex: 'buyAmount',
      width: 150,
      align: 'right' as const,
      render: (amount: number) => formatAmount(amount),
    },
    {
      title: '卖出次数',
      dataIndex: 'sellCount',
      width: 100,
      align: 'right' as const,
    },
    {
      title: '卖出金额',
      dataIndex: 'sellAmount',
      width: 150,
      align: 'right' as const,
      render: (amount: number) => formatAmount(amount),
    },
    {
      title: '净买入',
      dataIndex: 'netAmount',
      width: 150,
      align: 'right' as const,
      sorter: (a: DepartmentTrackType, b: DepartmentTrackType) => a.netAmount - b.netAmount,
      render: (amount: number) => (
        <Text style={{ color: getPriceColor(amount) }}>
          {amount >= 0 ? '+' : ''}{formatAmount(amount)}
        </Text>
      ),
    },
    {
      title: '涉及股票',
      dataIndex: 'stocks',
      width: 100,
      align: 'right' as const,
      render: (stocks: string[]) => `${stocks.length}只`,
    },
  ];

  return (
    <div className={styles.darkPool}>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          items={[
            {
              key: 'list',
              label: '大宗交易列表',
            },
            {
              key: 'department',
              label: '营业部追踪',
            },
          ]}
        />

        {activeTab === 'list' && (
          <>
            {/* 统计卡片 */}
            {darkPoolData?.stats && (
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="交易笔数"
                      value={darkPoolData.stats.totalCount}
                      suffix="笔"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="总成交额"
                      value={(darkPoolData.stats.totalAmount / 100000000).toFixed(2)}
                      suffix="亿"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="折价交易"
                      value={darkPoolData.stats.discountCount}
                      suffix="笔"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="溢价交易"
                      value={darkPoolData.stats.premiumCount}
                      suffix="笔"
                      valueStyle={{ color: '#f5222d' }}
                    />
                  </Card>
                </Col>
              </Row>
            )}

            {/* 筛选工具栏 */}
            <Space style={{ marginBottom: 16 }} size="large">
              <DatePicker
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                placeholder="选择日期"
              />
              <Search
                placeholder="输入股票代码搜索"
                onSearch={setSearchSymbol}
                style={{ width: 200 }}
                allowClear
              />
            </Space>

            {/* 数据表格 */}
            <Table
              dataSource={darkPoolData?.list}
              columns={darkPoolColumns}
              rowKey="id"
              loading={listLoading}
              pagination={{
                pageSize: 50,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              scroll={{ x: 1400 }}
            />
          </>
        )}

        {activeTab === 'department' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">近30天营业部交易活跃度排行</Text>
            </div>
            <Table
              dataSource={departments}
              columns={departmentColumns}
              loading={deptLoading}
              pagination={{
                pageSize: 50,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 家营业部`,
              }}
              scroll={{ x: 1200 }}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default DarkPool;
