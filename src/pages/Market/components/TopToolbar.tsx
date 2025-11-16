import React, { useState } from 'react';
import { createStyles } from 'antd-style';
import {
  SearchOutlined,
  PlusOutlined,
  LineChartOutlined,
  FunctionOutlined,
  BellOutlined,
  PlayCircleOutlined,
  UndoOutlined,
  RedoOutlined,
  LayoutOutlined,
  SaveOutlined,
  AppstoreOutlined,
  SettingOutlined,
  FullscreenOutlined,
  CameraOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space, Tooltip, Input, message } from 'antd';
import type { MenuProps } from 'antd';
import SymbolSearchModal from './SymbolSearchModal';
import IndicatorModal from './IndicatorModal';
import SettingsModal from './SettingsModal';
import AlertModal from './AlertModal';

const useStyles = createStyles(({ token }) => ({
  toolbar: {
    height: '48px',
    background: token.colorBgElevated,
    borderBottom: `1px solid ${token.colorBorder}`,
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    gap: '4px',
    flexShrink: 0,
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  divider: {
    width: '1px',
    height: '24px',
    background: token.colorBorder,
    margin: '0 8px',
  },
  symbolButton: {
    fontWeight: 600,
    fontSize: '14px',
  },
  periodButton: {
    minWidth: '48px',
  },
}));

const TopToolbar: React.FC = () => {
  const { styles } = useStyles();
  const [symbol, setSymbol] = useState('NVDA');
  const [period, setPeriod] = useState('1 日');
  const [symbolSearchVisible, setSymbolSearchVisible] = useState(false);
  const [indicatorModalVisible, setIndicatorModalVisible] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chartTypeItems: MenuProps['items'] = [
    { key: 'bars', label: '美国线' },
    { key: 'candles', label: 'K线图' },
    { key: 'hollow_candles', label: '空心K线图' },
    { key: 'volume_candles', label: '成交量蜡烛' },
    { key: 'line', label: '线形图' },
    { key: 'line_with_markers', label: '带标记线' },
    { key: 'step_line', label: '阶梯线' },
    { key: 'area', label: '面积图' },
    { key: 'hlc_area', label: 'HLC区域' },
    { key: 'baseline', label: '基准线' },
    { key: 'column', label: '柱状图' },
    { key: 'hi_lo', label: '高-低' },
    { key: 'volume_footprint', label: '成交量轨迹' },
    { key: 'tpo', label: '时间 价格 机会' },
    { key: 'volume_profile', label: '交易时段成交量分布图' },
    { key: 'heikinashi', label: '平均K线图' },
    { key: 'renko', label: '砖形图' },
    { key: 'line_break', label: '新价线' },
    { key: 'kagi', label: '卡吉图' },
    { key: 'point_and_figure', label: '点数图' },
    { key: 'range', label: 'Range图' },
  ];

  const periodItems: MenuProps['items'] = [
    { 
      key: 'custom', 
      label: '添加自定义周期…',
      onClick: () => message.info('自定义周期功能开发中')
    },
    { type: 'divider' },
    {
      key: 'ticks',
      label: 'TICKS',
      type: 'group',
      children: [
        { key: '1T', label: '1 ticks', onClick: () => setPeriod('1T') },
        { key: '10T', label: '10 ticks', onClick: () => setPeriod('10T') },
        { key: '100T', label: '100 ticks', onClick: () => setPeriod('100T') },
        { key: '1000T', label: '1000 ticks', onClick: () => setPeriod('1000T') },
      ],
    },
    {
      key: 'seconds',
      label: '秒',
      type: 'group',
      children: [
        { key: '1S', label: '1 秒', onClick: () => setPeriod('1 秒') },
        { key: '5S', label: '5 秒', onClick: () => setPeriod('5 秒') },
        { key: '10S', label: '10 秒', onClick: () => setPeriod('10 秒') },
        { key: '15S', label: '15 秒', onClick: () => setPeriod('15 秒') },
        { key: '30S', label: '30 秒', onClick: () => setPeriod('30 秒') },
        { key: '45S', label: '45 秒', onClick: () => setPeriod('45 秒') },
      ],
    },
    {
      key: 'minutes',
      label: '分钟',
      type: 'group',
      children: [
        { key: '1', label: '1 分钟', onClick: () => setPeriod('1 分钟') },
        { key: '2', label: '2 分钟', onClick: () => setPeriod('2 分钟') },
        { key: '3', label: '3 分钟', onClick: () => setPeriod('3 分钟') },
        { key: '5', label: '5 分钟', onClick: () => setPeriod('5 分钟') },
        { key: '10', label: '10 分钟', onClick: () => setPeriod('10 分钟') },
        { key: '15', label: '15 分钟', onClick: () => setPeriod('15 分钟') },
        { key: '30', label: '30 分钟', onClick: () => setPeriod('30 分钟') },
        { key: '45', label: '45 分钟', onClick: () => setPeriod('45 分钟') },
      ],
    },
    {
      key: 'hours',
      label: '小时',
      type: 'group',
      children: [
        { key: '60', label: '1 小时', onClick: () => setPeriod('1 小时') },
        { key: '120', label: '2 小时', onClick: () => setPeriod('2 小时') },
        { key: '180', label: '3 小时', onClick: () => setPeriod('3 小时') },
        { key: '240', label: '4 小时', onClick: () => setPeriod('4 小时') },
      ],
    },
    {
      key: 'days',
      label: '天',
      type: 'group',
      children: [
        { key: 'D', label: '1 日', onClick: () => setPeriod('1 日') },
        { key: 'W', label: '1 周', onClick: () => setPeriod('1 周') },
        { key: '1M', label: '1 月', onClick: () => setPeriod('1 月') },
        { key: '3M', label: '3 月', onClick: () => setPeriod('3 月') },
        { key: '6M', label: '6 月', onClick: () => setPeriod('6 月') },
        { key: '12M', label: '12 月', onClick: () => setPeriod('12 月') },
      ],
    },
    {
      key: 'range',
      label: '范围',
      type: 'group',
      children: [
        { key: '1R', label: '1 范围', onClick: () => setPeriod('1R') },
        { key: '10R', label: '10 范围', onClick: () => setPeriod('10R') },
        { key: '100R', label: '100 范围', onClick: () => setPeriod('100R') },
        { key: '1000R', label: '1000 范围', onClick: () => setPeriod('1000R') },
      ],
    },
  ];

  const layoutItems: MenuProps['items'] = [
    { key: 'single', label: '单图表' },
    { key: 'two-v', label: '两图（竖）' },
    { key: 'two-h', label: '两图（横）' },
    { key: 'three', label: '三图' },
    { key: 'four', label: '四图' },
  ];

  const shareItems: MenuProps['items'] = [
    { key: 'snapshot', label: '生成快照' },
    { key: 'twitter', label: '分享到 Twitter' },
    { key: 'link', label: '复制链接' },
  ];

  const handleSymbolSelect = (stock: any) => {
    setSymbol(stock.symbol);
    message.success(`已切换到 ${stock.symbol}`);
  };

  const handleIndicatorSelect = (indicator: any) => {
    message.success(`已添加指标: ${indicator.name}`);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSnapshot = () => {
    message.info('正在生成图表快照...');
    // TODO: 实现截图功能
  };

  const handleSaveLayout = () => {
    message.success('布局已保存');
    // TODO: 实现保存布局功能
  };

  return (
    <>
    <div className={styles.toolbar}>
      <div className={styles.section}>
        <Tooltip title="商品代码搜索">
          <Button
            type="text"
            className={styles.symbolButton}
            onClick={() => setSymbolSearchVisible(true)}
          >
            <SearchOutlined style={{ marginRight: '4px' }} />
            {symbol}
          </Button>
        </Tooltip>
        <Tooltip title="对比或叠加商品">
          <Button type="text" icon={<PlusOutlined />} />
        </Tooltip>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <Dropdown menu={{ items: periodItems }}>
          <Button type="text" className={styles.periodButton}>
            {period}
          </Button>
        </Dropdown>
        <Dropdown menu={{ items: chartTypeItems }}>
          <Button type="text" icon={<LineChartOutlined />}>
            K线图
          </Button>
        </Dropdown>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <Tooltip title="指标、衡量标准和策略">
          <Button
            type="text"
            icon={<FunctionOutlined />}
            onClick={() => setIndicatorModalVisible(true)}
          >
            指标
          </Button>
        </Tooltip>
        <Tooltip title="指标模板">
          <Dropdown menu={{ items: [] }}>
            <Button type="text">模板</Button>
          </Dropdown>
        </Tooltip>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <Tooltip title="创建警报">
          <Button
            type="text"
            onClick={() => setAlertModalVisible(true)}
          >
            <BellOutlined style={{ marginRight: '4px' }} />
            警报
          </Button>
        </Tooltip>
        <Tooltip title="K线回放">
          <Button type="text">
            <PlayCircleOutlined style={{ marginRight: '4px' }} />
            回放
          </Button>
        </Tooltip>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <Tooltip title="撤销">
          <Button type="text" icon={<UndoOutlined />} disabled />
        </Tooltip>
        <Tooltip title="重做">
          <Button type="text" icon={<RedoOutlined />} disabled />
        </Tooltip>
      </div>

      <div style={{ flex: 1 }} />

      <div className={styles.section}>
        <Dropdown menu={{ items: layoutItems }}>
          <Tooltip title="布局设置">
            <Button type="text" icon={<LayoutOutlined />} />
          </Tooltip>
        </Dropdown>
        <Tooltip title="保存布局里的所有图表，包含图表里的全部品种和周期">
          <Button
            type="text"
            onClick={handleSaveLayout}
          >
            <SaveOutlined style={{ marginRight: '4px' }} />
            保存
          </Button>
        </Tooltip>
        <Dropdown menu={{ items: [] }}>
          <Tooltip title="管理布局">
            <Button type="text" icon={<AppstoreOutlined />} />
          </Tooltip>
        </Dropdown>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <Tooltip title="快速搜索">
          <Button type="text" icon={<SearchOutlined />} />
        </Tooltip>
        <Tooltip title="设置">
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setSettingsDrawerVisible(true)}
          />
        </Tooltip>
        <Tooltip title="全屏模式">
          <Button
            type="text"
            icon={<FullscreenOutlined />}
            onClick={handleFullscreen}
          />
        </Tooltip>
        <Dropdown menu={{ items: shareItems }}>
          <Tooltip title="生成快照">
            <Button
              type="text"
              icon={<CameraOutlined />}
              onClick={handleSnapshot}
            />
          </Tooltip>
        </Dropdown>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <Dropdown menu={{ items: [] }}>
          <Button type="primary">
            发表
          </Button>
        </Dropdown>
      </div>

      {/* Modals and Drawers */}
      <SymbolSearchModal
        visible={symbolSearchVisible}
        onClose={() => setSymbolSearchVisible(false)}
        onSelect={handleSymbolSelect}
      />
      <IndicatorModal
        visible={indicatorModalVisible}
        onClose={() => setIndicatorModalVisible(false)}
        onSelect={handleIndicatorSelect}
      />
      <SettingsModal
        visible={settingsDrawerVisible}
        onClose={() => setSettingsDrawerVisible(false)}
      />
      <AlertModal
        visible={alertModalVisible}
        onClose={() => setAlertModalVisible(false)}
        symbol={symbol}
        currentPrice={193.12}
      />
    </div>
    </>
  );
};

export default TopToolbar;
