import React, { useState } from 'react';
import { createStyles } from 'antd-style';
import {
  AimOutlined,
  DragOutlined,
  LineOutlined,
  BorderOutlined,
  RiseOutlined,
  StarOutlined,
  FireOutlined,
  BulbOutlined,
  FontSizeOutlined,
  SmileOutlined,
  ColumnWidthOutlined,
  ZoomInOutlined,
  CloseOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

const useStyles = createStyles(({ token }) => ({
  toolbar: {
    width: '48px',
    background: token.colorBgElevated,
    borderRight: `1px solid ${token.colorBorder}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 0',
    gap: '4px',
    flexShrink: 0,
  },
  toolButton: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: '32px',
    height: '1px',
    background: token.colorBorder,
    margin: '4px 0',
  },
  activeButton: {
    background: token.colorPrimaryBg,
    color: token.colorPrimary,
  },
}));

interface DrawingTool {
  key: string;
  icon: React.ReactNode;
  label: string;
  submenu?: MenuProps['items'];
}

const LeftToolbar: React.FC = () => {
  const { styles, cx } = useStyles();
  const [activeTool, setActiveTool] = useState<string>('cursor');

  const trendLineTools: MenuProps['items'] = [
    { key: 'trendline', label: '趋势线' },
    { key: 'ray', label: '射线' },
    { key: 'extended', label: '延伸线' },
    { key: 'horizontal', label: '水平线' },
    { key: 'vertical', label: '垂直线' },
    { key: 'parallel', label: '平行通道' },
  ];

  const fibonacciTools: MenuProps['items'] = [
    { key: 'fib-retracement', label: '斐波那契回撤' },
    { key: 'fib-extension', label: '斐波那契扩展' },
    { key: 'fib-time', label: '斐波那契时间' },
    { key: 'fib-circle', label: '斐波那契圆' },
  ];

  const patternTools: MenuProps['items'] = [
    { key: 'xabcd', label: 'XABCD 形态' },
    { key: 'abcd', label: 'ABCD 形态' },
    { key: 'cypher', label: 'Cypher' },
    { key: 'butterfly', label: '蝴蝶' },
  ];

  const shapeTools: MenuProps['items'] = [
    { key: 'rectangle', label: '矩形' },
    { key: 'circle', label: '圆形' },
    { key: 'triangle', label: '三角形' },
    { key: 'polygon', label: '多边形' },
  ];

  const forecastTools: MenuProps['items'] = [
    { key: 'long', label: '多头' },
    { key: 'short', label: '空头' },
    { key: 'arrow-up', label: '向上箭头' },
    { key: 'arrow-down', label: '向下箭头' },
  ];

  const tools: DrawingTool[] = [
    { key: 'crosshair', icon: <AimOutlined />, label: '十字线' },
    { key: 'cursor', icon: <DragOutlined />, label: '游标' },
    { key: 'trendline', icon: <LineOutlined />, label: '趋势线', submenu: trendLineTools },
    { key: 'fibonacci', icon: <RiseOutlined />, label: '斐波那契工具', submenu: fibonacciTools },
    { key: 'pattern', icon: <StarOutlined />, label: 'XABCD 形态', submenu: patternTools },
    { key: 'forecast', icon: <FireOutlined />, label: '预测工具', submenu: forecastTools },
    { key: 'brush', icon: <BulbOutlined />, label: '笔刷' },
    { key: 'shape', icon: <BorderOutlined />, label: '几何形状', submenu: shapeTools },
    { key: 'text', icon: <FontSizeOutlined />, label: '文字' },
    { key: 'icon', icon: <SmileOutlined />, label: '图标' },
    { key: 'measure', icon: <ColumnWidthOutlined />, label: '测量' },
    { key: 'zoom', icon: <ZoomInOutlined />, label: '放大' },
  ];

  const handleToolClick = (key: string) => {
    setActiveTool(key);
  };

  const renderTool = (tool: DrawingTool) => {
    const button = (
      <Tooltip title={tool.label} placement="right">
        <Button
          type="text"
          className={cx(
            styles.toolButton,
            activeTool === tool.key && styles.activeButton,
          )}
          icon={tool.icon}
          onClick={() => handleToolClick(tool.key)}
        />
      </Tooltip>
    );

    if (tool.submenu) {
      return (
        <Dropdown
          key={tool.key}
          menu={{ items: tool.submenu }}
          placement="rightTop"
          trigger={['contextMenu']}
        >
          {button}
        </Dropdown>
      );
    }

    return <div key={tool.key}>{button}</div>;
  };

  return (
    <div className={styles.toolbar}>
      {tools.slice(0, 2).map(renderTool)}
      
      <div className={styles.divider} />
      
      {tools.slice(2, 12).map(renderTool)}
      
      <div className={styles.divider} />
      
      <Tooltip title="磁铁模式" placement="right">
        <Button type="text" className={styles.toolButton} icon={<AimOutlined />} />
      </Tooltip>
      <Tooltip title="锁定所有绘图" placement="right">
        <Button type="text" className={styles.toolButton} icon={<LockOutlined />} />
      </Tooltip>
      <Tooltip title="隐藏所有图形" placement="right">
        <Button type="text" className={styles.toolButton} icon={<EyeInvisibleOutlined />} />
      </Tooltip>
      <Tooltip title="移除对象" placement="right">
        <Button type="text" className={styles.toolButton} icon={<DeleteOutlined />} />
      </Tooltip>
    </div>
  );
};

export default LeftToolbar;
