import React, { useState } from 'react';
import { createStyles } from 'antd-style';
import { Button, Space, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';

const useStyles = createStyles(({ token }) => ({
  toolbar: {
    height: '40px',
    background: token.colorBgElevated,
    borderTop: `1px solid ${token.colorBorder}`,
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    gap: '4px',
    flexShrink: 0,
  },
  periodButton: {
    height: '28px',
    fontSize: '12px',
  },
  activeButton: {
    background: token.colorPrimaryBg,
    color: token.colorPrimary,
    fontWeight: 500,
  },
  divider: {
    width: '1px',
    height: '20px',
    background: token.colorBorder,
    margin: '0 8px',
  },
}));

interface PeriodPreset {
  label: string;
  period: string;
  range: string;
}

const BottomToolbar: React.FC = () => {
  const { styles, cx } = useStyles();
  const [activePeriod, setActivePeriod] = useState<string>('1D');

  const periodPresets: PeriodPreset[] = [
    { label: '1D', period: '1分钟', range: '1天' },
    { label: '5D', period: '5分钟', range: '5天' },
    { label: '1M', period: '30分钟', range: '1个月' },
    { label: '3M', period: '1小时', range: '3个月' },
    { label: '6M', period: '2小时', range: '6个月' },
    { label: 'YTD', period: '1天', range: '年初至今' },
    { label: '1Y', period: '1天', range: '1年' },
    { label: '5Y', period: '1周', range: '5年' },
    { label: 'ALL', period: '1个月', range: '所有数据' },
  ];

  const handlePeriodClick = (period: string) => {
    setActivePeriod(period);
  };

  const timezoneItems: MenuProps['items'] = [
    { key: 'exchange', label: '交易所时区' },
    { key: 'utc', label: 'UTC' },
    { key: 'gmt8', label: 'GMT+8 (北京时间)' },
    { key: 'est', label: 'EST (纽约)' },
    { key: 'cet', label: 'CET (欧洲中部)' },
  ];

  const adjustItems: MenuProps['items'] = [
    { key: 'none', label: '不调整' },
    { key: 'dividend', label: '调整股息' },
    { key: 'split', label: '调整分拆' },
    { key: 'both', label: '全部调整' },
  ];

  return (
    <div className={styles.toolbar}>
      <Space size={4}>
        {periodPresets.map((preset) => (
          <Button
            key={preset.label}
            type="text"
            size="small"
            className={cx(
              styles.periodButton,
              activePeriod === preset.label && styles.activeButton,
            )}
            onClick={() => handlePeriodClick(preset.label)}
          >
            {preset.label}
          </Button>
        ))}
      </Space>

      <div className={styles.divider} />

      <Dropdown menu={{ items: timezoneItems }} placement="topLeft">
        <Button
          type="text"
          size="small"
          className={styles.periodButton}
        >
          {new Date().toLocaleTimeString('zh-CN', { hour12: false })} UTC+8
        </Button>
      </Dropdown>

      <Dropdown menu={{ items: adjustItems }} placement="topLeft">
        <Button
          type="text"
          size="small"
          className={styles.periodButton}
        >
          ADJ
        </Button>
      </Dropdown>

      <Button
        type="text"
        size="small"
        className={styles.periodButton}
        icon={<CalendarOutlined />}
      >
        前往到
      </Button>
    </div>
  );
};

export default BottomToolbar;
