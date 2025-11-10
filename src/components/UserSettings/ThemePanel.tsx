/**
 * 主题设置面板组件
 * 基于 theme-spec.md v1.1 规范实现
 * 支持 Light/Dark/Auto 模式、主题色、字体、动效等完整配置
 */

import React, { useState, useEffect } from 'react';
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
  Select,
  Divider,
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
  ThunderboltOutlined,
  FontColorsOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import {
  type ThemeConfig,
  type ThemeMode,
  type AnimationSpeed,
  DEFAULT_THEME_CONFIG,
  PRESET_COLORS,
  loadThemeConfig,
  saveThemeConfig,
  applyThemeToDOM,
  resolveThemeMode,
} from '@/config/themeConfig';
import { getLayoutSettings } from '@/config/themeToken';
import styles from './ThemePanel.less';

const { Text, Title, Paragraph } = Typography;

interface ThemePanelProps {
  onUpdate?: () => void;
  theme?: any; // 兼容旧版接口
}

const ThemePanel: React.FC<ThemePanelProps> = ({ onUpdate }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [resetting, setResetting] = useState(false);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // 初始化：从 localStorage 加载配置
  useEffect(() => {
    const savedConfig = loadThemeConfig();
    setConfig(savedConfig);
    applyThemeToDOM(savedConfig);
    
    // 同步到 initialState
    syncToInitialState(savedConfig);
    
    // 监听系统主题变化
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // 如果是 auto 模式，立即应用
      if (config.mode === 'auto') {
        applyThemeToDOM(config);
        syncToInitialState(config);
      }
    };
    
    setSystemTheme(darkModeQuery.matches ? 'dark' : 'light');
    darkModeQuery.addEventListener('change', handleChange);
    
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  // 同步配置到 initialState（兼容现有系统）
  const syncToInitialState = (themeConfig: ThemeConfig) => {
    const actualMode = resolveThemeMode(themeConfig.mode);
    const settings = {
      navTheme: actualMode === 'dark' ? 'realDark' : 'light',
      colorPrimary: themeConfig.colorPrimary,
      layout: themeConfig.layout,
      fixedHeader: themeConfig.fixedHeader,
      fixSiderbar: themeConfig.fixSiderbar,
      contentWidth: 'Fluid' as const,
    };
    
    const updatedSettings = getLayoutSettings(settings);
    
    setInitialState((prev: any) => ({
      ...prev,
      settings: updatedSettings,
    }));
  };

  // 更新主题配置
  const updateThemeConfig = (updates: Partial<ThemeConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    
    // 立即应用到 DOM
    applyThemeToDOM(newConfig);
    
    // 保存到 localStorage
    saveThemeConfig(newConfig);
    
    // 同步到 initialState
    syncToInitialState(newConfig);
    
    // 触发回调
    onUpdate?.();
  };

  // 重置主题设置
  const handleResetTheme = () => {
    setResetting(true);
    
    setConfig(DEFAULT_THEME_CONFIG);
    applyThemeToDOM(DEFAULT_THEME_CONFIG);
    saveThemeConfig(DEFAULT_THEME_CONFIG);
    syncToInitialState(DEFAULT_THEME_CONFIG);
    
    message.success('主题已重置为默认设置');
    
    setTimeout(() => {
      setResetting(false);
      onUpdate?.();
    }, 500);
  };

  // 获取当前实际主题模式（考虑 auto 模式）
  const actualMode = resolveThemeMode(config.mode);

  return (
    <div className={styles.themePanel}>
      {/* 主题模式 */}
      <Card
        title={
          <Space>
            <BgColorsOutlined style={{ fontSize: 18 }} />
            <span>主题模式</span>
          </Space>
        }
        className={styles.settingCard}
      >
        <div style={{ marginBottom: 24 }}>
          <Paragraph type="secondary" style={{ marginBottom: 16 }}>
            选择界面外观模式。自动模式将跟随系统主题设置
            {config.mode === 'auto' && (
              <Text type="warning" style={{ display: 'block', marginTop: 8 }}>
                当前系统主题: {systemTheme === 'dark' ? '深色' : '浅色'}
              </Text>
            )}
          </Paragraph>
          <Segmented
            value={config.mode}
            onChange={(value) => updateThemeConfig({ mode: value as ThemeMode })}
            block
            size="large"
            options={[
              {
                label: (
                  <div className={styles.modeOption}>
                    <SunOutlined style={{ fontSize: 20 }} />
                    <span>Light</span>
                  </div>
                ),
                value: 'light',
              },
              {
                label: (
                  <div className={styles.modeOption}>
                    <MoonOutlined style={{ fontSize: 20 }} />
                    <span>Dark</span>
                  </div>
                ),
                value: 'dark',
              },
              {
                label: (
                  <div className={styles.modeOption}>
                    <DesktopOutlined style={{ fontSize: 20 }} />
                    <span>Auto</span>
                  </div>
                ),
                value: 'auto',
              },
            ]}
          />
        </div>

        <Divider />

        {/* 主题色选择 */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <Text strong>
              <BulbOutlined /> 主题色
            </Text>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
              选择品牌主色，应用于按钮、链接等交互元素
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
                      border: config.colorPrimary === preset.color 
                        ? '3px solid currentColor' 
                        : '2px solid var(--ant-color-border)',
                      cursor: 'pointer',
                    }}
                    onClick={() => updateThemeConfig({ colorPrimary: preset.color })}
                  >
                    {config.colorPrimary === preset.color && (
                      <CheckCircleOutlined style={{ color: '#fff', fontSize: 16 }} />
                    )}
                  </div>
                </Tooltip>
              </Col>
            ))}
            <Col>
              <ColorPicker
                value={config.colorPrimary}
                onChange={(color: Color) => {
                  updateThemeConfig({ colorPrimary: color.toHexString() });
                }}
                showText
              >
                <div 
                  className={styles.colorOption} 
                  style={{ 
                    border: '2px dashed var(--ant-color-border)',
                    cursor: 'pointer',
                  }}
                >
                  <ApiOutlined style={{ fontSize: 16 }} />
                </div>
              </ColorPicker>
            </Col>
          </Row>
          
          <Text type="secondary" style={{ fontSize: 12 }}>
            当前主题色: <strong>{config.colorPrimary}</strong>
          </Text>
        </div>
      </Card>



      {/* 动效系统 */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined style={{ fontSize: 18 }} />
            <span>动效系统</span>
          </Space>
        }
        className={styles.settingCard}
        style={{ marginTop: 16 }}
      >
        <div>
          <Paragraph type="secondary" style={{ marginBottom: 16 }}>
            控制界面动画的速度和流畅度。关闭动画可以提升低配设备的性能
          </Paragraph>
          <Segmented
            value={config.animationSpeed}
            onChange={(value) => updateThemeConfig({ animationSpeed: value as AnimationSpeed })}
            block
            size="large"
            options={[
              { label: '快速', value: 'fast' },
              { label: '默认', value: 'default' },
              { label: '缓慢', value: 'slow' },
              { label: '关闭', value: 'none' },
            ]}
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
                <Text strong>固定头部</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  滚动时保持头部固定
                </Text>
              </div>
              <Switch
                checked={config.fixedHeader}
                onChange={(checked) => updateThemeConfig({ fixedHeader: checked })}
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
                checked={config.fixSiderbar}
                onChange={(checked) => updateThemeConfig({ fixSiderbar: checked })}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 配置信息 */}
      <Card
        title="当前配置"
        style={{ marginTop: 16 }}
        size="small"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            实际主题模式: <strong>{actualMode}</strong>
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            主题色: <strong>{config.colorPrimary}</strong>
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            动画速度: <strong>{config.animationSpeed}</strong>
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            布局模式: <strong>{config.layout}</strong>
          </Text>
        </Space>
      </Card>

      {/* 底部操作栏 */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleResetTheme}
            loading={resetting}
            size="large"
          >
            重置为默认
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ThemePanel;