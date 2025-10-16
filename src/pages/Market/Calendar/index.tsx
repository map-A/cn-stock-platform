/**
 * 财报日历页面
 */
import React, { useState } from 'react';
import { Card, Calendar, Badge, List, Typography, Space, Tag, DatePicker } from 'antd';
import { useRequest } from 'ahooks';
import { history } from '@umijs/max';
import dayjs, { Dayjs } from 'dayjs';
import { getEarningsCalendar } from '@/services/market';
import { formatDate } from '@/utils/format';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './index.less';

const { Text, Title } = Typography;

const EarningsCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const { data, loading } = useRequest(
    () => getEarningsCalendar(selectedDate.format('YYYY-MM-DD')),
    {
      refreshDeps: [selectedDate],
    }
  );

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const count = data?.filter((item: any) => 
      item.date === dateStr
    ).length || 0;

    if (count === 0) return null;

    return (
      <div className={styles.dateCell}>
        <Badge count={count} style={{ backgroundColor: '#1890ff' }} />
      </div>
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  if (loading && !data) {
    return <LoadingSpinner fullscreen tip="加载财报日历..." />;
  }

  const selectedDateData = data?.filter((item: any) => 
    item.date === selectedDate.format('YYYY-MM-DD')
  ) || [];

  return (
    <div className={styles.earningsCalendar}>
      <Card title={<Title level={4}>财报发布日历</Title>}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 日历 */}
          <Calendar
            value={selectedDate}
            onSelect={handleDateSelect}
            cellRender={dateCellRender}
            headerRender={({ value, onChange }) => (
              <div className={styles.calendarHeader}>
                <Title level={4}>
                  {value.format('YYYY年MM月')}
                </Title>
                <DatePicker
                  value={value}
                  onChange={(date) => date && onChange(date)}
                  picker="month"
                />
              </div>
            )}
          />

          {/* 选中日期的财报列表 */}
          <Card 
            title={`${selectedDate.format('YYYY-MM-DD')} 财报发布列表`}
            extra={<Text type="secondary">共 {selectedDateData.length} 家公司</Text>}
          >
            {selectedDateData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(0,0,0,0.45)' }}>
                当日无财报发布
              </div>
            ) : (
              <List
                dataSource={selectedDateData}
                renderItem={(item: any) => (
                  <List.Item
                    actions={[
                      <a
                        key="detail"
                        onClick={() => history.push(`/stock/${item.symbol}`)}
                      >
                        查看详情
                      </a>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <a onClick={() => history.push(`/stock/${item.symbol}`)}>
                            {item.name}
                          </a>
                          <Text type="secondary">({item.symbol})</Text>
                        </Space>
                      }
                      description={
                        <Space size="middle">
                          <Tag color="blue">{item.reportType}</Tag>
                          <Text type="secondary">发布时间: {item.time}</Text>
                          {item.eps && (
                            <Text>预期EPS: {item.eps}</Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default EarningsCalendar;
