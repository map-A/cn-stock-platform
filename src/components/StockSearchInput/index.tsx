/**
 * 股票搜索输入组件
 */

import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash-es/debounce';
import type { AutoCompleteProps } from 'antd';

export interface StockOption {
  symbol: string;
  name: string;
  exchange?: string;
}

export interface StockSearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string, option: any) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const StockSearchInput: React.FC<StockSearchInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = '搜索股票代码或名称',
  style,
}) => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

  const handleSearch = debounce((searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }

    // 模拟数据 - 实际应该调用 API
    const mockData: StockOption[] = [
      { symbol: '600000.SH', name: '浦发银行', exchange: 'SH' },
      { symbol: '600016.SH', name: '民生银行', exchange: 'SH' },
      { symbol: '600036.SH', name: '招商银行', exchange: 'SH' },
      { symbol: '000001.SZ', name: '平安银行', exchange: 'SZ' },
      { symbol: '000002.SZ', name: '万科A', exchange: 'SZ' },
    ].filter(
      (item) =>
        item.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
        item.name.includes(searchText)
    );

    setOptions(
      mockData.map((item) => ({
        label: `${item.name} (${item.symbol})`,
        value: item.symbol,
      }))
    );
  }, 300);

  return (
    <AutoComplete
      value={value}
      options={options}
      onSearch={handleSearch}
      onSelect={onSelect}
      onChange={onChange}
      style={style}
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder={placeholder}
        allowClear
      />
    </AutoComplete>
  );
};

export default StockSearchInput;
