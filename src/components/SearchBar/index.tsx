/**
 * 全局搜索栏组件
 */
import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useDebounceFn } from 'ahooks';
import { searchStock } from '@/services/stock';
import type { StockInfo } from '@/typings/stock';
import styles from './index.less';

interface SearchOption {
  value: string;
  label: React.ReactNode;
  stock: StockInfo;
}

const SearchBar: React.FC = () => {
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [loading, setLoading] = useState(false);

  // 防抖搜索
  const { run: debouncedSearch } = useDebounceFn(
    async (keyword: string) => {
      if (!keyword || keyword.length < 2) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchStock(keyword);
        const searchOptions: SearchOption[] = results.map((stock) => ({
          value: stock.symbol,
          label: (
            <div className={styles.option}>
              <div className={styles.optionMain}>
                <span className={styles.name}>{stock.name}</span>
                <span className={styles.symbol}>{stock.symbol}</span>
              </div>
              <span className={styles.exchange}>{stock.exchange}</span>
            </div>
          ),
          stock,
        }));
        setOptions(searchOptions);
      } catch (error) {
        console.error('搜索失败:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    { wait: 300 }
  );

  // 选择股票
  const handleSelect = (value: string) => {
    history.push(`/stock/${value}`);
    setOptions([]);
  };

  return (
    <AutoComplete
      className={styles.searchBar}
      options={options}
      onSearch={debouncedSearch}
      onSelect={handleSelect}
      placeholder="搜索股票代码或名称"
    >
      <Input
        prefix={<SearchOutlined />}
        suffix={loading ? '搜索中...' : null}
        allowClear
      />
    </AutoComplete>
  );
};

export default SearchBar;
