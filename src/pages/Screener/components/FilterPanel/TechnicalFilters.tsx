/**
 * 技术指标过滤组件
 */

import React from 'react';
import { Form, Select, InputNumber, Switch, Space, Row, Col } from 'antd';
import type { TechnicalFilters as TechnicalFiltersType } from '../../types';
import {
  MA_PERIOD_OPTIONS,
  MA_CROSS_CONDITION_OPTIONS,
  RSI_PERIOD_OPTIONS,
  RSI_CONDITION_OPTIONS,
  MACD_CONDITION_OPTIONS,
  VOLATILITY_OPTIONS,
} from '../../constants/filterOptions';

interface TechnicalFiltersProps {
  value?: TechnicalFiltersType;
  onChange?: (value: TechnicalFiltersType) => void;
}

const TechnicalFilters: React.FC<TechnicalFiltersProps> = ({ value = {}, onChange }) => {
  const handleFieldChange = (field: string, fieldValue: any) => {
    const newValue = { ...value, [field]: fieldValue };
    onChange?.(newValue);
  };

  return (
    <Form layout="vertical" size="small">
      {/* MA均线 */}
      <Form.Item>
        <Space align="center">
          <Switch
            checked={value.ma?.enabled}
            onChange={checked =>
              handleFieldChange('ma', { ...value.ma, enabled: checked })
            }
          />
          <span>MA均线交叉</span>
        </Space>
      </Form.Item>
      {value.ma?.enabled && (
        <Row gutter={8}>
          <Col span={8}>
            <Select
              placeholder="短期"
              options={MA_PERIOD_OPTIONS}
              value={value.ma?.shortPeriod}
              onChange={v => handleFieldChange('ma', { ...value.ma, enabled: true, shortPeriod: v })}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="条件"
              options={MA_CROSS_CONDITION_OPTIONS}
              value={value.ma?.condition}
              onChange={v => handleFieldChange('ma', { ...value.ma, enabled: true, condition: v })}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="长期"
              options={MA_PERIOD_OPTIONS}
              value={value.ma?.longPeriod}
              onChange={v => handleFieldChange('ma', { ...value.ma, enabled: true, longPeriod: v })}
            />
          </Col>
        </Row>
      )}

      {/* RSI */}
      <Form.Item style={{ marginTop: 16 }}>
        <Space align="center">
          <Switch
            checked={value.rsi?.enabled}
            onChange={checked =>
              handleFieldChange('rsi', { ...value.rsi, enabled: checked })
            }
          />
          <span>RSI指标</span>
        </Space>
      </Form.Item>
      {value.rsi?.enabled && (
        <>
          <Row gutter={8}>
            <Col span={12}>
              <Select
                placeholder="周期"
                options={RSI_PERIOD_OPTIONS}
                value={value.rsi?.period || 14}
                onChange={v => handleFieldChange('rsi', { ...value.rsi, enabled: true, period: v })}
              />
            </Col>
            <Col span={12}>
              <Select
                placeholder="条件"
                options={RSI_CONDITION_OPTIONS}
                value={value.rsi?.condition}
                onChange={v => handleFieldChange('rsi', { ...value.rsi, enabled: true, condition: v })}
              />
            </Col>
          </Row>
          {value.rsi?.condition === 'custom' && (
            <Row gutter={8} style={{ marginTop: 8 }}>
              <Col span={12}>
                <InputNumber
                  placeholder="最小值"
                  value={value.rsi?.minValue}
                  onChange={v => handleFieldChange('rsi', { ...value.rsi, enabled: true, minValue: v || undefined })}
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                />
              </Col>
              <Col span={12}>
                <InputNumber
                  placeholder="最大值"
                  value={value.rsi?.maxValue}
                  onChange={v => handleFieldChange('rsi', { ...value.rsi, enabled: true, maxValue: v || undefined })}
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                />
              </Col>
            </Row>
          )}
        </>
      )}

      {/* MACD */}
      <Form.Item style={{ marginTop: 16 }}>
        <Space align="center">
          <Switch
            checked={value.macd?.enabled}
            onChange={checked =>
              handleFieldChange('macd', { ...value.macd, enabled: checked })
            }
          />
          <span>MACD</span>
        </Space>
      </Form.Item>
      {value.macd?.enabled && (
        <Select
          placeholder="选择条件"
          options={MACD_CONDITION_OPTIONS}
          value={value.macd?.condition}
          onChange={v => handleFieldChange('macd', { ...value.macd, enabled: true, condition: v })}
          style={{ width: '100%' }}
        />
      )}

      {/* 波动率 */}
      <Form.Item label="波动率" style={{ marginTop: 16 }}>
        <Select
          placeholder="选择波动率"
          options={VOLATILITY_OPTIONS}
          value={value.volatility}
          onChange={v => handleFieldChange('volatility', v)}
          allowClear
        />
      </Form.Item>
    </Form>
  );
};

export default TechnicalFilters;
