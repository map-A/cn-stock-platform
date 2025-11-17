/**
 * 工具栏组件
 */

import React from 'react';
import { Space, Button, Dropdown, Typography } from 'antd';
import {
  DownloadOutlined,
  SaveOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Text } = Typography;

interface ToolbarProps {
  total: number;
  current: number;
  onExport: (type: 'current' | 'all') => void;
  onSave: () => void;
  onSaveAsStrategy: () => void;
  onReset: () => void;
  onColumnConfig: () => void;
  loading?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  total,
  current,
  onExport,
  onSave,
  onSaveAsStrategy,
  onReset,
  onColumnConfig,
  loading,
}) => {
  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'current',
      label: '导出当前页',
      onClick: () => onExport('current'),
    },
    {
      key: 'all',
      label: '导出全部',
      onClick: () => onExport('all'),
    },
  ];

  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
      <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
        <Dropdown menu={{ items: exportMenuItems }} placement="bottomLeft">
          <Button icon={<DownloadOutlined />} size="small">
            导出 CSV
          </Button>
        </Dropdown>

        <Button icon={<SaveOutlined />} onClick={onSave} size="small">
          保存筛选器
        </Button>

        <Button
          icon={<ThunderboltOutlined />}
          onClick={onSaveAsStrategy}
          size="small"
          type="primary"
          ghost
        >
          保存为策略
        </Button>

        <Button icon={<ReloadOutlined />} onClick={onReset} size="small">
          重置
        </Button>

        <Button icon={<SettingOutlined />} onClick={onColumnConfig} size="small">
          列配置
        </Button>

        <Text type="secondary" style={{ marginLeft: 'auto' }}>
          当前显示 <Text strong>{current}</Text> / 总共 <Text strong>{total}</Text> 只股票
        </Text>
      </Space>
    </div>
  );
};

export default Toolbar;
