/**
 * 高级表达式模式组件
 */

import React from 'react';
import { Switch, Space, Alert } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import ExpressionEditor from '../ExpressionEditor';

interface AdvancedModeProps {
  enabled: boolean;
  expression?: string;
  onToggle: (enabled: boolean) => void;
  onChange?: (expression: string) => void;
  onValidate?: (expression: string) => Promise<{ valid: boolean; errors?: any[] }>;
}

const AdvancedMode: React.FC<AdvancedModeProps> = ({
  enabled,
  expression,
  onToggle,
  onChange,
  onValidate,
}) => {
  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <ThunderboltOutlined style={{ color: '#faad14' }} />
            <span style={{ fontWeight: 500 }}>启用高级表达式模式</span>
          </Space>
          <Switch checked={enabled} onChange={onToggle} />
        </div>

        {!enabled && (
          <Alert
            message="提示"
            description="启用高级表达式模式后，可以使用复杂的布尔表达式进行筛选。注意：启用后将忽略上方的基本筛选条件。"
            type="info"
            showIcon
          />
        )}

        {enabled && (
          <ExpressionEditor
            value={expression}
            onChange={onChange}
            onValidate={onValidate}
          />
        )}
      </Space>
    </div>
  );
};

export default AdvancedMode;
