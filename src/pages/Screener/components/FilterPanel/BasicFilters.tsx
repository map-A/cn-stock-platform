/**
 * 基本过滤组件
 */

import React, { useCallback, useMemo } from 'react';
import { Form, Select, InputNumber, Checkbox, Space } from 'antd';
import type { BasicFilters as BasicFiltersType } from '../../types';
import { MARKET_OPTIONS, MARKET_CAP_PRESETS } from '../../constants/filterOptions';
import { debounce } from '../../utils/performance';

interface BasicFiltersProps {
  value?: BasicFiltersType;
  onChange?: (value: BasicFiltersType) => void;
  industries?: Array<{ code: string; name: string }>;
  sectors?: Array<{ code: string; name: string }>;
}

const BasicFilters: React.FC<BasicFiltersProps> = ({
  value = {},
  onChange,
  industries = [],
  sectors = [],
}) => {
  const [form] = Form.useForm();
  const [marketCapPreset, setMarketCapPreset] = React.useState('unlimited');

  // 使用防抖优化输入性能
  const debouncedOnChange = useMemo(
    () => debounce((newValue: BasicFiltersType) => onChange?.(newValue), 300),
    [onChange]
  );

  const handleFieldChange = useCallback((field: string, fieldValue: any) => {
    const newValue = { ...value, [field]: fieldValue };
    debouncedOnChange(newValue);
  }, [value, debouncedOnChange]);

  const handleMarketCapPresetChange = (presetValue: string) => {
    setMarketCapPreset(presetValue);
    const preset = MARKET_CAP_PRESETS.find(p => p.value === presetValue);
    if (preset) {
      handleFieldChange('marketCapMin', preset.min);
      handleFieldChange('marketCapMax', preset.max);
    }
  };

  return (
    <Form form={form} layout="vertical" size="small">
      <Form.Item label="市场">
        <Checkbox.Group
          options={MARKET_OPTIONS}
          value={value.markets}
          onChange={v => handleFieldChange('markets', v)}
        />
      </Form.Item>

      <Form.Item label="行业">
        <Select
          mode="multiple"
          placeholder="请选择行业"
          value={value.industries}
          onChange={v => handleFieldChange('industries', v)}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={industries.map(ind => ({ label: ind.name, value: ind.code }))}
          allowClear
        />
      </Form.Item>

      <Form.Item label="板块">
        <Select
          mode="multiple"
          placeholder="请选择板块"
          value={value.sectors}
          onChange={v => handleFieldChange('sectors', v)}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={sectors.map(sec => ({ label: sec.name, value: sec.code }))}
          allowClear
        />
      </Form.Item>

      <Form.Item label="市值">
        <Select
          value={marketCapPreset}
          onChange={handleMarketCapPresetChange}
          options={MARKET_CAP_PRESETS}
          style={{ marginBottom: 8 }}
        />
        {marketCapPreset === 'custom' && (
          <Space.Compact style={{ width: '100%' }}>
            <InputNumber
              placeholder="最小值（亿）"
              value={value.marketCapMin ? value.marketCapMin / 100000000 : undefined}
              onChange={v => handleFieldChange('marketCapMin', v ? v * 100000000 : undefined)}
              style={{ width: '50%' }}
              min={0}
            />
            <InputNumber
              placeholder="最大值（亿）"
              value={value.marketCapMax ? value.marketCapMax / 100000000 : undefined}
              onChange={v => handleFieldChange('marketCapMax', v ? v * 100000000 : undefined)}
              style={{ width: '50%' }}
              min={0}
            />
          </Space.Compact>
        )}
      </Form.Item>

      <Form.Item label="价格区间（元）">
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最低价"
            value={value.priceMin}
            onChange={v => handleFieldChange('priceMin', v)}
            style={{ width: '50%' }}
            min={0}
          />
          <InputNumber
            placeholder="最高价"
            value={value.priceMax}
            onChange={v => handleFieldChange('priceMax', v)}
            style={{ width: '50%' }}
            min={0}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item label="交易量（万股）">
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最小量"
            value={value.volumeMin ? value.volumeMin / 10000 : undefined}
            onChange={v => handleFieldChange('volumeMin', v ? v * 10000 : undefined)}
            style={{ width: '50%' }}
            min={0}
          />
          <InputNumber
            placeholder="最大量"
            value={value.volumeMax ? value.volumeMax / 10000 : undefined}
            onChange={v => handleFieldChange('volumeMax', v ? v * 10000 : undefined)}
            style={{ width: '50%' }}
            min={0}
          />
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

export default BasicFilters;
