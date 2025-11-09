/**
 * 主题设置面板组件 - 重构版
 * 基于 ProLayout SettingDrawer 的实现方式
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Switch,
  Button,
  Space,
  message,
  Typography,
  Tooltip,
  ColorPicker,
  Slider,
  Segmented,
} from 'antd';
import type { Color } from 'antd/es/color-picker';
import {
  BgColorsOutlined,
  FontSizeOutlined,
  LayoutOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  DesktopOutlined,
  MoonOutlined,
  SunOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { getLayoutSettings } from '@/config/themeToken';
import styles from './ThemePanel.less';

const { Text, Title, Paragraph } = Typography;

interface ThemePanelProps {
  onUpdate?: () => void;
}

// 预设主题色
const PRESET_COLORS = [
  { name: '拂晓蓝', color: '#1890ff', icon: '🌊' },
  { name: '极客蓝', color: '#2f54eb', icon: '💙' },
  { name: '薄暮', color: '#722ed1', icon: '🌆' },
  { name: '青色', color: '#13c2c2', icon: '🎯' },
  { name: '极光绿', color: '#52c41a', icon: '🌿' },
  { name: '日暮', color: '#fa8c16', icon: '🌅' },
  { name: '火山', color: '#f5222d', icon: '🔥' },
  { name: '金盏花', color: '#faad14', icon: '🌼' },
  { name: '酱紫', color: '#eb2f96', icon: '💜' },
];

const ThemePanel: React.FC<ThemePanelProps> = ({ onUpdate }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [resetting, setResetting] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState<number>(14);
  const [currentBorderRadius, setCurrentBorderRadius] = useState<number>(8);

  const settings = initialState?.settings || {};

  // 初始化当前值
  React.useEffect(() => {
    setCurrentFontSize(settings.token?.fontSize || 14);
    setCurrentBorderRadius(settings.token?.borderRadius || 8);
  }, [settings.token?.fontSize, settings.token?.borderRadius]);

  // 更新主题设置（实时全局生效，不刷新页面）
  const handleUpdateTheme = (updates: Record<string, any>) => {
    const newSettings = { ...settings, ...updates };
    const updatedSettings = getLayoutSettings(newSettings);

    // 立即应用CSS变量到:root
    if (updatedSettings.token) {
      const root = document.documentElement;
      Object.entries(updatedSettings.token).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          const cssVarName = `--ant-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          root.style.setProperty(cssVarName, String(value));
        }
      });
    }

    // 更新全局状态（不触发页面刷新）
    setInitialState((prev: any) => ({
      ...prev,
      settings: updatedSettings,
    }));
  };

  // 重置主题设置
  const handleResetTheme = () => {
    setResetting(true);
    
    // 清除所有动态样式
    ['dynamic-font-size', 'dynamic-border-radius', 'dynamic-text-color'].forEach(id => {
      const style = document.getElementById(id);
      if (style) style.remove();
    });
    
    const defaultSettings = {
      navTheme: 'light',
      colorPrimary: '#1890ff',
      layout: 'mix',
      contentWidth: 'Fluid',
      fixedHeader: true,
      fixSiderbar: true,
      token: {
        fontSize: 14,
        borderRadius: 8,
        colorText: '#000000',
      },
    };
    
    setCurrentFontSize(14);
    setCurrentBorderRadius(8);
    handleUpdateTheme(defaultSettings);
    message.success('主题已重置为默认设置');
    
    setTimeout(() => {
      setResetting(false);
    }, 500);
  };

  return (
    <div className={styles.themePanel}>
      {/* 外观模式 */}
      <Card
        title={
          <Space>
            <BgColorsOutlined style={{ fontSize: 18 }} />
            <span>外观模式</span>
          </Space>
        }
        className={styles.settingCard}
      >
        <div style={{ marginBottom: 24 }}>
          <Paragraph type="secondary" style={{ marginBottom: 16 }}>
            选择您喜欢的界面外观风格，深色模式对眼睛更友好
          </Paragraph>
          <Segmented
            value={settings.navTheme === 'realDark' ? 'dark' : 'light'}
            onChange={(value) => handleUpdateTheme({ navTheme: value === 'dark' ? 'realDark' : 'light' })}
            block
            size="large"
            options={[
              {
                label: (
                  <div className={styles.modeOption}>
                    <SunOutlined style={{ fontSize: 20 }} />
                    <span>浅色模式</span>
                  </div>
                ),
                value: 'light',
              },
              {
                label: (
                  <div className={styles.modeOption}>
                    <MoonOutlined style={{ fontSize: 20 }} />
                    <span>深色模式</span>
                  </div>
                ),
                value: 'dark',
              },
            ]}
          />
        </div>

        {/* 主题色选择 */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <Text strong>
              <BulbOutlined /> 主题色
            </Text>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
              选择您喜欢的主色调，将应用到整个系统
            </Text>
          </div>
          
          <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
            {PRESET_COLORS.map((preset) => (
              <Col key={preset.color}>
                <Tooltip title={preset.name}>
                  <div
                    className={styles.colorOption}
                    style={{
                      backgroundColor: preset.color,
                      border: settings.colorPrimary === preset.color 
                        ? '3px solid #000' 
                        : '2px solid #d9d9d9',
                    }}
                    onClick={() => handleUpdateTheme({ colorPrimary: preset.color })}
                  >
                    {settings.colorPrimary === preset.color && (
                      <CheckCircleOutlined style={{ color: '#fff', fontSize: 16 }} />
                    )}
                    <span className={styles.colorEmoji}>{preset.icon}</span>
                  </div>
                </Tooltip>
              </Col>
            ))}
            <Col>
              <ColorPicker
                value={settings.colorPrimary || '#1890ff'}
                onChange={(color: Color) => {
                  handleUpdateTheme({ colorPrimary: color.toHexString() });
                }}
                showText
              >
                <div className={styles.colorOption} style={{ border: '2px dashed #d9d9d9' }}>
                  <ApiOutlined style={{ fontSize: 16 }} />
                </div>
              </ColorPicker>
            </Col>
          </Row>
        </div>
      </Card>

      {/* 字体与样式 */}
      <Card
        title={
          <Space>
            <FontSizeOutlined style={{ fontSize: 18 }} />
            <span>字体与样式</span>
          </Space>
        }
        className={styles.settingCard}
        style={{ marginTop: 16 }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <Text strong>字体大小</Text>
            <Text type="secondary" style={{ marginLeft: 12, fontSize: 12 }}>
              当前: {currentFontSize}px
            </Text>
          </div>
          <Slider
            min={10}
            max={20}
            step={1}
            value={currentFontSize}
            onChange={(value) => {
              setCurrentFontSize(value);
            }}
            onAfterChange={(value) => {
              handleUpdateTheme({ 
                token: { 
                  ...settings.token, 
                  fontSize: value 
                } 
              });
            }}
            marks={{
              10: '10',
              12: '小',
              14: '中',
              16: '大',
              20: '20',
            }}
          />
        </div>

        <div>
          <div style={{ marginBottom: 12 }}>
            <Text strong>圆角大小</Text>
            <Text type="secondary" style={{ marginLeft: 12, fontSize: 12 }}>
              当前: {currentBorderRadius}px
            </Text>
          </div>
          <Slider
            min={0}
            max={20}
            step={1}
            value={currentBorderRadius}
            onChange={(value) => {
              setCurrentBorderRadius(value);
            }}
            onAfterChange={(value) => {
              handleUpdateTheme({ 
                token: { 
                  ...settings.token, 
                  borderRadius: value 
                } 
              });
            }}
            marks={{
              0: '0',
              4: '小',
              8: '中',
              12: '大',
              20: '20',
            }}
          />
        </div>
      </Card>

      {/* 布局配置 */}
      <Card
        title={
          <Space>
            <LayoutOutlined style={{ fontSize: 18 }} />
            <span>布局配置</span>
          </Space>
        }
        className={styles.settingCard}
        style={{ marginTop: 16 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className={styles.settingItem}>
              <div>
                <Text strong>紧凑模式</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  减少间距显示更多内容
                </Text>
              </div>
              <Switch 
                checked={settings.compactMode || false}
                onChange={(checked) => {
                  if (checked) {
                    document.body.classList.add('compact-mode');
                  } else {
                    document.body.classList.remove('compact-mode');
                  }
                  handleUpdateTheme({ compactMode: checked });
                }}
              />
            </div>
          </Col>

          <Col span={12}>
            <div className={styles.settingItem}>
              <div>
                <Text strong>侧边栏收起</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  默认收起侧边栏导航
                </Text>
              </div>
              <Switch 
                checked={settings.collapsed || false}
                onChange={(checked) => handleUpdateTheme({ collapsed: checked })}
              />
            </div>
          </Col>

          <Col span={12}>
            <div className={styles.settingItem}>
              <div>
                <Text strong>固定头部</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  滚动时保持头部固定
                </Text>
              </div>
              <Switch
                checked={settings.fixedHeader}
                onChange={(checked) => handleUpdateTheme({ fixedHeader: checked })}
              />
            </div>
          </Col>

          <Col span={12}>
            <div className={styles.settingItem}>
              <div>
                <Text strong>固定侧边栏</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  滚动时保持侧边栏固定
                </Text>
              </div>
              <Switch
                checked={settings.fixSiderbar}
                onChange={(checked) => handleUpdateTheme({ fixSiderbar: checked })}
              />
            </div>
          </Col>

          <Col span={24}>
            <div className={styles.settingItem}>
              <div>
                <Text strong>内容区域填充</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  自动填充屏幕高度
                </Text>
              </div>
              <Switch 
                checked={settings.contentAreaFillHeight || false}
                onChange={(checked) => handleUpdateTheme({ contentAreaFillHeight: checked })}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 动画效果 */}
      <Card
        title={
          <Space>
            <ApiOutlined style={{ fontSize: 18 }} />
            <span>动画效果</span>
          </Space>
        }
        className={styles.settingCard}
        style={{ marginTop: 16 }}
      >
        <div>
          <Paragraph type="secondary" style={{ marginBottom: 16 }}>
            动画效果可以让界面更加生动，但关闭动画可以提升性能
          </Paragraph>
          <Segmented
            value={settings.animationLevel || 'basic'}
            onChange={(value) => {
              if (value === 'none') {
                document.body.classList.add('no-animations');
              } else {
                document.body.classList.remove('no-animations');
              }
              handleUpdateTheme({ animationLevel: value });
            }}
            block
            options={[
              { label: '关闭', value: 'none' },
              { label: '基础', value: 'basic' },
              { label: '完整', value: 'advanced' },
            ]}
          />
        </div>
      </Card>

      {/* 底部操作栏 */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleResetTheme}
          loading={resetting}
          size="large"
        >
          重置为默认
        </Button>
      </div>
    </div>
  );
};

export default ThemePanel;