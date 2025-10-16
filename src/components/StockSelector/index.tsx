/**
 * 股票选择器组件
 * 支持多只股票选择和搜索
 */

import React, { useState } from 'react';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd';
import debounce from 'lodash-es/debounce';

export interface StockOption {
  symbol: string;
  name: string;
  exchange?: string;
}

export interface StockSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  maxCount?: number;
  placeholder?: string;
  style?: React.CSSProperties;
}

const StockSelector: React.FC<StockSelectorProps> = ({
  value = [],
  onChange,
  maxCount = 5,
  placeholder = '请选择股票',
  style,
}) => {
  const [options, setOptions] = useState<StockOption[]>([]);
  const [loading, setLoading] = useState(false);

  // 模拟搜索股票
  const handleSearch = debounce((searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }

    setLoading(true);
    
    // 模拟数据 - 实际应该调用 API
    setTimeout(() => {
      const mockData: StockOption[] = [
        { symbol: '600000.SH', name: '浦发银行', exchange: 'SH' },
        { symbol: '600016.SH', name: '民生银行', exchange: 'SH' },
        { symbol: '600036.SH', name: '招商银行', exchange: 'SH' },
        { symbol: '000001.SZ', name: '平安银行', exchange: 'SZ' },
        { symbol: '000002.SZ', name: '万科A', exchange: 'SZ' },
      ].filter(
        (item) =>
          item.symbol.includes(searchText) || item.name.includes(searchText)
      );

      setOptions(mockData);
      setLoading(false);
    }, 300);
  }, 300);

  const selectOptions: SelectProps['options'] = options.map((item) => ({
    label: `${item.name} (${item.symbol})`,
    value: item.symbol,
  }));

  return (
    <Select
      mode="multiple"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      options={selectOptions}
      maxCount={maxCount}
      notFoundContent={loading ? <Spin size="small" /> : null}
      allowClear
    />
  );
};

export default StockSelector;
