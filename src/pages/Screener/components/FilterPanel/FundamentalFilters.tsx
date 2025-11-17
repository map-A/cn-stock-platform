/**
 * 财务指标过滤组件
 */

import React from 'react';
import { Form, InputNumber, Select, Space } from 'antd';
import type { FundamentalFilters as FundamentalFiltersType } from '../../types';
import { PE_TYPE_OPTIONS } from '../../constants/filterOptions';

interface FundamentalFiltersProps {
  value?: FundamentalFiltersType;
  onChange?: (value: FundamentalFiltersType) => void;
}

const FundamentalFilters: React.FC<FundamentalFiltersProps> = ({ value = {}, onChange }) => {
  const handleFieldChange = (field: string, fieldValue: any) => {
    const newValue = { ...value, [field]: fieldValue };
    onChange?.(newValue);
  };

  return (
    <Form layout="vertical" size="small">
      <Form.Item label="ROE 净资产收益率 (%)">
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最小值"
            value={value.roeMin}
            onChange={v => handleFieldChange('roeMin', v)}
            style={{ width: '50%' }}
          />
          <InputNumber
            placeholder="最大值"
            value={value.roeMax}
            onChange={v => handleFieldChange('roeMax', v)}
            style={{ width: '50%' }}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item label="市盈率 PE">
        <Select
          value={value.peType || 'ttm'}
          onChange={v => handleFieldChange('peType', v)}
          options={PE_TYPE_OPTIONS}
          style={{ marginBottom: 8 }}
        />
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最小值"
            value={value.peMin}
            onChange={v => handleFieldChange('peMin', v)}
            style={{ width: '50%' }}
          />
          <InputNumber
            placeholder="最大值"
            value={value.peMax}
            onChange={v => handleFieldChange('peMax', v)}
            style={{ width: '50%' }}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item label="市净率 PB">
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最小值"
            value={value.pbMin}
            onChange={v => handleFieldChange('pbMin', v)}
            style={{ width: '50%' }}
          />
          <InputNumber
            placeholder="最大值"
            value={value.pbMax}
            onChange={v => handleFieldChange('pbMax', v)}
            style={{ width: '50%' }}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item label="毛利率 (%)">
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最小值"
            value={value.grossProfitMarginMin}
            onChange={v => handleFieldChange('grossProfitMarginMin', v)}
            style={{ width: '50%' }}
          />
          <InputNumber
            placeholder="最大值"
            value={value.grossProfitMarginMax}
            onChange={v => handleFieldChange('grossProfitMarginMax', v)}
            style={{ width: '50%' }}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item label="净利率 (%)">
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最小值"
            value={value.netProfitMarginMin}
            onChange={v => handleFieldChange('netProfitMarginMin', v)}
            style={{ width: '50%' }}
          />
          <InputNumber
            placeholder="最大值"
            value={value.netProfitMarginMax}
            onChange={v => handleFieldChange('netProfitMarginMax', v)}
            style={{ width: '50%' }}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item label="EPS同比增长率 (%)">
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最小值"
            value={value.epsGrowthMin}
            onChange={v => handleFieldChange('epsGrowthMin', v)}
            style={{ width: '50%' }}
          />
          <InputNumber
            placeholder="最大值"
            value={value.epsGrowthMax}
            onChange={v => handleFieldChange('epsGrowthMax', v)}
            style={{ width: '50%' }}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item label="营收增长率 (%)">
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最小值"
            value={value.revenueGrowthMin}
            onChange={v => handleFieldChange('revenueGrowthMin', v)}
            style={{ width: '50%' }}
          />
          <InputNumber
            placeholder="最大值"
            value={value.revenueGrowthMax}
            onChange={v => handleFieldChange('revenueGrowthMax', v)}
            style={{ width: '50%' }}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item label="资产负债率 (%)">
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            placeholder="最小值"
            value={value.debtRatioMin}
            onChange={v => handleFieldChange('debtRatioMin', v)}
            style={{ width: '50%' }}
            max={100}
          />
          <InputNumber
            placeholder="最大值"
            value={value.debtRatioMax}
            onChange={v => handleFieldChange('debtRatioMax', v)}
            style={{ width: '50%' }}
            max={100}
          />
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

export default FundamentalFilters;
