import React, { useState } from 'react';
import { Modal, Input, List, Avatar, Tag, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  searchInput: {
    marginBottom: '16px',
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      background: token.colorBgTextHover,
    },
  },
  symbolInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  symbolLogo: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  symbolDetails: {
    flex: 1,
  },
  symbolName: {
    fontWeight: 600,
    fontSize: '14px',
  },
  exchange: {
    fontSize: '12px',
    color: token.colorTextSecondary,
  },
  price: {
    fontSize: '14px',
    fontWeight: 500,
  },
}));

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  logo?: string;
  type: string;
}

interface SymbolSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (stock: Stock) => void;
}

const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { styles } = useStyles();
  const [searchText, setSearchText] = useState('');

  // Mock数据
  const mockStocks: Stock[] = [
    { symbol: 'AAPL', name: '苹果公司', exchange: 'NASDAQ', price: 274.62, change: -0.63, changePercent: -0.23, logo: 'https://s3-symbol-logo.tradingview.com/apple.svg', type: '股票' },
    { symbol: 'TSLA', name: '特斯拉', exchange: 'NASDAQ', price: 441.50, change: 1.88, changePercent: 0.43, logo: 'https://s3-symbol-logo.tradingview.com/tesla.svg', type: '股票' },
    { symbol: 'NVDA', name: '英伟达', exchange: 'NASDAQ', price: 195.36, change: 2.20, changePercent: 1.14, logo: 'https://s3-symbol-logo.tradingview.com/nvidia.svg', type: '股票' },
    { symbol: 'MSFT', name: '微软', exchange: 'NASDAQ', price: 425.34, change: 3.12, changePercent: 0.74, logo: 'https://s3-symbol-logo.tradingview.com/microsoft.svg', type: '股票' },
    { symbol: 'GOOGL', name: '谷歌', exchange: 'NASDAQ', price: 172.48, change: -1.23, changePercent: -0.71, logo: 'https://s3-symbol-logo.tradingview.com/alphabet.svg', type: '股票' },
    { symbol: '000001', name: '上证指数', exchange: 'SSE', price: 4000.14, change: -2.62, changePercent: -0.07, logo: 'https://s3-symbol-logo.tradingview.com/indices/sse-composite.svg', type: '指数' },
    { symbol: 'SPX', name: '标普500', exchange: 'INDEX', price: 6867.11, change: 20.50, changePercent: 0.30, logo: 'https://s3-symbol-logo.tradingview.com/indices/s-and-p-500.svg', type: '指数' },
    { symbol: 'BTCUSD', name: '比特币', exchange: 'CRYPTO', price: 104609, change: 1594, changePercent: 1.55, logo: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC.svg', type: '加密货币' },
  ];

  const filteredStocks = searchText
    ? mockStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchText.toLowerCase()),
      )
    : mockStocks;

  const groupedStocks = filteredStocks.reduce((acc, stock) => {
    if (!acc[stock.type]) {
      acc[stock.type] = [];
    }
    acc[stock.type].push(stock);
    return acc;
  }, {} as Record<string, Stock[]>);

  const handleSelect = (stock: Stock) => {
    onSelect(stock);
    onClose();
  };

  const tabItems = Object.keys(groupedStocks).map((type) => ({
    key: type,
    label: type,
    children: (
      <List
        dataSource={groupedStocks[type]}
        renderItem={(stock) => (
          <List.Item
            className={styles.listItem}
            onClick={() => handleSelect(stock)}
          >
            <div className={styles.symbolInfo}>
              {stock.logo && (
                <Avatar src={stock.logo} className={styles.symbolLogo} />
              )}
              <div className={styles.symbolDetails}>
                <div className={styles.symbolName}>{stock.symbol}</div>
                <div className={styles.exchange}>
                  {stock.name} · {stock.exchange}
                </div>
              </div>
              <div>
                <div className={styles.price}>{stock.price.toFixed(2)}</div>
                <Tag color={stock.change >= 0 ? 'success' : 'error'}>
                  {stock.change >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%
                </Tag>
              </div>
            </div>
          </List.Item>
        )}
      />
    ),
  }));

  return (
    <Modal
      title="商品代码搜索"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Input
        className={styles.searchInput}
        placeholder="搜索股票、指数、外汇、加密货币..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        autoFocus
        allowClear
      />
      <Tabs items={tabItems} />
    </Modal>
  );
};

export default SymbolSearchModal;
