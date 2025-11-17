/**
 * 自定义规则组件
 */

import React from 'react';
import { Button, Select, InputNumber, Space, Card, Radio } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CustomRule } from '../../types';
import { FIELD_OPTIONS, OPERATOR_OPTIONS, LOGICAL_OPERATOR_OPTIONS } from '../../constants/filterOptions';

interface CustomRulesProps {
  value?: CustomRule[];
  onChange?: (value: CustomRule[]) => void;
}

const CustomRules: React.FC<CustomRulesProps> = ({ value = [], onChange }) => {
  const handleAddRule = () => {
    const newRule: CustomRule = {
      id: `rule_${Date.now()}`,
      field: '',
      fieldLabel: '',
      operator: 'gt',
      value: undefined,
      logicalOperator: 'AND',
    };
    onChange?.([...value, newRule]);
  };

  const handleUpdateRule = (id: string, updates: Partial<CustomRule>) => {
    onChange?.(
      value.map(rule => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  };

  const handleRemoveRule = (id: string) => {
    onChange?.(value.filter(rule => rule.id !== id));
  };

  const handleFieldChange = (id: string, fieldValue: string) => {
    const field = FIELD_OPTIONS.find(f => f.value === fieldValue);
    handleUpdateRule(id, {
      field: fieldValue,
      fieldLabel: field?.label || fieldValue,
    });
  };

  return (
    <div>
      <Button
        type="dashed"
        onClick={handleAddRule}
        icon={<PlusOutlined />}
        style={{ width: '100%', marginBottom: 16 }}
      >
        添加规则
      </Button>

      {value.map((rule, index) => (
        <Card
          key={rule.id}
          size="small"
          style={{ marginBottom: 8 }}
          extra={
            <DeleteOutlined
              onClick={() => handleRemoveRule(rule.id)}
              style={{ cursor: 'pointer', color: '#ff4d4f' }}
            />
          }
        >
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <Select
              placeholder="选择字段"
              value={rule.field || undefined}
              onChange={v => handleFieldChange(rule.id, v)}
              options={FIELD_OPTIONS.map(f => ({
                label: `${f.label} (${f.category})`,
                value: f.value,
              }))}
              showSearch
              style={{ width: '100%' }}
            />

            <Space.Compact style={{ width: '100%' }}>
              <Select
                placeholder="运算符"
                value={rule.operator}
                onChange={v => handleUpdateRule(rule.id, { operator: v })}
                options={OPERATOR_OPTIONS.map(op => ({
                  label: op.label,
                  value: op.value,
                }))}
                style={{ width: '40%' }}
              />
              <InputNumber
                placeholder="值"
                value={rule.value}
                onChange={v => handleUpdateRule(rule.id, { value: v })}
                style={{ width: '60%' }}
              />
            </Space.Compact>

            {index < value.length - 1 && (
              <Radio.Group
                value={rule.logicalOperator || 'AND'}
                onChange={e => handleUpdateRule(rule.id, { logicalOperator: e.target.value })}
                options={LOGICAL_OPERATOR_OPTIONS}
                optionType="button"
                buttonStyle="solid"
                size="small"
              />
            )}
          </Space>
        </Card>
      ))}
    </div>
  );
};

export default CustomRules;
