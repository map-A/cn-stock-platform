import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Select, Tag, Space, Button, message } from 'antd';
import { DownloadOutlined, BellOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import calendarService, { type EarningsEvent } from '@/services/calendar';
import { useNavigate } from '@umijs/max';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const EarningsCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EarningsEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs().add(30, 'day'),
  ]);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await calendarService.getEarningsCalendar({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        page: currentPage,
        pageSize,
      });

      if (response.success && response.data) {
        setData(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('获取财报日历失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange(dates);
      setCurrentPage(1);
    }
  };

  const handleExport = async () => {
    try {
      await calendarService.exportCalendar('earnings', {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      });
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
      console.error(error);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const columns: ColumnsType<EarningsEvent> = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
      fixed: 'left',
      render: (symbol: string) => (
        <a onClick={() => handleStockClick(symbol)}>
          <strong>{symbol}</strong>
        </a>
      ),
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '财报日期',
      dataIndex: 'reportDate',
      key: 'reportDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.reportDate).unix() - dayjs(b.reportDate).unix(),
    },
    {
      title: '财年/季度',
      key: 'fiscal',
      width: 120,
      render: (_, record) => `${record.fiscalYear}年Q${record.fiscalQuarter}`,
    },
    {
      title: '预期EPS',
      dataIndex: 'estimatedEPS',
      key: 'estimatedEPS',
      width: 100,
      align: 'right',
      render: (eps?: number) => (eps !== undefined ? `¥${eps.toFixed(2)}` : '-'),
    },
    {
      title: '实际EPS',
      dataIndex: 'actualEPS',
      key: 'actualEPS',
      width: 100,
      align: 'right',
      render: (eps?: number) => (eps !== undefined ? `¥${eps.toFixed(2)}` : '-'),
    },
    {
      title: 'EPS惊喜度',
      dataIndex: 'surprisePercent',
      key: 'surprisePercent',
      width: 120,
      align: 'right',
      render: (percent?: number) => {
        if (percent === undefined) return '-';
        return (
          <Tag color={percent >= 0 ? 'success' : 'error'}>
            {percent >= 0 ? '+' : ''}
            {percent.toFixed(2)}%
          </Tag>
        );
      },
    },
    {
      title: '预期营收',
      dataIndex: 'estimatedRevenue',
      key: 'estimatedRevenue',
      width: 120,
      align: 'right',
      render: (revenue?: number) =>
        revenue !== undefined ? `${(revenue / 100000000).toFixed(2)}亿` : '-',
    },
    {
      title: '实际营收',
      dataIndex: 'actualRevenue',
      key: 'actualRevenue',
      width: 120,
      align: 'right',
      render: (revenue?: number) =>
        revenue !== undefined ? `${(revenue / 100000000).toFixed(2)}亿` : '-',
    },
    {
      title: '发布时间',
      dataIndex: 'callTime',
      key: 'callTime',
      width: 100,
      render: (time?: string) => {
        if (!time) return '-';
        const timeMap = {
          'before-market': '盘前',
          'after-market': '盘后',
          'during-market': '盘中',
        };
        return timeMap[time as keyof typeof timeMap] || '-';
      },
    },
  ];

  return (
    <PageContainer
      title="财报日历"
      extra={[
        <Button key="export" icon={<DownloadOutlined />} onClick={handleExport}>
          导出数据
        </Button>,
      ]}
    >
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Space size="middle">
          <span>日期范围：</span>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
          />
        </Space>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => `${record.symbol}-${record.reportDate}`}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条财报记录`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 1400 }}
        />
      </Card>
    </PageContainer>
  );
};

export default EarningsCalendar;
