/**
 * 个性化偏好设置面板组件
 */

import React from 'react';
import { Card } from 'antd';
import type { PreferenceSettings } from '@/types/user';

interface PreferencePanelProps {
  preference?: PreferenceSettings;
  onUpdate?: () => void;
}

const PreferencePanel: React.FC<PreferencePanelProps> = ({ preference, onUpdate }) => {
  return (
    <Card title="个性化偏好">
      <div>个性化偏好设置功能开发中...</div>
    </Card>
  );
};

export default PreferencePanel;