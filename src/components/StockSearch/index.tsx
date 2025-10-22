import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AutoComplete, Input, List, Typography, Space, Tag, Empty } from 'antd';
import { SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { useStockList } from '@/hooks/useStockData';
import { debounce } from 'lodash-es';
import './index.less';

const { Text } = Typography;
const { Option } = AutoComplete;

interface StockSearchProps {
  /** 搜索框占位符 */
  placeholder?: string;
  /** 选择股票的回调 */
  onSelect?: (stockCode: string, stockInfo: API.StockInfo) => void;
  /** 是否显示自选股标识 */
  showFavorites?: boolean;
  /** 搜索结果最大显示数量 */
  maxResults?: number;
  /** 组件尺寸 */
  size?: 'small' | 'middle' | 'large';
  /** 是否允许清空 */
  allowClear?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

interface SearchResult extends API.StockInfo {
  /** 是否为自选股 */
  isFavorite?: boolean;
  /** 匹配的字段类型 */
  matchType?: 'code' | 'name' | 'industry' | 'concept';
  /** 匹配的关键词 */
  matchText?: string;
}

const StockSearch: React.FC<StockSearchProps> = ({
  placeholder = '搜索股票代码或名称',
  onSelect,
  showFavorites = true,
  maxResults = 20,
  size = 'middle',
  allowClear = true,
  className,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const { stockList, favorites, addToFavorites, removeFromFavorites } = useStockList({
    autoFetch: true,
    enableRealTime: false,
  });

  // 防抖搜索函数
  const debouncedSearch = useMemo(
    () => debounce((keyword: string) => {
      performSearch(keyword);
    }, 300),
    [stockList]
  );

  // 执行搜索
  const performSearch = useCallback((keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    try {
      const results: SearchResult[] = [];
      const searchKeyword = keyword.toLowerCase();

      stockList.forEach(item => {
        const stock = item.info;
        let matchType: SearchResult['matchType'] = undefined;
        let matchText = '';

        // 匹配股票代码
        if (stock.code.toLowerCase().includes(searchKeyword)) {
          matchType = 'code';
          matchText = stock.code;
        }
        // 匹配股票名称
        else if (stock.name.toLowerCase().includes(searchKeyword)) {
          matchType = 'name';
          matchText = stock.name;
        }
        // 匹配行业
        else if (stock.industry && stock.industry.toLowerCase().includes(searchKeyword)) {
          matchType = 'industry';
          matchText = stock.industry;
        }
        // 匹配概念
        else if (stock.concepts && stock.concepts.some(concept => 
          concept.toLowerCase().includes(searchKeyword)
        )) {
          matchType = 'concept';
          const matchedConcept = stock.concepts.find(concept => 
            concept.toLowerCase().includes(searchKeyword)
          );
          matchText = matchedConcept || '';
        }

        if (matchType) {
          results.push({
            ...stock,
            isFavorite: favorites.includes(stock.code),
            matchType,
            matchText,
          });
        }
      });

      // 排序：自选股优先，然后按代码排序
      results.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return a.code.localeCompare(b.code);
      });

      setSearchResults(results.slice(0, maxResults));
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [stockList, favorites, maxResults]);

  // 监听搜索值变化
  useEffect(() => {
    if (searchValue) {
      debouncedSearch(searchValue);
    } else {
      setSearchResults([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue, debouncedSearch]);

  // 处理搜索输入
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setVisible(!!value);
  };

  // 处理选择股票
  const handleSelect = (value: string, option: any) => {
    const selectedStock = searchResults.find(item => item.code === value);
    if (selectedStock && onSelect) {
      onSelect(selectedStock.code, selectedStock);
    }
    setSearchValue('');
    setVisible(false);
  };

  // 切换自选股状态
  const toggleFavorite = (e: React.MouseEvent, stockCode: string) => {
    e.stopPropagation();
    if (favorites.includes(stockCode)) {
      removeFromFavorites(stockCode);
    } else {
      addToFavorites(stockCode);
    }
  };

  // 获取匹配类型标签
  const getMatchTypeTag = (matchType: SearchResult['matchType']) => {
    const tagMap = {
      code: { color: 'blue', text: '代码' },
      name: { color: 'green', text: '名称' },
      industry: { color: 'orange', text: '行业' },
      concept: { color: 'purple', text: '概念' },
    };
    
    if (!matchType || !tagMap[matchType]) return null;
    
    const { color, text } = tagMap[matchType];
    return <Tag color={color} size="small">{text}</Tag>;
  };

  // 渲染搜索结果项
  const renderOption = (item: SearchResult) => (
    <Option key={item.code} value={item.code}>
      <div className="search-result-item">
        <div className="stock-info">
          <Space>
            <Text strong>{item.code}</Text>
            <Text>{item.name}</Text>
            {getMatchTypeTag(item.matchType)}
          </Space>
          {item.industry && (
            <Text type="secondary" className="industry">
              {item.industry}
            </Text>
          )}
        </div>
        {showFavorites && (
          <div 
            className="favorite-action"
            onClick={(e) => toggleFavorite(e, item.code)}
          >
            {item.isFavorite ? (
              <StarFilled style={{ color: '#faad14' }} />
            ) : (
              <StarOutlined style={{ color: '#d9d9d9' }} />
            )}
          </div>
        )}
      </div>
    </Option>
  );

  return (
    <div className={`stock-search ${className || ''}`}>
      <AutoComplete
        value={searchValue}
        options={searchResults.map(renderOption)}
        onSearch={handleSearch}
        onSelect={handleSelect}
        onDropdownVisibleChange={setVisible}
        open={visible && searchResults.length > 0}
        placeholder={placeholder}
        size={size}
        allowClear={allowClear}
        notFoundContent={
          loading ? (
            <div className="search-loading">搜索中...</div>
          ) : searchValue && searchResults.length === 0 ? (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="未找到相关股票"
            />
          ) : null
        }
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder={placeholder}
          size={size}
          allowClear={allowClear}
        />
      </AutoComplete>
    </div>
  );
};

export default StockSearch;