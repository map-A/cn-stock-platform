import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Tag, Space, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import calendarService, { type DividendEvent } from '@/services/calendar';
import { useNavigate, useIntl } from '@umijs/max';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import styles from './index.less';

const { RangePicker } = DatePicker;

const DividendsCalendar: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl();
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
      message.error(intl.formatMessage({ id: 'message.loadFailed' }));
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
      message.success(intl.formatMessage({ id: 'message.exportSuccess' }));
    } catch (error) {
      message.error(intl.formatMessage({ id: 'message.exportFailed' }));
      console.error(error);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const columns: ColumnsType<DividendEvent> = [
    {
      title: intl.formatMessage({ id: 'table.columns.symbol' }),
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
      title: intl.formatMessage({ id: 'table.columns.stockName' }),
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'table.columns.exRightDate' }),
      dataIndex: 'exDividendDate',
      key: 'exDividendDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.exDividendDate).unix() - dayjs(b.exDividendDate).unix(),
    },
    {
      title: intl.formatMessage({ id: 'table.columns.paymentDate' }),
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'table.columns.recordDate' }),
      dataIndex: 'recordDate',
      key: 'recordDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'table.columns.announcementDate' }),
      dataIndex: 'declarationDate',
      key: 'declarationDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'table.columns.dividendAmount' }),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount: number, record) => `${record.currency}${amount.toFixed(4)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: intl.formatMessage({ id: 'table.columns.dividendType' }),
      dataIndex: 'dividendType',
      key: 'dividendType',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          cash: { text: intl.formatMessage({ id: 'pages.calendar.dividends.cash' }), color: 'green' },
          stock: { text: intl.formatMessage({ id: 'pages.calendar.dividends.stock' }), color: 'blue' },
        };
        const config = typeMap[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'table.columns.dividendFrequency' }),
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100,
      render: (freq: string) => {
        const freqMap: Record<string, string> = {
          annual: intl.formatMessage({ id: 'pages.calendar.dividends.annual' }),
          'semi-annual': intl.formatMessage({ id: 'pages.calendar.dividends.semiAnnual' }),
          quarterly: intl.formatMessage({ id: 'pages.calendar.dividends.quarterly' }),
          monthly: intl.formatMessage({ id: 'pages.calendar.dividends.monthly' }),
        };
        return freqMap[freq] || freq;
      },
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'pages.calendar.dividends.title' })}
      extra={[
        <Button key="export" icon={<DownloadOutlined />} onClick={handleExport}>
          {intl.formatMessage({ id: 'button.export' })}
        </Button>,
      ]}
    >
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Space size="middle">
          <span>{intl.formatMessage({ id: 'pages.calendar.dateRange' })}</span>
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
            showTotal: (total) => intl.formatMessage({ id: 'pages.calendar.total' }, { total }),
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
