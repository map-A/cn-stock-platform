import React, { useState } from 'react';
import { Modal, Input, Tabs, Empty } from 'antd';
import { SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  modal: {
    '.ant-modal-content': {
      padding: 0,
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
    },
    '.ant-modal-header': {
      padding: '16px 20px',
      marginBottom: 0,
      borderBottom: `1px solid ${token.colorBorder}`,
    },
    '.ant-modal-body': {
      padding: 0,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    '.ant-modal-footer': {
      display: 'none',
    },
  },
  searchBar: {
    padding: '12px 20px',
    borderBottom: `1px solid ${token.colorBorder}`,
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '200px',
    borderRight: `1px solid ${token.colorBorder}`,
    backgroundColor: token.colorBgContainer,
    overflowY: 'auto',
  },
  sidebarSection: {
    padding: '16px 0',
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
  },
  sidebarTitle: {
    padding: '0 20px',
    fontSize: '12px',
    fontWeight: 600,
    color: token.colorTextSecondary,
    textTransform: 'uppercase',
    marginBottom: '8px',
    letterSpacing: '0.5px',
  },
  sidebarItem: {
    padding: '8px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
  sidebarItemActive: {
    backgroundColor: token.colorPrimaryBg,
    color: token.colorPrimary,
    fontWeight: 500,
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabsContainer: {
    borderBottom: `1px solid ${token.colorBorder}`,
    padding: '0 20px',
    '.ant-tabs-nav': {
      marginBottom: 0,
    },
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  },
  indicatorItem: {
    padding: '10px 20px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
  indicatorName: {
    fontSize: '14px',
    color: token.colorText,
    fontWeight: 400,
  },
  favoriteIcon: {
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  emptyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '40px 20px',
  },
}));

interface IndicatorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (indicator: any) => void;
}

const IndicatorModal: React.FC<IndicatorModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { styles, cx } = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('technical');
  const [activeTab, setActiveTab] = useState('indicators');

  // 内置技术指标
  const technicalIndicators = [
    '24小时成交量', 'BBTrend', 'Know Sure Thing', 'RCI Ribbon',
    'RSI背离指标', 'SMI 遍历指标', 'VWAP自动锚定', 'Woodies CCI',
    '一目均衡表', '三重指数平滑平均线', '三重指数平滑移动平均线',
    '上涨/下跌成交量', '中线', '之字转向', '交易时段', '价格摆动指标',
    '价格目标', '价量趋势指标', '估波曲线', '克林格成交量摆动指标',
    '净成交量', '加权移动平均线', '动向指标', '动量指标', '动量震荡指标',
    '包络线', '历史波动率', '平均K线图', '布林带', '布林带宽度',
    '指数移动平均线', '抛物线转向', '移动平均线', '累积/派发线',
    '线性回归', '线性回归通道', '线性回归斜率', '绝对价格摆动指标',
    '趋势强度指数', '超级趋势', '轴心点标准', '阿隆', '阿隆震荡指标',
    '麦克利兰摆荡指标', '麦克利兰总和指标',
  ];

  // 财务指标
  const financialIndicators = [
    '市盈率 (P/E)', '市净率 (P/B)', '市销率 (P/S)',
    '每股收益 (EPS)', '净资产收益率 (ROE)', '资产收益率 (ROA)',
    '负债率', '股息率', '市现率 (P/CF)', '企业价值倍数 (EV/EBITDA)',
  ];

  // 个人脚本（示例）
  const myScripts = [
    '我的自定义策略1',
    '我的趋势指标',
    '个人MACD优化版',
  ];

  const toggleFavorite = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const filterIndicators = (list: string[]) => {
    if (!searchValue) return list;
    return list.filter((name) =>
      name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const getCurrentList = () => {
    switch (activeCategory) {
      case 'my-scripts':
        return filterIndicators(myScripts);
      case 'technical':
        return filterIndicators(technicalIndicators);
      case 'financial':
        return filterIndicators(financialIndicators);
      default:
        return [];
    }
  };

  const handleSelect = (name: string) => {
    onSelect({ name });
    onClose();
  };

  const renderIndicatorList = () => {
    const list = getCurrentList();

    if (list.length === 0) {
      return (
        <div className={styles.emptyContainer}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={searchValue ? '未找到匹配的指标' : '暂无数据'}
          />
        </div>
      );
    }

    return (
      <div className={styles.listContainer}>
        {list.map((name) => (
          <div
            key={name}
            className={styles.indicatorItem}
            onClick={() => handleSelect(name)}
          >
            <span className={styles.indicatorName}>{name}</span>
            {favorites.includes(name) ? (
              <StarFilled
                className={styles.favoriteIcon}
                style={{ color: '#faad14' }}
                onClick={(e) => toggleFavorite(name, e)}
              />
            ) : (
              <StarOutlined
                className={styles.favoriteIcon}
                onClick={(e) => toggleFavorite(name, e)}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const tabItems = [
    { key: 'indicators', label: '指标' },
    { key: 'strategies', label: '策略' },
    { key: 'profiles', label: 'Profiles' },
    { key: 'patterns', label: '形态' },
  ];

  return (
    <Modal
      title="指标、衡量标准和策略"
      open={visible}
      onCancel={onClose}
      width={900}
      className={styles.modal}
      destroyOnClose
    >
      {/* 搜索栏 */}
      <div className={styles.searchBar}>
        <Input
          placeholder="搜索"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
          autoFocus
        />
      </div>

      {/* 主内容区 */}
      <div className={styles.content}>
        {/* 左侧边栏 */}
        <div className={styles.sidebar}>
          {/* 个人分类 */}
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarTitle}>个人</div>
            <div
              className={cx(
                styles.sidebarItem,
                activeCategory === 'my-scripts' && styles.sidebarItemActive
              )}
              onClick={() => setActiveCategory('my-scripts')}
            >
              我的脚本
            </div>
            <div className={styles.sidebarItem} style={{ color: '#999' }}>
              仅限邀请
            </div>
          </div>

          {/* 内置分类 */}
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarTitle}>内置</div>
            <div
              className={cx(
                styles.sidebarItem,
                activeCategory === 'technical' && styles.sidebarItemActive
              )}
              onClick={() => setActiveCategory('technical')}
            >
              技术指标
            </div>
            <div
              className={cx(
                styles.sidebarItem,
                activeCategory === 'financial' && styles.sidebarItemActive
              )}
              onClick={() => setActiveCategory('financial')}
            >
              财务指标
            </div>
          </div>
        </div>

        {/* 右侧主内容 */}
        <div className={styles.mainContent}>
          {/* 标签页 */}
          <div className={styles.tabsContainer}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="small"
            />
          </div>

          {/* 指标列表 */}
          {renderIndicatorList()}
        </div>
      </div>
    </Modal>
  );
};

export default IndicatorModal;
