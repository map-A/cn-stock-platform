import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Tag, Space, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import calendarService, { type DividendEvent } from '@/services/calendar';
import { useNavigate } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import styles from './index.less';

const { RangePicker } = DatePicker;

const DividendsCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DividendEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs(),
    dayjs().add(30, 'day'),
  ]);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await calendarService.getDividendsCalendar({
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
      message.error('获取分红日历失败');
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
      await calendarService.exportCalendar('dividends', {
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

  const columns: ColumnsType<DividendEvent> = [
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
      title: '除权日',
      dataIndex: 'exDividendDate',
      key: 'exDividendDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.exDividendDate).unix() - dayjs(b.exDividendDate).unix(),
    },
    {
      title: '派息日',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '登记日',
      dataIndex: 'recordDate',
      key: 'recordDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '宣布日',
      dataIndex: 'declarationDate',
      key: 'declarationDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '分红金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount: number, record) => `${record.currency}${amount.toFixed(4)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '分红类型',
      dataIndex: 'dividendType',
      key: 'dividendType',
      width: 100,
      render: (type: string) => {
        const typeMap = {
          cash: { text: '现金', color: 'green' },
          stock: { text: '股票', color: 'blue' },
        };
        const config = typeMap[type as keyof typeof typeMap] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '分红频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100,
      render: (freq: string) => {
        const freqMap = {
          annual: '年度',
          'semi-annual': '半年度',
          quarterly: '季度',
          monthly: '月度',
        };
        return freqMap[freq as keyof typeof freqMap] || freq;
      },
    },
  ];

  return (
    <PageContainer
      title="分红日历"
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
          rowKey={(record) => `${record.symbol}-${record.exDividendDate}`}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条分红记录`,
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

export default DividendsCalendar;
