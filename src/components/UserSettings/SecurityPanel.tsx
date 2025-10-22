/**
 * 安全设置面板组件
 */

import React from 'react';
import { Card } from 'antd';
import type { SecuritySettings } from '@/types/user';

interface SecurityPanelProps {
  security?: SecuritySettings;
  onUpdate?: () => void;
}

const SecurityPanel: React.FC<SecurityPanelProps> = ({ security, onUpdate }) => {
  return (
    <Card title="安全设置">
      <div>安全设置功能开发中...</div>
    </Card>
  );
};

export default SecurityPanel;