/**
 * 设备管理面板组件
 */

import React from 'react';
import { Card } from 'antd';
import type { UserDevice } from '@/types/user';

interface DevicePanelProps {
  devices?: UserDevice[];
  onUpdate?: () => void;
}

const DevicePanel: React.FC<DevicePanelProps> = ({ devices, onUpdate }) => {
  return (
    <Card title="设备管理">
      <div>设备管理功能开发中...</div>
    </Card>
  );
};

export default DevicePanel;